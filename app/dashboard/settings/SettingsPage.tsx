'use client'

import { useState, useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import {
  User,
  CreditCard,
  Save,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Crown,
  CalendarClock,
  ExternalLink,
  Receipt,
  Building,
  Globe,
  Map,
  Lock,
  Hash,
  RefreshCw,
  LogIn,
} from 'lucide-react'

// X (Twitter) logo helper
function XIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4l11.733 16H20L8.267 4z" />
      <path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
    </svg>
  )
}

import { updateProfile, fetchMyProfile } from '@/lib/actions/settings'
import type { ProfileFormState } from '@/lib/validations/settings'
import type { BillingData } from '@/lib/actions/settings'
import styles from './settings.module.css'

// ─── Types ───────────────────────────────────────────────────

/** Form state — controlled component için tüm alanlar */
type ProfileFormValues = {
  userId:      string   // API: data.userId  → Müşteri Numarası (readOnly)
  email:       string   // API: data.email   → Email (readOnly)
  firstName:   string   // API: data.firstName
  lastName:    string   // API: data.lastName
  phone:       string   // API: data.phone
  address:     string   // API: data.address
  postalCode:  string   // API: data.postalCode
  city:        string   // API: data.city
  country:     string   // API: data.country
  gender:      string   // API'de yok → ''
  companyName: string   // API'de yok → ''
  twitter:     string   // API'de yok → ''
}

const EMPTY_FORM: ProfileFormValues = {
  userId:      '',
  email:       '',
  firstName:   '',
  lastName:    '',
  phone:       '',
  address:     '',
  postalCode:  '',
  city:        '',
  country:     '',
  gender:      '',
  companyName: '',
  twitter:     '',
}

type SettingsPageProps = {
  profile: null  // Artık kullanılmıyor — veri client-side API'den çekiliyor
  billing: BillingData | null
  view?: 'profile' | 'billing'
}

// ─── Submit Button (uses useFormStatus) ──────────────────────

function SubmitButton() {
  const { pending } = useFormStatus()
  const { t } = useTranslation('common')

  return (
    <button
      type="submit"
      className={styles.submitButton}
      disabled={pending}
      id="settings-save-btn"
    >
      {pending ? (
        <>
          <span className={styles.spinner} />
          {t('dashboard.settings.saving')}
        </>
      ) : (
        <>
          <Save size={16} />
          {t('dashboard.settings.save')}
        </>
      )}
    </button>
  )
}

