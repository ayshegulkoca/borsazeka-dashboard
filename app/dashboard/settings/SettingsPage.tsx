'use client'

import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslation } from 'react-i18next'
import {
  User,
  CreditCard,
  Save,
  CheckCircle,
  AlertCircle,
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
} from 'lucide-react'

// X (Twitter) logo helper
function XIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4l11.733 16H20L8.267 4z"/><path d="M4 20l6.768-6.768m2.46-2.46L20 4"/>
    </svg>
  );
}
import { updateProfile } from '@/lib/actions/settings'
import type { ProfileFormState } from '@/lib/validations/settings'
import type { BillingData } from '@/lib/actions/settings'
import styles from './settings.module.css'

// ─── Types ───────────────────────────────────────────────────

type ProfileData = {
  firstName:   string | null
  lastName:    string | null
  email:       string | null
  gender:      string | null
  phone:       string | null
  address:     string | null
  postalCode:  string | null
  city:        string | null
  country:     string | null
  companyName: string | null
  twitter:     string | null
  name:        string | null
  image:       string | null
  updatedAt?:  Date | string | null
} | null

type SettingsPageProps = {
  profile: ProfileData
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

// ─── Profile Tab Content ─────────────────────────────────────

function ProfileTab({
  profile,
  state,
  formAction,
}: {
  profile: ProfileData
  state: ProfileFormState
  formAction: (payload: FormData) => void
}) {
  const { t } = useTranslation('common')
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({})
  const [validationMsg, setValidationMsg] = useState<{id: string, msg: string} | null>(null)

  const triggerInvalid = (id: string, msg: string = 'Sadece rakam giriniz') => {
    setInvalidFields(prev => ({ ...prev, [id]: true }))
    setValidationMsg({ id, msg })
    setTimeout(() => {
      setInvalidFields(prev => ({ ...prev, [id]: false }))
    }, 400)
    setTimeout(() => {
      setValidationMsg(null)
    }, 2500)
  }

  const handleNumericInput = (e: React.FormEvent<HTMLInputElement>, limit?: number) => {
    const input = e.currentTarget
    const id = input.id
    const value = input.value
    const cleanValue = value.replace(/[^0-9]/g, '')
    
    if (value !== cleanValue) {
      input.value = cleanValue
      triggerInvalid(id)
    }

    if (limit && cleanValue.length > limit) {
      input.value = cleanValue.slice(0, limit)
      triggerInvalid(id, `Maksimum ${limit} karakter girebilirsiniz`)
    }
  }

  const handlePhoneInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const id = input.id
    const value = input.value
    const cleanValue = value.replace(/[^0-9+]/g, '')
    
    if (value !== cleanValue) {
      input.value = cleanValue
      triggerInvalid(id, 'Sadece rakam ve + işareti girebilirsiniz')
    }
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>{t('dashboard.settings.profileTitle')}</h3>
        <p className={styles.cardDescription}>
          {t('dashboard.settings.profileDesc')}
        </p>

        <form action={formAction} key={profile?.updatedAt?.toString() ?? 'initial'}>
          <div className={styles.formGrid}>
            
            {/* Customer ID (Editable) */}
            <div className={styles.formGroup}>
              <label htmlFor="customerId" className={styles.label} style={{ fontWeight: 200 }}>
                <Hash size={14} />
                {t('dashboard.settings.customerId')}
              </label>
              <input
                id="customerId"
                name="customerId"
                type="text"
                className={`${styles.input} ${invalidFields.customerId ? styles.inputInvalid : ''}`}
                defaultValue={profile?.bio ?? ''} 
                placeholder={t('dashboard.settings.customerIdPlaceholder')}
                onInput={(e) => handleNumericInput(e)}
              />
              {validationMsg?.id === 'customerId' && (
                <span className={styles.fieldError} style={{ marginTop: '2px', fontSize: '0.7rem' }}>
                  {validationMsg.msg}
                </span>
              )}
            </div>

            {/* Email (Read-only) — session'dan gelir, kilitıdır */}
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
                  defaultValue={profile?.email ?? ''}
                  readOnly
                  aria-readonly="true"
                />
              </div>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                {t('dashboard.settings.emailNote')}
              </span>
            </div>

            {/* First Name */}
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
                defaultValue={profile?.firstName ?? ''}
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

            {/* Last Name */}
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
                defaultValue={profile?.lastName ?? ''}
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

            {/* Gender */}
            <div className={styles.formGroup}>
              <label htmlFor="gender" className={styles.label}>
                <User size={14} />
                {t('dashboard.settings.gender')}
              </label>
              <select
                id="gender"
                name="gender"
                className={styles.input}
                defaultValue={profile?.gender ?? ''}
              >
                <option value="">{t('dashboard.settings.genderSelect')}</option>
                <option value="Erkek">{t('dashboard.settings.genderMale')}</option>
                <option value="Kadın">{t('dashboard.settings.genderFemale')}</option>
                <option value="Diğer">{t('dashboard.settings.genderOther')}</option>
                <option value="Belirtmek istemiyorum">{t('dashboard.settings.genderPreferNot')}</option>
              </select>
              {state.errors?.gender && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.gender[0]}
                </span>
              )}
            </div>

            {/* Phone */}
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
                defaultValue={profile?.phone ?? ''}
                placeholder={t('dashboard.settings.phonePlaceholder')}
                onInput={handlePhoneInput}
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

            {/* Address */}
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
                defaultValue={profile?.address ?? ''}
                placeholder={t('dashboard.settings.addressPlaceholder')}
              />
              {state.errors?.address && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.address[0]}
                </span>
              )}
            </div>

            {/* Postal Code */}
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
                defaultValue={profile?.postalCode ?? ''}
                placeholder="34000"
                onInput={(e) => handleNumericInput(e, 10)}
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

            {/* City */}
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
                defaultValue={profile?.city ?? ''}
                placeholder={t('dashboard.settings.cityPlaceholder')}
              />
              {state.errors?.city && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.city[0]}
                </span>
              )}
            </div>

            {/* Country */}
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
                defaultValue={profile?.country ?? ''}
                placeholder={t('dashboard.settings.countryPlaceholder')}
              />
              {state.errors?.country && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.country[0]}
                </span>
              )}
            </div>

            {/* Company Name — full width */}
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
                defaultValue={profile?.companyName ?? ''}
                placeholder={t('dashboard.settings.companyNamePlaceholder')}
              />
              {state.errors?.companyName && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.companyName[0]}
                </span>
              )}
            </div>

            {/* Twitter — full width */}
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
                defaultValue={profile?.twitter ?? ''}
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

          {/* Form Actions */}
          <div className={styles.formActions}>
            <div>
              {state.message && (
                <div
                  className={
                    state.success ? styles.statusSuccess : styles.statusError
                  }
                >
                  {state.success ? (
                    <CheckCircle size={14} />
                  ) : (
                    <AlertCircle size={14} />
                  )}
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

// ─── Billing Tab Content ─────────────────────────────────────

function BillingTab({ billing }: { billing: BillingData | null }) {
  const { t, i18n } = useTranslation('common')
  const locale = i18n.language?.startsWith('en') ? 'en-US' : 'tr-TR'

  const plan = billing?.subscription.planType ?? 'FREE'
  const status = billing?.subscription.status ?? 'ACTIVE'
  const periodEnd = billing?.subscription.nextBillingDate ?? null
  const invoices = billing?.invoices ?? []

  const planLabels: Record<string, string> = {
    FREE: t('dashboard.settings.planFree'),
    PRO: t('dashboard.settings.planPro'),
    PREMIUM: t('dashboard.settings.planPremium'),
  }

  const planBadgeClass: Record<string, string> = {
    FREE: styles.badgeFree,
    PRO: styles.badgePro,
    PREMIUM: styles.badgePremium,
  }

  const statusLabels: Record<string, string> = {
    ACTIVE: t('dashboard.settings.statusActive'),
    CANCELLED: t('dashboard.settings.statusCancelled'),
    PAST_DUE: t('dashboard.settings.statusPastDue'),
    TRIALING: t('dashboard.settings.statusTrialing'),
  }

  const statusClass: Record<string, string> = {
    ACTIVE: styles.statusActive,
    CANCELLED: styles.statusCancelled,
    PAST_DUE: styles.statusPastDue,
    TRIALING: styles.statusTrialing,
  }

  function formatRenewalDate(isoDate: string | null): string {
    if (!isoDate) return t('dashboard.settings.renewalNoDate')
    const date = new Date(isoDate)
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  function getDaysUntilRenewal(isoDate: string | null): string {
    if (!isoDate) return ''
    const now = new Date()
    const end = new Date(isoDate)
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return t('dashboard.settings.renewalExpired')
    if (diff === 0) return t('dashboard.settings.renewalToday')
    if (diff === 1) return t('dashboard.settings.renewalDay')
    return t('dashboard.settings.renewalDays', { days: diff })
  }

  function formatAmount(amount: number, currency: string): string {
    const value = amount / 100
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value)
  }

  function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const invoiceStatusClass: Record<string, string> = {
    PAID: styles.invoicePaid,
    PENDING: styles.invoicePending,
    FAILED: styles.invoiceFailed,
  }

  const invoiceStatusLabel: Record<string, string> = {
    PAID: t('dashboard.settings.invoicePaid'),
    PENDING: t('dashboard.settings.invoicePending'),
    FAILED: t('dashboard.settings.invoiceFailed'),
  }

  return (
    <div className={styles.tabContent}>
      {/* Payment History */}
      <div className={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 className={styles.cardTitle}>
              <Receipt
                size={18}
                style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}
              />
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
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
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
                  <td className={styles.invoiceAmount}>
                    {formatAmount(inv.amount, inv.currency)}
                  </td>
                  <td>
                    <span
                      className={
                        invoiceStatusClass[inv.status] ?? styles.invoicePending
                      }
                    >
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

// ─── Main Settings Component ─────────────────────────────────

const initialState: ProfileFormState = {
  success: false,
  message: '',
}

export default function SettingsPage({ profile, billing, view = 'profile' }: SettingsPageProps) {
  const { t } = useTranslation('common')
  const [state, formAction] = useActionState(updateProfile, initialState)

  return (
    <div className={styles.container}>

      {/* Content Rendering based on view prop */}
      {view === 'profile' ? (
        <ProfileTab
          profile={profile}
          state={state}
          formAction={formAction}
        />
      ) : (
        <BillingTab billing={billing} />
      )}
    </div>
  )
}
