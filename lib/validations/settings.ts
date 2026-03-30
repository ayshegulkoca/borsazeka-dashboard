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
  email: z
    .string()
    .email('Geçerli bir e-posta adresi girin'),
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
})

export type ProfileFormData = z.infer<typeof profileSchema>

export type ProfileFormState = {
  success: boolean
  message: string
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    phone?: string[]
    address?: string[]
  }
}
