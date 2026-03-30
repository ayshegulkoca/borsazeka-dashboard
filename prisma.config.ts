import dotenv from 'dotenv'
import { defineConfig } from 'prisma/config'

// Load .env.local (Next.js convention)
dotenv.config({ path: '.env.local' })

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  migrate: {
    migrations: './prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
