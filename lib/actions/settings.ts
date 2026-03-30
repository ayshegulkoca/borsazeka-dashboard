'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { profileSchema, type ProfileFormState } from '@/lib/validations/settings'

// ─── Update Profile ──────────────────────────────────────────

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth()
  
  if (!session?.user?.email) {
    return {
      success: false,
      message: 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.',
    }
  }

  const userEmail = session.user.email

  const rawData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
  }

  const validated = profileSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      message: 'Lütfen formdaki hataları düzeltin.',
      errors: validated.error.flatten().fieldErrors as ProfileFormState['errors'],
    }
  }

  try {
    await prisma.user.update({
      where: { email: userEmail },
      data: {
        firstName: validated.data.firstName,
        lastName: validated.data.lastName,
        phone: validated.data.phone || null,
        address: validated.data.address || null,
      },
    })

    return {
      success: true,
      message: 'Profil bilgileriniz başarıyla güncellendi.',
    }
  } catch (error) {
    console.error('Profile update error:', error)
    return {
      success: false,
      message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    }
  }
}

// ─── Get Profile Data ────────────────────────────────────────

export async function getProfileData() {
  const session = await auth()
  if (!session?.user?.email) return null
  const userEmail = session.user.email

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        name: true,
        image: true,
      },
    })
    return user
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return null
  }
}

// ─── Get Billing Data ────────────────────────────────────────

export type BillingData = {
  subscription: {
    planType: string
    status: string
    nextBillingDate: string | null
  }
  invoices: {
    id: string
    amount: number
    currency: string
    status: string
    description: string | null
    paidAt: string | null
    createdAt: string
  }[]
}

export async function getBillingData(): Promise<BillingData | null> {
  const session = await auth()
  if (!session?.user?.email) return null
  const userEmail = session.user.email

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        subscription: true,
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!user) return null

    return {
      subscription: {
        planType: user.subscription?.planType ?? 'FREE',
        status: user.subscription?.status ?? 'ACTIVE',
        nextBillingDate: user.subscription?.nextBillingDate?.toISOString() ?? null,
      },
      invoices: user.invoices.map((inv) => ({
        id: inv.id,
        amount: inv.amount,
        currency: inv.currency,
        status: inv.status,
        description: inv.description,
        paidAt: inv.paidAt?.toISOString() ?? null,
        createdAt: inv.createdAt.toISOString(),
      })),
    }
  } catch (error) {
    console.error('Failed to fetch billing data:', error)
    // Return mock data as fallback for development
    return {
      subscription: {
        planType: 'FREE',
        status: 'ACTIVE',
        nextBillingDate: null,
      },
      invoices: [],
    }
  }
}
