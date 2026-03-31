import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// Edge uyumlu NextAuth yapılandırması (Prisma olmayan kısımlar)
export default {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

      // Dashboard: sadece giriş yapmış kullanıcılara izin ver
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Giriş yapmayanları / sayfasına at
      }

      // Landing page, checkout ve diğer public sayfalar: herkese açık
      return true
    },
  },
} satisfies NextAuthConfig
