"use client";

import { Check } from "lucide-react";
import { signIn } from "next-auth/react";
import styles from "./landing.module.css";

const plans = [
  {
    id: "STARTER",
    name: "Başlangıç",
    price: "199",
    period: "/ ay",
    robotCount: "2 Robot",
    featured: false,
    features: [
      "2 aktif trading robotu",
      "Günlük 100 işlem limiti",
      "Temel performans raporları",
      "E-posta bildirimleri",
      "Topluluk desteği",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    price: "499",
    period: "/ ay",
    robotCount: "10 Robot",
    featured: true,
    features: [
      "10 aktif trading robotu",
      "Sınırsız işlem",
      "Gelişmiş analitik & raporlar",
      "SMS + E-posta + Push bildirimleri",
      "Risk yönetimi katmanı",
      "7/24 öncelikli destek",
    ],
  },
  {
    id: "ENTERPRISE",
    name: "Kurumsal",
    price: "1.499",
    period: "/ ay",
    robotCount: "Sınırsız Robot",
    featured: false,
    features: [
      "Sınırsız trading robotu",
      "Özel API erişimi",
      "Beyaz etiket seçeneği",
      "Özel risk profili konfigürasyonu",
      "Dedicated account manager",
      "SLA garantisi (%99,9)",
    ],
  },
];

export default function PricingCards() {
  return (
    <section id="pricing" className={`${styles.section} ${styles.pricingSection}`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Fiyatlandırma</span>
          <h2 className={styles.sectionTitle}>İhtiyacınıza Uygun Paket</h2>
          <p className={styles.sectionSubtitle}>
            Her pakette 14 günlük ücretsiz deneme dahildir. Kredi kartı gerekmez.
          </p>
        </div>

        <div className={styles.pricingGrid}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ""}`}
            >
              {plan.featured && (
                <span className={styles.pricingPopularBadge}>🏆 En Çok Tercih Edilen</span>
              )}

              <div className={styles.pricingPlanName}>{plan.name}</div>

              <div className={styles.pricingPrice}>
                ₺{plan.price}
                <span> TRY</span>
              </div>
              <div className={styles.pricingPeriod}>{plan.period} · {plan.robotCount}</div>

              <div className={styles.pricingDivider} />

              <ul className={styles.pricingFeatures}>
                {plan.features.map((feat) => (
                  <li key={feat}>
                    <Check size={15} color="var(--accent-primary)" />
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className={plan.featured ? styles.btnPricingPrimary : styles.btnPricingOutline}
                onClick={() =>
                  signIn("google", {
                    callbackUrl: `/checkout?plan=${plan.id}`,
                  })
                }
              >
                {plan.id === "ENTERPRISE" ? "Bize Ulaşın" : "Planı Seç"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
