import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/', 
  },
  callbacks: {
    authorized: async ({ auth, request: { nextUrl } }) => {
      // Temporarily allow all access for UI testing
      // const isLoggedIn = !!auth?.user
      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true
      //   return false // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl))
      // }
      return true
    },
  },
})
