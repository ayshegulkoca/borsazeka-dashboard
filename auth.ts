import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

// ─── JWT Helpers ──────────────────────────────────────────────

const EXPECTED_AUDIENCE = "borsazeka-client"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")

/**
 * Base64-URL decode (JWT segments use base64url, not standard base64)
 */
function base64UrlDecode(str: string): string {
  // Replace URL-safe characters and add padding
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const pad = base64.length % 4
  if (pad) base64 += "=".repeat(4 - pad)
  return Buffer.from(base64, "base64").toString("utf-8")
}

/**
 * BzClientJwtValidator — decode a JWT without signature verification
 * (signature is verified server-side; here we only inspect claims)
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    return JSON.parse(base64UrlDecode(parts[1]))
  } catch {
    return null
  }
}

/**
 * Validate that the JWT audience matches 'borsazeka-client'
 */
function validateJwtAudience(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload) return false

  // aud can be a string or an array
  const aud = payload.aud
  if (Array.isArray(aud)) return aud.includes(EXPECTED_AUDIENCE)
  return aud === EXPECTED_AUDIENCE
}

/**
 * Extract the expiration timestamp (in ms) from a JWT
 */
function getTokenExpiry(token: string): number | null {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return null
  return payload.exp * 1000 // JWT exp is in seconds → convert to ms
}

/**
 * Sonsuz Uzatma (Sliding Expiration):
 * POST /api/auth/refresh → returns { token, refreshToken }
 * Both tokens must be updated on every successful refresh.
 */
async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string
  refreshToken: string
  accessTokenExpires: number
} | null> {
  if (!API_BASE_URL) {
    console.error("[auth] API_BASE_URL is not configured")
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => "")
      console.error(`[auth] Token refresh failed (${response.status}):`, body)
      return null
    }

    const data = await response.json()
    const newAccessToken = data.token
    const newRefreshToken = data.refreshToken

    if (!newAccessToken || !newRefreshToken) {
      console.error("[auth] Refresh response missing token fields:", data)
      return null
    }

    // BzClientJwtValidator: audience check on the fresh token
    if (!validateJwtAudience(newAccessToken)) {
      console.error("[auth] Refreshed token failed audience validation (expected borsazeka-client)")
      return null
    }

    const expiry = getTokenExpiry(newAccessToken)

    console.info("[auth] Token refreshed successfully (sliding expiration)")
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires: expiry ?? Date.now() + 30 * 60 * 1000, // fallback: 30 min
    }
  } catch (error) {
    console.error("[auth] Refresh request network error:", error)
    return null
  }
}

// ─── NextAuth Config ─────────────────────────────────────────

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,

    // JWT token'a API'den gelen verileri ekle + Sliding Expiration
    async jwt({ token, user, account }) {
      // ─── 1. Google ile ilk girişte backend handshake ─────────────
      if (account?.provider === "google" && account.id_token) {
        try {
          // Web Payload Uyumu: deviceId, platform, pushToken gönderilmez
          const signinPayload = { idToken: account.id_token }

          const response = await fetch(`${API_BASE_URL}/auth/google-signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signinPayload),
          })

          if (response.ok) {
            const data = await response.json()

            // BzClientJwtValidator: audience check
            if (data.token && !validateJwtAudience(data.token)) {
              console.error("[auth] Sign-in token failed audience validation (expected borsazeka-client)")
            }

            token.id = data.userId
            token.accessToken = data.token
            token.refreshToken = data.refreshToken
            token.accessTokenExpires = getTokenExpiry(data.token) ?? Date.now() + 30 * 60 * 1000
            token.isNewUser = data.isNewUser
            token.error = undefined
            token.userFromApi = {
              displayName: data.displayName,
              email: data.email,
              pictureUrl: data.pictureUrl,
            }
          } else {
            const body = await response.text().catch(() => "")
            console.error(`[auth] Backend google-signin error (${response.status}):`, body)
          }
        } catch (error) {
          console.error("[auth] Backend API Auth Error:", error)
        }
      }

      // Fallback: local user id
      if (user?.id && !token.id) {
        token.id = user.id
      }

      // ─── 2. Sliding Expiration: proaktif token yenileme ──────────
      // Token yoksa veya refresh yoksa yenileme yapılamaz
      if (token.accessToken && token.refreshToken) {
        const now = Date.now()
        const expires = token.accessTokenExpires ?? 0
        // Token süresinin dolmasına 2 dakikadan az kaldıysa veya zaten dolmuşsa yenile
        const TOKEN_REFRESH_BUFFER_MS = 2 * 60 * 1000

        if (now >= expires - TOKEN_REFRESH_BUFFER_MS) {
          console.info("[auth] Token expired or near expiry, refreshing...")
          const refreshed = await refreshAccessToken(token.refreshToken)

          if (refreshed) {
            // Sliding Expiration: her iki token da güncellenir
            token.accessToken = refreshed.accessToken
            token.refreshToken = refreshed.refreshToken
            token.accessTokenExpires = refreshed.accessTokenExpires
            token.error = undefined
          } else {
            // Refresh başarısız — session hatasını işaretle
            console.error("[auth] Token refresh failed, marking session error")
            token.error = "RefreshTokenExpired"
          }
        }
      }

      return token
    },

    // Session'a token verilerini aktar
    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string
        if (token.accessToken) session.user.accessToken = token.accessToken as string
        if (token.refreshToken) session.user.refreshToken = token.refreshToken as string
        if (token.isNewUser !== undefined) session.user.isNewUser = token.isNewUser as boolean

        // Profil bilgilerini API'den gelenlerle güncelle
        if (token.userFromApi) {
          if (token.userFromApi.displayName) session.user.name = token.userFromApi.displayName
          if (token.userFromApi.pictureUrl) session.user.image = token.userFromApi.pictureUrl
        }
      }
      return session
    },
  },
})
