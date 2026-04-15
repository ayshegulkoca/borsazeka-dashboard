import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,

    // JWT token'a API'den gelen verileri ekle
    async jwt({ token, user, account }) {
      // Google ile ilk girişte backend handshake yap
      if (account?.provider === "google" && account.id_token) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await fetch(`${apiUrl}/auth/google-signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
          });

          if (response.ok) {
            const data = await response.json();
            // API'den gelen verileri token'a işle
            token.id = data.userId;
            token.accessToken = data.token;
            token.refreshToken = data.refreshToken;
            token.isNewUser = data.isNewUser;
            token.userFromApi = {
              displayName: data.displayName,
              email: data.email,
              pictureUrl: data.pictureUrl,
            };
          }
        } catch (error) {
          console.error("Backend API Auth Error:", error);
        }
      }

      // Fallback: local user id
      if (user?.id && !token.id) {
        token.id = user.id;
      }

      return token;
    },

    // Session'a token verilerini aktar
    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        if (token.accessToken) session.user.accessToken = token.accessToken as string;
        if (token.refreshToken) session.user.refreshToken = token.refreshToken as string;
        if (token.isNewUser !== undefined) session.user.isNewUser = token.isNewUser as boolean;
        
        // Profil bilgilerini API'den gelenlerle güncelle
        if (token.userFromApi) {
          if (token.userFromApi.displayName) session.user.name = token.userFromApi.displayName;
          if (token.userFromApi.pictureUrl) session.user.image = token.userFromApi.pictureUrl;
        }
      }
      return session;
    },
  },
})
