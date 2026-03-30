import { getProfileData, getBillingData } from '@/lib/actions/settings'
import SettingsPage from './SettingsPage'

export const metadata = {
  title: 'Ayarlar | BorsaZeka Dashboard',
  description: 'Hesap bilgilerinizi ve aboneliğinizi yönetin.',
}

export default async function SettingsPageRoute() {
  const [profile, billing] = await Promise.all([
    getProfileData(),
    getBillingData(),
  ])

  return <SettingsPage profile={profile} billing={billing} />
}
