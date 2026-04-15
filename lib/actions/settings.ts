'use server'

import { revalidatePath } from 'next/cache'
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
    firstName:   formData.get('firstName')   as string,
    lastName:    formData.get('lastName')    as string,
    email:       formData.get('email')       as string,
    gender:      formData.get('gender')      as string,
    phone:       formData.get('phone')       as string,
    address:     formData.get('address')     as string,
    postalCode:  formData.get('postalCode')  as string,
    city:        formData.get('city')        as string,
    country:     formData.get('country')     as string,
    companyName: formData.get('companyName') as string,
    twitter:     formData.get('twitter')     as string,
  }

  const validated = profileSchema.safeParse(rawData)

  if (!validated.success) {
    return {
      success: false,
      message: 'Lütfen formdaki hataları düzeltin.',
      errors: validated.error.flatten().fieldErrors as ProfileFormState['errors'],
    }
  }

  // ── DispatchRequestDto ─────────────────────────────────────────
  const dispatchPayload = {
    firstName:   validated.data.firstName,
    lastName:    validated.data.lastName,
    email:       userEmail,
    gender:      validated.data.gender      || null,
    phone:       validated.data.phone       || null,
    address:     validated.data.address     || null,
    postalCode:  validated.data.postalCode  || null,
    city:        validated.data.city        || null,
    country:     validated.data.country     || null,
    companyName: validated.data.companyName || null,
    twitter:     validated.data.twitter     || null,
  }

  // ── 1. POST to backend /dispatch ───────────────────────────────
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '')
  let accessToken = (session.user as any).accessToken as string | undefined
  const refreshToken = (session.user as any).refreshToken as string | undefined

  const doDispatch = async (token: string | undefined): Promise<Response | null> => {
    if (!API_BASE) return null
    try {
      return await fetch(`${API_BASE}/dispatch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(dispatchPayload),
      })
    } catch (err) {
      console.error('[dispatch] Network error:', err)
      return null
    }
  }

  let dispatchRes = await doDispatch(accessToken)

  // ── 2. 401 → refresh token → retry ────────────────────────────
  if (dispatchRes?.status === 401 && refreshToken && API_BASE) {
    console.warn('[dispatch] 401 received — attempting token refresh...')
    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json()
        accessToken = refreshData.token ?? refreshData.accessToken
        console.info('[dispatch] Token refreshed, retrying...')
        dispatchRes = await doDispatch(accessToken)
      } else {
        console.error('[dispatch] Refresh failed:', refreshRes.status, await refreshRes.text())
        return {
          success: false,
          message: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
        }
      }
    } catch (err) {
      console.error('[dispatch] Refresh request error:', err)
    }
  }

  // Log final dispatch result
  if (dispatchRes && !dispatchRes.ok) {
    const body = await dispatchRes.text().catch(() => '')
    console.error(`[dispatch] API error ${dispatchRes.status}:`, body)
  }

  // ── 3. Prisma — yerel önbellek olarak güncelle ─────────────────
  try {
    await prisma.user.update({
      where: { email: userEmail },
      data: {
        firstName:   validated.data.firstName,
        lastName:    validated.data.lastName,
        gender:      validated.data.gender      || null,
        phone:       validated.data.phone       || null,
        address:     validated.data.address     || null,
        postalCode:  validated.data.postalCode  || null,
        city:        validated.data.city        || null,
        country:     validated.data.country     || null,
        companyName: validated.data.companyName || null,
        twitter:     validated.data.twitter     || null,
      },
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
      message: 'Bilgileriniz başarıyla güncellendi.',
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
        firstName:   true,
        lastName:    true,
        email:       true,
        gender:      true,
        phone:       true,
        address:     true,
        postalCode:  true,
        city:        true,
        country:     true,
        companyName: true,
        twitter:     true,
        name:        true,
        image:       true,
        updatedAt:   true,
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
