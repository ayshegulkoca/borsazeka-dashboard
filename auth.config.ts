import type { NextAuthConfig } from "next-auth"

import Google from "next-auth/providers/google"

// Edge uyumlu NextAuth yapılandırması (Prisma olmayan kısımlar)
export default {
  providers: [
    Google({
      // Explicit credentials: Auth.js v5 otomatik çözümleme için AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET
      // ister ama .env.local'de GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET kullanıldığından burada açıkça belirtiyoruz.
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: { strategy: "jwt" },
  trustHost: true,
  // Production HTTPS/SSL ortamında çerezlerin güvenli iletilmesini garantiler.
  // Auth.js bunu NEXTAUTH_URL protokolü "https:" olduğunda otomatik yapsa da
  // açıkça belirtmek reverse-proxy senaryolarında ek güvenlik sağlar.
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
        // Mevcut kullanıcılar /urun-sec (Wizard) dahil tüm sayfalara serbestçe erişebilir
        return true;
      }
    },
  },
} satisfies NextAuthConfig
