import { getBillingData } from '@/lib/actions/settings'
import SettingsPage from '../SettingsPage'

export const metadata = {
  title: 'Abonelik & Fatura | BorsaZeka Dashboard',
  description: 'Abonelik ve ödeme geçmişinizi yönetin.',
}

export default async function BillingPageRoute() {
  const billing = await getBillingData()

  return <SettingsPage profile={null} billing={billing} view="billing" />
}
