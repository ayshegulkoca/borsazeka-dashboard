import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      accessToken?: string
      refreshToken?: string
      isNewUser?: boolean
      pictureUrl?: string
    } & DefaultSession["user"]
  }

  interface User {
    accessToken?: string
    refreshToken?: string
    isNewUser?: boolean
    pictureUrl?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
    refreshToken?: string
    isNewUser?: boolean
    userFromApi?: {
      displayName?: string | null
      email?: string | null
      pictureUrl?: string | null
    }
  }
}
