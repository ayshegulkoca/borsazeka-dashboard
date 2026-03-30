import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })

  console.log('Seeding database with mock data...')

  // Create 5 mock users
  const mockUsers = [
    {
      name: 'Ali Yılmaz',
      email: 'ali.yilmaz@example.com',
      firstName: 'Ali',
      lastName: 'Yılmaz',
      phone: '+90 555 123 4567',
      address: 'Levent, Beşiktaş, İstanbul',
      planType: 'PREMIUM',
      status: 'ACTIVE',
    },
    {
      name: 'Ayşe Kaya',
      email: 'ayse.kaya@example.com',
      firstName: 'Ayşe',
      lastName: 'Kaya',
      phone: '+90 532 987 6543',
      address: 'Kadıköy, İstanbul',
      planType: 'PRO',
      status: 'ACTIVE',
    },
    {
      name: 'Mehmet Demir',
      email: 'mehmet.demir@example.com',
      firstName: 'Mehmet',
      lastName: 'Demir',
      phone: '+90 542 333 4455',
      address: 'Çankaya, Ankara',
      planType: 'FREE',
      status: 'ACTIVE',
    },
    {
      name: 'Elif Şahin',
      email: 'elif.sahin@example.com',
      firstName: 'Elif',
      lastName: 'Şahin',
      phone: '+90 555 999 8877',
      address: 'Bornova, İzmir',
      planType: 'PRO',
      status: 'PAST_DUE',
    },
    {
      name: 'Burak Öztürk',
      email: 'burak.ozturk@example.com',
      firstName: 'Burak',
      lastName: 'Öztürk',
      phone: '+90 536 777 6655',
      address: 'Nilüfer, Bursa',
      planType: 'FREE',
      status: 'CANCELLED',
    },
  ]

  for (const data of mockUsers) {
    // Generate a next billing date 30 days from now
    const nextMonth = new Date()
    nextMonth.setDate(nextMonth.getDate() + 30)

    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        name: data.name,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        subscription: {
          create: {
            planType: data.planType,
            status: data.status,
            currentPeriodStart: new Date(),
            nextBillingDate: data.planType !== 'FREE' ? nextMonth : null,
          },
        },
      },
    })
    console.log(`Created user: ${user.email} with ${data.planType} plan`)
  }

  // NOTE: In a real environment with Auth.js, to sign in as one of these users, 
  // you will need the exact email you use with Google OAuth. 
  // Make sure you update your own record or sign in and update your own profile.

  console.log('Seeding finished successfully!')

  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
