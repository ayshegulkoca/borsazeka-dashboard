import { getProfileData, getBillingData } from '@/lib/actions/settings'
import SettingsPage from '../SettingsPage'

export const metadata = {
  title: 'Abonelik & Fatura | BorsaZeka Dashboard',
  description: 'Abonelik ve ödeme geçmişinizi yönetin.',
}

export default async function BillingPageRoute() {
  const [profile, billing] = await Promise.all([
    getProfileData(),
    getBillingData(),
  ])

  return <SettingsPage profile={profile} billing={billing} view="billing" />
}
