import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// ─── JWT Helpers ──────────────────────────────────────────────

const EXPECTED_AUDIENCE = "borsazeka-client"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const pad = base64.length % 4
  if (pad) base64 += "=".repeat(4 - pad)
  return typeof Buffer !== 'undefined'
    ? Buffer.from(base64, "base64").toString("utf-8")
    : decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    return JSON.parse(base64UrlDecode(parts[1]))
  } catch {
    return null
  }
}

function validateJwtAudience(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload) return false

  const aud = payload.aud
  if (Array.isArray(aud)) return aud.includes(EXPECTED_AUDIENCE)
  return aud === EXPECTED_AUDIENCE
}

function getTokenExpiry(token: string): number | null {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return null
  return payload.exp * 1000
}

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

    if (!validateJwtAudience(newAccessToken)) {
      console.error("[auth] Refreshed token failed audience validation (expected borsazeka-client)")
      return null
    }

    const expiry = getTokenExpiry(newAccessToken)

    console.info("[auth] Token refreshed successfully (sliding expiration)")
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires: expiry ?? Date.now() + 30 * 60 * 1000,
    }
  } catch (error) {
    console.error("[auth] Refresh request network error:", error)
    return null
  }
}

// ─── Edge-compatible Config ───────────────────────────────────

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const isNewUser = (auth?.user as any)?.isNewUser;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnOnboarding = nextUrl.pathname.startsWith("/urun-sec");

      if (!isLoggedIn) {
        if (isOnDashboard || isOnOnboarding) return false;
        return true;
      }

      if (isNewUser) {
        if (isOnDashboard) {
          return Response.redirect(new URL("/urun-sec", nextUrl));
        }
        return true;
      } else {
        return true;
      }
    },

    async jwt({ token, user, account }) {
      console.log("[auth] jwt callback. token email:", token?.email, "hasAccessToken:", !!token?.accessToken, "hasUser:", !!user, "hasAccount:", !!account)
      
      // ─── 1. Google ile ilk girişte backend handshake ─────────────
      if (account?.provider === "google" && account.id_token) {
        try {
          const signinPayload = {
            idToken:     account.id_token,
            accessToken: account.access_token,
            mail:        user?.email ?? "",
          }
          const handshakeUrl = `${API_BASE_URL}/auth/google-signin`

          console.log("[auth] ── google-signin handshake başlıyor ──")
          console.log("[auth] URL:", handshakeUrl)
          console.log("[auth] payload keys:", Object.keys(signinPayload))
          console.log("[auth] mail:", signinPayload.mail)
          console.log("[auth] idToken (ilk 30):", account.id_token?.slice(0, 30))
          console.log("[auth] accessToken (ilk 20):", account.access_token?.slice(0, 20))

          const response = await fetch(handshakeUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signinPayload),
          })

          console.log("[auth] google-signin yanıt status:", response.status, response.statusText)

          console.log("[auth] ── Response Headers ──")
          response.headers.forEach((value, key) => {
            console.log(`[auth] header: ${key} = ${value}`)
          })
          console.log("[auth] ─────────────────────")

          if (response.ok) {
            const data = await response.json()
            console.log("[auth] google-signin BAŞARILI — token alındı:", {
              userId: data.userId,
              hasToken: !!data.token,
              hasRefreshToken: !!data.refreshToken,
            })

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
            console.error(`[auth] ❌ google-signin BAŞARISIZ (${response.status}):`, body || "(boş body)")
            console.error("[auth] Kullanıcı BorsaZeka token olmadan devam edecek!")
          }
        } catch (error) {
          console.error("[auth] ❌ google-signin NETWORK HATASI:", error)
          console.error("[auth] API_BASE_URL:", API_BASE_URL ?? "TANIMLANMAMIŞ!")
        }
      }

      if (user?.id && !token.id) {
        token.id = user.id
      }

      // ─── 2. Sliding Expiration: proaktif token yenileme ──────────
      if (token.accessToken && token.refreshToken) {
        const now = Date.now()
        const expires = token.accessTokenExpires ?? 0
        const TOKEN_REFRESH_BUFFER_MS = 2 * 60 * 1000

        if (now >= expires - TOKEN_REFRESH_BUFFER_MS) {
          console.info("[auth] Token expired or near expiry, refreshing...")
          const refreshed = await refreshAccessToken(token.refreshToken)

          if (refreshed) {
            token.accessToken = refreshed.accessToken
            token.refreshToken = refreshed.refreshToken
            token.accessTokenExpires = refreshed.accessTokenExpires
            token.error = undefined
          } else {
            console.error("[auth] Token refresh failed, marking session error")
            token.error = "RefreshTokenExpired"
          }
        }
      }

      console.log("[auth] jwt callback returning token. hasAccessToken:", !!token.accessToken)
      return token
    },

    async session({ session, token }) {
      console.log("[auth] session callback. token email:", token?.email, "hasAccessToken:", !!token?.accessToken, "session email:", session?.user?.email)
      if (session.user) {
        if (token.id) session.user.id = token.id as string
        if (token.accessToken) session.user.accessToken = token.accessToken as string
        if (token.refreshToken) session.user.refreshToken = token.refreshToken as string
        if (token.isNewUser !== undefined) session.user.isNewUser = token.isNewUser as boolean

        if (token.userFromApi) {
          if (token.userFromApi.displayName) session.user.name = token.userFromApi.displayName
          if (token.userFromApi.pictureUrl) session.user.image = token.userFromApi.pictureUrl
        }
      }
      console.log("[auth] session callback returning session. hasAccessToken:", !!session.user?.accessToken)
      return session
    },
  },
} satisfies NextAuthConfig
