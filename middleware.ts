import { auth } from "@/auth"

export default auth((req) => {
  // auth callback handles the logic via authorized property in auth.ts
})

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
