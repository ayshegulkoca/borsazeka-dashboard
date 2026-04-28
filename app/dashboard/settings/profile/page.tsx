import { getProfileData, getBillingData } from '@/lib/actions/settings'
import SettingsPage from '../SettingsPage'

export const metadata = {
  title: 'Profil | BorsaZeka Dashboard',
  description: 'Hesap bilgilerinizi yönetin.',
}

export default async function ProfilePageRoute() {
  const [profile, billing] = await Promise.all([
    getProfileData(),
    getBillingData(),
  ])

  return <SettingsPage profile={profile} billing={billing} view="profile" />
}
