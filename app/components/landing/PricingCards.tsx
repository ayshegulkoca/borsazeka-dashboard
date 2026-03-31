"use client";

import { Check } from "lucide-react";
import { signIn } from "next-auth/react";
import styles from "./landing.module.css";

const plans = [
  {
    id: "DARKROOM_PREMIUM",
    name: "DarkRoom Premium",
    price: "299",
    robotCount: "DarkRoom Robotu",
    featured: false,
    features: [
      "DarkRoom Self-Service robot erişimi",
      "Düşük volatilite momentum stratejisi",
      "Günlük performans raporları",
      "E-posta bildirimleri",
      "Topluluk desteği",
    ],
  },
  {
    id: "HIGHWAY_PREMIUM",
    name: "Highway Premium",
    price: "399",
    robotCount: "Highway Robotu",
    featured: false,
    features: [
      "Highway Self-Service robot erişimi",
      "Yüksek hacim trend stratejisi",
      "Gerçek zamanlı sinyal akışı",
      "SMS + E-posta bildirimleri",
      "Öncelikli destek",
    ],
  },
  {
    id: "TRADEMATE_PREMIUM",
    name: "TradeMate Premium",
    price: "499",
    robotCount: "TradeMate Robotu",
    featured: true,
    features: [
      "TradeMate Self-Service robot erişimi",
      "Kişiselleştirilebilir strateji motoru",
      "Gelişmiş analitik & raporlar",
      "SMS + E-posta + Push bildirimleri",
      "Risk yönetimi katmanı",
      "7/24 öncelikli destek",
    ],
  },
  {
    id: "FABRIKA_PREMIUM",
    name: "Fabrika Premium",
    price: "899",
    robotCount: "Tüm Robotlar",
    featured: false,
    features: [
      "DarkRoom + Highway + TradeMate erişimi",
      "Çoklu robot eş zamanlı çalıştırma",
      "Portföy otomasyonu & risk yönetimi",
      "Tüm bildirim kanalları",
      "Öncelikli teknik destek",
    ],
  },
  {
    id: "BORSAZEKA_CLASSIC",
    name: "BorsaZeka Classic",
    price: "1.499",
    robotCount: "Sınırsız Erişim",
    featured: false,
    features: [
      "Tüm robotlara sınırsız erişim",
      "Özel API entegrasyonu",
      "Beyaz etiket seçeneği",
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

        {/* 5 kart: ilk satır 3, ikinci satır 2 ortada */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Üst sıra: 3 kart */}
          <div className={styles.pricingGrid}>
            {plans.slice(0, 3).map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          {/* Alt sıra: 2 kart ortada */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
            maxWidth: "calc(66.666% + 1rem)",
            margin: "0 auto",
            width: "100%",
          }}>
            {plans.slice(3).map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: typeof plans[0] }) {
  return (
    <div
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
      <div className={styles.pricingPeriod}>/ ay · {plan.robotCount}</div>

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
        Planı Seç
      </button>
    </div>
  );
}
