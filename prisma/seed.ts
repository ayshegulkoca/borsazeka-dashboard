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

  // Create 5 mock users with full profile
  const mockUsers = [
    {
      name: 'Ali Yılmaz',
      email: 'ali.yilmaz@example.com',
      firstName: 'Ali',
      lastName: 'Yılmaz',
      gender: 'Erkek',
      phone: '+90 555 123 4567',
      address: 'Büyükdere Caddesi No:12',
      postalCode: '34394',
      city: 'İstanbul',
      country: 'Türkiye',
      companyName: 'Yılmaz Yatırım A.Ş.',
      twitter: '@aliyilmaz',
      planType: 'PREMIUM',
      status: 'ACTIVE',
    },
    {
      name: 'Ayşe Kaya',
      email: 'ayse.kaya@example.com',
      firstName: 'Ayşe',
      lastName: 'Kaya',
      gender: 'Kadın',
      phone: '+90 532 987 6543',
      address: 'Bağdat Caddesi No:45',
      postalCode: '34710',
      city: 'İstanbul',
      country: 'Türkiye',
      companyName: '',
      twitter: '@aysekaya',
      planType: 'PRO',
      status: 'ACTIVE',
    },
    {
      name: 'Mehmet Demir',
      email: 'mehmet.demir@example.com',
      firstName: 'Mehmet',
      lastName: 'Demir',
      gender: 'Erkek',
      phone: '+90 542 333 4455',
      address: 'Atatürk Bulvarı No:78',
      postalCode: '06100',
      city: 'Ankara',
      country: 'Türkiye',
      companyName: 'Demir Finans',
      twitter: '',
      planType: 'FREE',
      status: 'ACTIVE',
    },
    {
      name: 'Elif Şahin',
      email: 'elif.sahin@example.com',
      firstName: 'Elif',
      lastName: 'Şahin',
      gender: 'Kadın',
      phone: '+90 555 999 8877',
      address: 'Alsancak Mah. Cumhuriyet Blv. No:5',
      postalCode: '35220',
      city: 'İzmir',
      country: 'Türkiye',
      companyName: '',
      twitter: '@elifsahin',
      planType: 'PRO',
      status: 'PAST_DUE',
    },
    {
      name: 'Burak Öztürk',
      email: 'burak.ozturk@example.com',
      firstName: 'Burak',
      lastName: 'Öztürk',
      gender: 'Erkek',
      phone: '+90 536 777 6655',
      address: 'Nilüfer Mah. Atatürk Cad. No:22',
      postalCode: '16110',
      city: 'Bursa',
      country: 'Türkiye',
      companyName: 'Öztürk Holding',
      twitter: '@burakozturk',
      planType: 'FREE',
      status: 'CANCELLED',
    },
  ]

  for (const data of mockUsers) {
    const nextMonth = new Date()
    nextMonth.setDate(nextMonth.getDate() + 30)

    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {
        firstName:   data.firstName,
        lastName:    data.lastName,
        gender:      data.gender      || null,
        phone:       data.phone       || null,
        address:     data.address     || null,
        postalCode:  data.postalCode  || null,
        city:        data.city        || null,
        country:     data.country     || null,
        companyName: data.companyName || null,
        twitter:     data.twitter     || null,
      },
      create: {
        name:        data.name,
        email:       data.email,
        firstName:   data.firstName,
        lastName:    data.lastName,
        gender:      data.gender      || null,
        phone:       data.phone       || null,
        address:     data.address     || null,
        postalCode:  data.postalCode  || null,
        city:        data.city        || null,
        country:     data.country     || null,
        companyName: data.companyName || null,
        twitter:     data.twitter     || null,
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
    console.log(`✓ Upserted user: ${user.email} (${data.planType})`)
  }

  console.log('\nSeeding finished successfully!')
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
