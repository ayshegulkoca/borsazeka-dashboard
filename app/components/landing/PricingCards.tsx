"use client";

import { Check } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";

export default function PricingCards() {
  const { t } = useTranslation("common");

  const plans = [
    {
      id: "DARKROOM_PREMIUM",
      nameKey: "pricing.darkroomName",
      price: "299",
      robotLabelKey: "pricing.darkroomRobotLabel",
      featured: false,
      featureKeys: [
        "pricing.darkroomFeature1",
        "pricing.darkroomFeature2",
        "pricing.darkroomFeature3",
        "pricing.darkroomFeature4",
        "pricing.darkroomFeature5",
      ],
    },
    {
      id: "HIGHWAY_PREMIUM",
      nameKey: "pricing.highwayName",
      price: "399",
      robotLabelKey: "pricing.highwayRobotLabel",
      featured: false,
      featureKeys: [
        "pricing.highwayFeature1",
        "pricing.highwayFeature2",
        "pricing.highwayFeature3",
        "pricing.highwayFeature4",
        "pricing.highwayFeature5",
      ],
    },
    {
      id: "TRADEMATE_PREMIUM",
      nameKey: "pricing.trademateName",
      price: "499",
      robotLabelKey: "pricing.trademateRobotLabel",
      featured: true,
      featureKeys: [
        "pricing.trademateFeature1",
        "pricing.trademateFeature2",
        "pricing.trademateFeature3",
        "pricing.trademateFeature4",
        "pricing.trademateFeature5",
        "pricing.trademateFeature6",
      ],
    },
    {
      id: "FABRIKA_PREMIUM",
      nameKey: "pricing.fabrikaName",
      price: "899",
      robotLabelKey: "pricing.fabrikaRobotLabel",
      featured: false,
      featureKeys: [
        "pricing.fabrikaFeature1",
        "pricing.fabrikaFeature2",
        "pricing.fabrikaFeature3",
        "pricing.fabrikaFeature4",
        "pricing.fabrikaFeature5",
      ],
    },
    {
      id: "BORSAZEKA_CLASSIC",
      nameKey: "pricing.classicName",
      price: "1.499",
      robotLabelKey: "pricing.classicRobotLabel",
      featured: false,
      featureKeys: [
        "pricing.classicFeature1",
        "pricing.classicFeature2",
        "pricing.classicFeature3",
        "pricing.classicFeature4",
        "pricing.classicFeature5",
      ],
    },
  ];

  return (
    <section id="pricing" className={`${styles.section} ${styles.pricingSection}`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{t("pricing.sectionTag")}</span>
          <h2 className={styles.sectionTitle}>{t("pricing.sectionTitle")}</h2>
          <p className={styles.sectionSubtitle}>{t("pricing.sectionSubtitle")}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Top row: 3 cards */}
          <div className={styles.pricingGrid}>
            {plans.slice(0, 3).map((plan) => (
              <PlanCard key={plan.id} plan={plan} t={t} />
            ))}
          </div>
          {/* Bottom row: 2 cards centered */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
            maxWidth: "calc(66.666% + 1rem)",
            margin: "0 auto",
            width: "100%",
          }}>
            {plans.slice(3).map((plan) => (
              <PlanCard key={plan.id} plan={plan} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Plan = {
  id: string;
  nameKey: string;
  price: string;
  robotLabelKey: string;
  featured: boolean;
  featureKeys: string[];
};

function PlanCard({ plan, t }: { plan: Plan; t: (key: string) => string }) {
  return (
    <div className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ""}`}>
      {plan.featured && (
        <span className={styles.pricingPopularBadge}>{t("pricing.mostPopular")}</span>
      )}

      <div className={styles.pricingPlanName}>{t(plan.nameKey)}</div>

      <div className={styles.pricingPrice}>
        ₺{plan.price}
        <span> TRY</span>
      </div>
      <div className={styles.pricingPeriod}>{t("pricing.perMonth")} · {t(plan.robotLabelKey)}</div>

      <div className={styles.pricingDivider} />

      <ul className={styles.pricingFeatures}>
        {plan.featureKeys.map((key) => (
          <li key={key}>
            <Check size={15} color="var(--accent-primary)" />
            {t(key)}
          </li>
        ))}
      </ul>

      <button
        className={plan.featured ? styles.btnPricingPrimary : styles.btnPricingOutline}
        onClick={() => signIn("google", { callbackUrl: `/checkout?plan=${plan.id}` })}
      >
        {t("pricing.selectPlan")}
      </button>
    </div>
  );
}
