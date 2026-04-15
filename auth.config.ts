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
  trustHost: true,
  pages: {
    signIn: '/',
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const isNewUser = (auth?.user as any)?.isNewUser;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnOnboarding = nextUrl.pathname.startsWith("/urun-sec");

      // Giriş yapmamışsa sadece public sayfalara izin ver
      if (!isLoggedIn) {
        if (isOnDashboard || isOnOnboarding) return false;
        return true;
      }

      // Giriş yapmış kullanıcılar için akıllı yönlendirme
      if (isNewUser) {
        // Yeni kullanıcılar sadece onboarding'e gidebilir veya dashboard'a girmeye çalışırlarsa oraya yönlendirilir
        if (isOnDashboard) {
          return Response.redirect(new URL("/urun-sec", nextUrl));
        }
        return true;
      } else {
        // Mevcut kullanıcılar onboarding'e girmeye çalışırsa dashboard'a atalım (opsiyonel ama plan gereği)
        if (isOnOnboarding) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
    },
  },
} satisfies NextAuthConfig
