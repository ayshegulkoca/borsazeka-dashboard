import { getBillingData } from '@/lib/actions/settings'
import SettingsPage from '../SettingsPage'

export const metadata = {
  title: 'Profil | BorsaZeka Dashboard',
  description: 'Hesap bilgilerinizi yönetin.',
}

export default async function ProfilePageRoute() {
  // Profil verisi artık istemci tarafında fetchMyProfile() ile çekiliyor.
  // Yalnızca billing verisi sunucu tarafında hazırlanır.
  const billing = await getBillingData()

  return <SettingsPage profile={null} billing={billing} view="profile" />
}
