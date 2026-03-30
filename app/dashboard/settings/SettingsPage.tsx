'use client'

import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
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
} from 'lucide-react'
import { updateProfile } from '@/lib/actions/settings'
import type { ProfileFormState } from '@/lib/validations/settings'
import type { BillingData } from '@/lib/actions/settings'
import styles from './settings.module.css'

// ─── Types ───────────────────────────────────────────────────

type ProfileData = {
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  address: string | null
  name: string | null
  image: string | null
} | null

type SettingsPageProps = {
  profile: ProfileData
  billing: BillingData | null
}

// ─── Submit Button (uses useFormStatus) ──────────────────────

function SubmitButton() {
  const { pending } = useFormStatus()

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
          Kaydediliyor...
        </>
      ) : (
        <>
          <Save size={16} />
          Değişiklikleri Kaydet
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
  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Kişisel Bilgiler</h3>
        <p className={styles.cardDescription}>
          Hesap bilgilerinizi buradan güncelleyebilirsiniz.
        </p>

        <form action={formAction}>
          <div className={styles.formGrid}>
            {/* First Name */}
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                <User size={14} />
                Ad
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={styles.input}
                defaultValue={profile?.firstName ?? ''}
                placeholder="Adınızı girin"
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
                Soyad
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className={styles.input}
                defaultValue={profile?.lastName ?? ''}
                placeholder="Soyadınızı girin"
                required
              />
              {state.errors?.lastName && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.lastName[0]}
                </span>
              )}
            </div>

            {/* Email (Read-only) */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <Mail size={14} />
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`${styles.input} ${styles.inputDisabled}`}
                defaultValue={profile?.email ?? ''}
                readOnly
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                E-posta adresi Google hesabınızdan alınır.
              </span>
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                <Phone size={14} />
                Telefon
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={styles.input}
                defaultValue={profile?.phone ?? ''}
                placeholder="+90 5XX XXX XX XX"
              />
              {state.errors?.phone && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.phone[0]}
                </span>
              )}
            </div>

            {/* Address */}
            <div className={`${styles.formGroup} ${styles.fieldFullWidth}`}>
              <label htmlFor="address" className={styles.label}>
                <MapPin size={14} />
                Adres
              </label>
              <textarea
                id="address"
                name="address"
                className={styles.textarea}
                defaultValue={profile?.address ?? ''}
                placeholder="Adresinizi girin"
                rows={3}
              />
              {state.errors?.address && (
                <span className={styles.fieldError}>
                  <AlertCircle size={12} />
                  {state.errors.address[0]}
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
  const plan = billing?.subscription.planType ?? 'FREE'
  const status = billing?.subscription.status ?? 'ACTIVE'
  const periodEnd = billing?.subscription.nextBillingDate ?? null
  const invoices = billing?.invoices ?? []

  const planLabels: Record<string, string> = {
    FREE: 'Ücretsiz',
    PRO: 'Pro',
    PREMIUM: 'Premium Plus',
  }

  const planBadgeClass: Record<string, string> = {
    FREE: styles.badgeFree,
    PRO: styles.badgePro,
    PREMIUM: styles.badgePremium,
  }

  const statusLabels: Record<string, string> = {
    ACTIVE: 'Aktif',
    CANCELLED: 'İptal',
    PAST_DUE: 'Gecikmiş',
    TRIALING: 'Deneme',
  }

  const statusClass: Record<string, string> = {
    ACTIVE: styles.statusActive,
    CANCELLED: styles.statusCancelled,
    PAST_DUE: styles.statusPastDue,
    TRIALING: styles.statusTrialing,
  }

  // Calculate next renewal date
  function formatRenewalDate(isoDate: string | null): string {
    if (!isoDate) return 'Yenileme tarihi yok'
    const date = new Date(isoDate)
    return date.toLocaleDateString('tr-TR', {
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
    if (diff < 0) return 'Süre dolmuş'
    if (diff === 0) return 'Bugün yenileniyor'
    if (diff === 1) return '1 gün kaldı'
    return `${diff} gün kaldı`
  }

  function formatAmount(amount: number, currency: string): string {
    const value = amount / 100 // kuruş to lira
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency,
    }).format(value)
  }

  function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('tr-TR', {
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
    PAID: 'Ödendi',
    PENDING: 'Bekliyor',
    FAILED: 'Başarısız',
  }

  return (
    <div className={styles.tabContent}>
      {/* Plan & Renewal Cards */}
      <div className={styles.billingGrid}>
        {/* Current Plan */}
        <div className={`${styles.billingCard} ${styles.planCard}`}>
          <div className={styles.billingCardLabel}>Mevcut Plan</div>
          <div className={styles.billingCardValue}>
            <Crown size={22} color="var(--accent-primary)" />
            {planLabels[plan] ?? plan}
            <span className={planBadgeClass[plan] ?? styles.badgeFree}>
              {plan}
            </span>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <span className={statusClass[status] ?? styles.statusActive}>
              {statusLabels[status] ?? status}
            </span>
          </div>
        </div>

        {/* Next Renewal */}
        <div className={`${styles.billingCard} ${styles.renewalCard}`}>
          <div className={styles.billingCardLabel}>Sonraki Yenileme</div>
          <div className={styles.billingCardValue}>
            <CalendarClock size={22} color="#60a5fa" />
            <div>
              <div className={styles.renewalDate}>
                {formatRenewalDate(periodEnd)}
              </div>
              {periodEnd && (
                <div className={styles.renewalSubtext}>
                  {getDaysUntilRenewal(periodEnd)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manage Subscription */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '1.5rem',
        }}
      >
        <button className={styles.manageButton} id="manage-subscription-btn">
          <ExternalLink size={14} />
          Aboneliği Yönet
        </button>
      </div>

      {/* Payment History */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>
          <Receipt
            size={18}
            style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}
          />
          Ödeme Geçmişi
        </h3>
        <p className={styles.cardDescription}>
          Son 10 ödeme işleminiz aşağıda listelenmiştir.
        </p>

        {invoices.length > 0 ? (
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Açıklama</th>
                <th>Tutar</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{formatDate(inv.createdAt)}</td>
                  <td>{inv.description ?? 'Abonelik ödemesi'}</td>
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
            Henüz bir ödeme işlemi bulunmuyor.
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

export default function SettingsPage({ profile, billing }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('profile')
  const [state, formAction] = useActionState(updateProfile, initialState)

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Ayarlar</h1>
        <p className={styles.pageSubtitle}>
          Hesap bilgilerinizi ve aboneliğinizi yönetin.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${activeTab === 'profile' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('profile')}
          id="tab-profile"
        >
          <User size={16} />
          Profil
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'billing' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('billing')}
          id="tab-billing"
        >
          <CreditCard size={16} />
          Abonelik & Fatura
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' ? (
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
