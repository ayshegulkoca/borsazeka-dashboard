import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,

    // JWT token'a user.id ekle (ilk girişte user nesnesi gelir)
    async jwt({ token, user, account }) {
      if (user?.id) {
        token.id = user.id
      }
      // Eğer id yoksa ama email varsa DB'den bul (fallback)
      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { id: true },
        })
        if (dbUser) token.id = dbUser.id
      }
      return token
    },

    // Session'a user.id geçir
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