// ─── Shimmer Skeleton ─────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        {/* Card başlık iskelet */}
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonDesc}`} style={{ marginBottom: '1.5rem' }} />

        <div className={styles.formGrid}>
          {/* Müşteri No */}
          <div className={styles.formGroup}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Email — full width */}
          <div className={`${styles.formGroup} ${styles.fieldFullWidth}`}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Ad */}
          <div className={styles.formGroup}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Soyad */}
          <div className={styles.formGroup}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Cinsiyet */}
          <div className={styles.formGroup}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Telefon */}
          <div className={styles.formGroup}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Adres */}
          <div className={styles.formGroup}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Posta Kodu */}
          <div className={styles.formGroup}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Şehir */}
          <div className={styles.formGroup}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Ülke */}
          <div className={styles.formGroup}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Şirket Adı — full width */}
          <div className={`${styles.formGroup} ${styles.fieldFullWidth}`}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>

          {/* Twitter — full width */}
          <div className={`${styles.formGroup} ${styles.fieldFullWidth}`}>
            <div className={`${styles.skeleton} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeleton} ${styles.skeletonInput}`} />
          </div>
        </div>

        {/* Form actions iskelet */}
        <div className={styles.formActions} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div className={`${styles.skeleton}`} style={{ width: '160px', height: '18px', borderRadius: '4px' }} />
          <div className={`${styles.skeleton}`} style={{ width: '120px', height: '40px', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  )
}

// ─── API Error Panel ──────────────────────────────────────────

function ApiErrorPanel({
  error,
  status,
  onRetry,
}: {
  error: string
  status?: number
  onRetry: () => void
}) {
  const router = useRouter()

  const isNoToken   = error === 'NO_BORSAZEKA_TOKEN'
  const isAuthError = error === 'UNAUTHORIZED' || status === 401 || status === 403
  const isNetwork   = error === 'NETWORK_ERROR'

  const title = isNoToken
    ? 'BorsaZeka Oturum Tokeni Bulunamadı'
    : isAuthError
      ? `API ${status ?? 401} — Yetkilendirme Hatası`
      : isNetwork
        ? 'Bağlantı Hatası'
        : `API ${status ?? ''} — Sunucu Hatası`

  const description = isNoToken
    ? 'Google girişiniz başarılı ancak BorsaZeka sunucusundan yetki tokeni alınamadı. Çıkış yapıp tekrar giriş yapmayı deneyin. Sorun devam ederse backend sunucusu erişilemez durumda olabilir.'
    : isAuthError
      ? 'Oturumunuz sona ermiş ya da bu sayfaya erişim yetkiniz yok. Lütfen tekrar giriş yapın.'
      : isNetwork
        ? 'BorsaZeka sunucusuna ulaşılamıyor. İnternet bağlantınızı kontrol edin ve tekrar deneyin.'
        : 'Profil bilgileri yüklenirken bir sunucu hatası oluştu. Lütfen tekrar deneyin.'

  return (
    <div className={styles.tabContent}>
      <div className={styles.apiErrorPanel} role="alert">
        <div className={styles.apiErrorIconRow}>
          <AlertTriangle size={22} className={styles.apiErrorIcon} />
          <span className={styles.apiErrorTitle}>{title}</span>
        </div>
        <p className={styles.apiErrorDesc}>{description}</p>
        <div className={styles.apiErrorActions}>
          <button
            type="button"
            className={styles.apiRetryBtn}
            onClick={onRetry}
            id="profile-retry-btn"
          >
            <RefreshCw size={14} />
            Tekrar Dene
          </button>
          {(isAuthError || isNoToken) && (
            <button
              type="button"
              className={styles.apiLoginBtn}
              onClick={() => router.push('/login')}
              id="profile-login-btn"
            >
              <LogIn size={14} />
              Giriş Yap
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Profile Tab Content ──────────────────────────────────────

function ProfileTab({
  formValues,
  onChange,
  state,
  formAction,
}: {
  formValues:  ProfileFormValues
  onChange:    (field: keyof ProfileFormValues, value: string) => void
  state:       ProfileFormState
  formAction:  (payload: FormData) => void
}) {
  const { t } = useTranslation('common')
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({})
  const [validationMsg, setValidationMsg] = useState<{ id: string; msg: string } | null>(null)

  const triggerInvalid = (id: string, msg = 'Sadece rakam giriniz') => {
    setInvalidFields(prev => ({ ...prev, [id]: true }))
    setValidationMsg({ id, msg })
    setTimeout(() => setInvalidFields(prev => ({ ...prev, [id]: false })), 400)
    setTimeout(() => setValidationMsg(null), 2500)
  }

  const handleNumericInput = (
    e: React.FormEvent<HTMLInputElement>,
    field: keyof ProfileFormValues,
    limit?: number
  ) => {
    const input = e.currentTarget
    const id    = input.id
    const value = input.value
    const clean = value.replace(/[^0-9]/g, '')

    if (value !== clean) {
      triggerInvalid(id)
    }

    const final = limit && clean.length > limit ? clean.slice(0, limit) : clean
    if (final !== clean && limit) {
      triggerInvalid(id, `Maksimum ${limit} karakter girebilirsiniz`)
    }

    onChange(field, limit ? final : clean)
  }

  const handlePhoneInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const value = input.value
    const clean = value.replace(/[^0-9+]/g, '')
    if (value !== clean) triggerInvalid(input.id, 'Sadece rakam ve + işareti girebilirsiniz')
    onChange('phone', clean)
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{t('dashboard.settings.profileTitle')}</h3>
        <p className={styles.cardDescription}>{t('dashboard.settings.profileDesc')}</p>

        <form action={formAction}>
          <div className={styles.formGrid}>

            {/* ── Müşteri Numarası (userId — readOnly, kilit rozeti) ── */}
            <div className={styles.formGroup}>
              <label htmlFor="customerId" className={styles.label}>
                <Hash size={14} />
                {t('dashboard.settings.customerId')}
                <span className={styles.lockedBadge}>
                  <Lock size={11} />
                  {t('dashboard.settings.emailLocked')}
                </span>
              </label>
              <div className={styles.inputLockWrapper}>
                <Lock size={14} className={styles.lockIcon} />
                <input
                  id="customerId"
                  name="customerId"
                  type="text"
                  className={`${styles.input} ${styles.inputLocked}`}
                  value={formValues.userId}
                  onChange={() => {/* readOnly — değiştirilemez */}}
                  readOnly
                  aria-readonly="true"
                />
              </div>
            </div>

            {/* ── Email (readOnly, kilit rozeti) ── */}
            <div className={`${styles.formGroup} ${styles.fieldFullWidth}`}>
              <label htmlFor="email" className={styles.label}>
                <Mail size={14} />
                Email *
                <span className={styles.lockedBadge}>
                  <Lock size={11} />
                  {t('dashboard.settings.emailLocked')}
                </span>
              </label>
              <div className={styles.inputLockWrapper}>
                <Lock size={14} className={styles.lockIcon} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`${styles.input} ${styles.inputLocked}`}
                  value={formValues.email}
                  onChange={() => {/* readOnly */}}
                  readOnly
                  aria-readonly="true"
                />
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                {t('dashboard.settings.emailNote')}
              </span>
            </div>

            {/* ── Ad ── */}
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                <User size={14} />
                {t('dashboard.settings.firstName')} *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={styles.input}
                value={formValues.firstName}
                onChange={e => onChange('firstName', e.target.value)}
                placeholder={t('dashboard.settings.firstNamePlaceholder')}
                required
              />
              {state.errors?.firstName && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.firstName[0]}
                </span>
              )}
            </div>

            {/* ── Soyad ── */}
            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>
                <User size={14} />
                {t('dashboard.settings.lastName')} *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className={styles.input}
                value={formValues.lastName}
                onChange={e => onChange('lastName', e.target.value)}
                placeholder={t('dashboard.settings.lastNamePlaceholder')}
                required
              />
              {state.errors?.lastName && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.lastName[0]}
                </span>
              )}
            </div>

            {/* ── Cinsiyet ── */}
            <div className={styles.formGroup}>
              <label htmlFor="gender" className={styles.label}>
                <User size={14} />
                {t('dashboard.settings.gender')}
              </label>
              <select
                id="gender"
                name="gender"
                className={styles.input}
                value={formValues.gender}
                onChange={e => onChange('gender', e.target.value)}
              >
                <option value="">{t('dashboard.settings.genderSelect')}</option>
                <option value="Erkek">{t('dashboard.settings.genderMale')}</option>
                <option value="Kadın">{t('dashboard.settings.genderFemale')}</option>
              </select>
              {state.errors?.gender && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.gender[0]}
                </span>
              )}
            </div>

            {/* ── Telefon ── */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                <Phone size={14} />
                {t('dashboard.settings.phone')} *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`${styles.input} ${invalidFields.phone ? styles.inputInvalid : ''}`}
                value={formValues.phone}
                onChange={e => onChange('phone', e.target.value)}
                onInput={handlePhoneInput}
                placeholder={t('dashboard.settings.phonePlaceholder')}
              />
              {validationMsg?.id === 'phone' && (
                <span className={styles.fieldError} style={{ marginTop: '2px', fontSize: '0.7rem' }}>
                  {validationMsg.msg}
                </span>
              )}
              {state.errors?.phone && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.phone[0]}
                </span>
              )}
            </div>

            {/* ── Adres ── */}
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                <MapPin size={14} />
                {t('dashboard.settings.address')} *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className={styles.input}
                value={formValues.address}
                onChange={e => onChange('address', e.target.value)}
                placeholder={t('dashboard.settings.addressPlaceholder')}
              />
              {state.errors?.address && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.address[0]}
                </span>
              )}
            </div>

            {/* ── Posta Kodu ── */}
            <div className={styles.formGroup}>
              <label htmlFor="postalCode" className={styles.label}>
                <Map size={14} />
                {t('dashboard.settings.postalCode')}
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                className={`${styles.input} ${invalidFields.postalCode ? styles.inputInvalid : ''}`}
                value={formValues.postalCode}
                onChange={e => onChange('postalCode', e.target.value)}
                onInput={e => handleNumericInput(e, 'postalCode', 10)}
                placeholder="34000"
              />
              {validationMsg?.id === 'postalCode' && (
                <span className={styles.fieldError} style={{ marginTop: '2px', fontSize: '0.7rem' }}>
                  {validationMsg.msg}
                </span>
              )}
              {state.errors?.postalCode && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.postalCode[0]}
                </span>
              )}
            </div>

            {/* ── Şehir ── */}
            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.label}>
                <MapPin size={14} />
                {t('dashboard.settings.city')} *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                className={styles.input}
                value={formValues.city}
                onChange={e => onChange('city', e.target.value)}
                placeholder={t('dashboard.settings.cityPlaceholder')}
              />
              {state.errors?.city && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.city[0]}
                </span>
              )}
            </div>

            {/* ── Ülke ── */}
            <div className={styles.formGroup}>
              <label htmlFor="country" className={styles.label}>
                <Globe size={14} />
                {t('dashboard.settings.country')} *
              </label>
              <input
                id="country"
                name="country"
                type="text"
                className={styles.input}
                value={formValues.country}
                onChange={e => onChange('country', e.target.value)}
                placeholder={t('dashboard.settings.countryPlaceholder')}
              />
              {state.errors?.country && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.country[0]}
                </span>
              )}
            </div>

            {/* ── Şirket Adı (full width) ── */}
            <div className={`${styles.formGroup} ${styles.fieldFullWidth}`}>
              <label htmlFor="companyName" className={styles.label}>
                <Building size={14} />
                {t('dashboard.settings.companyName')}
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                className={styles.input}
                value={formValues.companyName}
                onChange={e => onChange('companyName', e.target.value)}
                placeholder={t('dashboard.settings.companyNamePlaceholder')}
              />
              {state.errors?.companyName && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.companyName[0]}
                </span>
              )}
            </div>

            {/* ── Twitter (full width) ── */}
            <div className={`${styles.formGroup} ${styles.fieldFullWidth}`}>
              <label htmlFor="twitter" className={styles.label}>
                <XIcon size={14} />
                {t('dashboard.settings.twitter')}
              </label>
              <input
                id="twitter"
                name="twitter"
                type="text"
                className={styles.input}
                value={formValues.twitter}
                onChange={e => onChange('twitter', e.target.value)}
                placeholder={t('dashboard.settings.twitterPlaceholder')}
              />
              {state.errors?.twitter && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.twitter[0]}
                </span>
              )}
            </div>

          </div>

          {/* ── Form Actions ── */}
          <div className={styles.formActions}>
            <div>
              {state.message && (
                <div className={state.success ? styles.statusSuccess : styles.statusError}>
                  {state.success ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {state.message}
                </div>
              )}
            </div>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Billing Tab Content ──────────────────────────────────────

function BillingTab({ billing }: { billing: BillingData | null }) {
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language?.startsWith('en') ? 'en-US' : 'tr-TR'

  const plan      = billing?.subscription.planType    ?? 'FREE'
  const status    = billing?.subscription.status      ?? 'ACTIVE'
  const periodEnd = billing?.subscription.nextBillingDate ?? null
  const invoices  = billing?.invoices ?? []

  const planLabels: Record<string, string> = {
    FREE:    t('dashboard.settings.planFree'),
    PRO:     t('dashboard.settings.planPro'),
    PREMIUM: t('dashboard.settings.planPremium'),
  }

  const planBadgeClass: Record<string, string> = {
    FREE:    styles.badgeFree,
    PRO:     styles.badgePro,
    PREMIUM: styles.badgePremium,
  }

  const statusLabels: Record<string, string> = {
    ACTIVE:    t('dashboard.settings.statusActive'),
    CANCELLED: t('dashboard.settings.statusCancelled'),
    PAST_DUE:  t('dashboard.settings.statusPastDue'),
    TRIALING:  t('dashboard.settings.statusTrialing'),
  }

  const statusClass: Record<string, string> = {
    ACTIVE:    styles.statusActive,
    CANCELLED: styles.statusCancelled,
    PAST_DUE:  styles.statusPastDue,
    TRIALING:  styles.statusTrialing,
  }

  function formatRenewalDate(isoDate: string | null): string {
    if (!isoDate) return t('dashboard.settings.renewalNoDate')
    return new Date(isoDate).toLocaleDateString(locale, {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  function getDaysUntilRenewal(isoDate: string | null): string {
    if (!isoDate) return ''
    const diff = Math.ceil((new Date(isoDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return t('dashboard.settings.renewalExpired')
    if (diff === 0) return t('dashboard.settings.renewalToday')
    if (diff === 1) return t('dashboard.settings.renewalDay')
    return t('dashboard.settings.renewalDays', { days: diff })
  }

  function formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency', currency,
    }).format(amount / 100)
  }

  function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString(locale, {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  const invoiceStatusClass: Record<string, string> = {
    PAID:    styles.invoicePaid,
    PENDING: styles.invoicePending,
    FAILED:  styles.invoiceFailed,
  }

  const invoiceStatusLabel: Record<string, string> = {
    PAID:    t('dashboard.settings.invoicePaid'),
    PENDING: t('dashboard.settings.invoicePending'),
    FAILED:  t('dashboard.settings.invoiceFailed'),
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 className={styles.cardTitle}>
              <Receipt size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
              {t('dashboard.settings.billingHistory')}
            </h3>
            <p className={styles.cardDescription} style={{ marginBottom: 0 }}>
              {t('dashboard.settings.billingHistoryDesc')}
            </p>
          </div>
          <a
            href="https://billing.stripe.com/p/login/eVqaEXaqXdwD55Q0pf8IU00"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.manageButton}
            id="manage-subscription-btn"
          >
            <ExternalLink size={14} />
            {t('dashboard.settings.billingManage')}
          </a>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ExternalLink size={12} style={{ flexShrink: 0 }} />
          {t('dashboard.settings.billingStripeNote')}{' '}
          <a
            href="https://billing.stripe.com/p/login/eVqaEXaqXdwD55Q0pf8IU00"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
          >
            Stripe
          </a>
          .
        </p>

        {invoices.length > 0 ? (
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th>{t('dashboard.settings.invoiceDate')}</th>
                <th>{t('dashboard.settings.invoiceDesc')}</th>
                <th>{t('dashboard.settings.invoiceAmount')}</th>
                <th>{t('dashboard.settings.invoiceStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{formatDate(inv.createdAt)}</td>
                  <td>{inv.description ?? t('dashboard.settings.invoiceDefaultDesc')}</td>
                  <td className={styles.invoiceAmount}>{formatAmount(inv.amount, inv.currency)}</td>
                  <td>
                    <span className={invoiceStatusClass[inv.status] ?? styles.invoicePending}>
                      {invoiceStatusLabel[inv.status] ?? inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyInvoices}>
            <div className={styles.emptyIcon}>
              <Receipt size={32} />
            </div>
            {t('dashboard.settings.billingEmpty')}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Settings Component ──────────────────────────────────

const initialState: ProfileFormState = {
  success: false,
  message: '',
}

export default function SettingsPage({ billing, view = 'profile' }: SettingsPageProps) {
  const { t } = useTranslation('common')
  const [state, formAction] = useActionState(updateProfile, initialState)

  // ── Profil form state ────────────────────────────────────────
  const [formValues, setFormValues] = useState<ProfileFormValues>(EMPTY_FORM)
  const [isLoading,  setIsLoading]  = useState<boolean>(true)
  const [apiError,   setApiError]   = useState<{ error: string; status?: number } | null>(null)

  // ── Form field güncelleme yardımcısı ────────────────────────
  const handleChange = (field: keyof ProfileFormValues, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }))
  }

  // ── API'den profil çekme ─────────────────────────────────────
  const loadProfile = async () => {
    setIsLoading(true)
    setApiError(null)

    try {
      const result = await fetchMyProfile()

      if (!result.success) {
        setApiError({ error: result.error, status: result.status })
        return
      }

      const d = result.data
      setFormValues({
        userId:      d.userId     || '',
        email:       d.email      || '',
        firstName:   d.firstName  || '',
        lastName:    d.lastName   || '',
        phone:       d.phone      || '',
        address:     d.address    || '',
        postalCode:  d.postalCode || '',
        city:        d.city       || '',
        country:     d.country    || '',
        gender:      d.gender     || '',
        companyName: d.companyName || '',
        twitter:     d.twitter     || '',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sayfa açılışında ve hard-refresh'te profil yükle
  useEffect(() => {
    if (view === 'profile') {
      loadProfile()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])

  // Profil başarıyla kaydedildiğinde backend'den güncel verileri tekrar çek
  useEffect(() => {
    if (state.success) {
      loadProfile()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success])

  return (
    <div className={styles.container}>
      {view === 'profile' ? (
        <>
          {isLoading && <ProfileSkeleton />}

          {!isLoading && apiError && (
            <ApiErrorPanel
              error={apiError.error}
              status={apiError.status}
              onRetry={loadProfile}
            />
          )}

          {!isLoading && !apiError && (
            <ProfileTab
              formValues={formValues}
              onChange={handleChange}
              state={state}
              formAction={formAction}
            />
          )}
        </>
      ) : (
        <BillingTab billing={billing} />
      )}
    </div>
  )
}
