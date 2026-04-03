"use client";

import { TrendingUp, Shield, Zap, BarChart2, Clock, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";

export default function FeatureGrid() {
  const { t } = useTranslation("common");

  const features = [
    { icon: Brain,     titleKey: "features.feature1Title", descKey: "features.feature1Desc" },
    { icon: TrendingUp, titleKey: "features.feature2Title", descKey: "features.feature2Desc" },
    { icon: Shield,    titleKey: "features.feature3Title", descKey: "features.feature3Desc" },
    { icon: Zap,       titleKey: "features.feature4Title", descKey: "features.feature4Desc" },
    { icon: BarChart2, titleKey: "features.feature5Title", descKey: "features.feature5Desc" },
    { icon: Clock,     titleKey: "features.feature6Title", descKey: "features.feature6Desc" },
  ];

  return (
    <section id="features" className={`${styles.section} ${styles.featuresSection}`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{t("features.sectionTag")}</span>
          <h2 className={styles.sectionTitle}>{t("features.sectionTitle")}</h2>
          <p className={styles.sectionSubtitle}>{t("features.sectionSubtitle")}</p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.titleKey} className={styles.featureCard}>
                <div className={styles.featureIconWrap}>
                  <Icon size={22} color="var(--accent-primary)" />
                </div>
                <h3 className={styles.featureTitle}>{t(f.titleKey)}</h3>
                <p className={styles.featureDesc}>{t(f.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
