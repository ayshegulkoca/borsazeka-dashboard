import { z } from 'zod'

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(50, 'Ad en fazla 50 karakter olabilir'),
  lastName: z
    .string()
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .max(50, 'Soyad en fazla 50 karakter olabilir'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  gender: z
    .string()
    .max(20, 'Cinsiyet en fazla 20 karakter olabilir')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Telefon numarası en fazla 20 karakter olabilir')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'Adres en fazla 200 karakter olabilir')
    .optional()
    .or(z.literal('')),
  postalCode: z
    .string()
    .max(20, 'Posta kodu en fazla 20 karakter olabilir')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .max(100, 'Şehir en fazla 100 karakter olabilir')
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .max(100, 'Ülke en fazla 100 karakter olabilir')
    .optional()
    .or(z.literal('')),
  companyName: z
    .string()
    .max(100, 'Şirket adı en fazla 100 karakter olabilir')
    .optional()
    .or(z.literal('')),
  twitter: z
    .string()
    .max(100, 'Twitter en fazla 100 karakter olabilir')
    .optional()
    .or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>

export type ProfileFormState = {
  success: boolean
  message: string
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    gender?: string[]
    phone?: string[]
    address?: string[]
    postalCode?: string[]
    city?: string[]
    country?: string[]
    companyName?: string[]
    twitter?: string[]
  }
}
