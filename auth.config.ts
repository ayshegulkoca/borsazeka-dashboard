import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// Edge uyumlu NextAuth yapılandırması (Prisma olmayan kısımlar)
export default {
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account", // Her seferinde hesap seçme ekranını zorla
        },
      },
    }),
  ],
  session: { strategy: "jwt" }, // Helps with Edge runtimes/Vercel
  pages: {
    signIn: '/', 
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      // Gerçek Auth kontrolü: Giriş yapılmış mı?
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Giriş yapmayanları login sayfasına at
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl)) // Login olanı dashboard'a at
      }
      
      return true
    },
  },
} satisfies NextAuthConfig
