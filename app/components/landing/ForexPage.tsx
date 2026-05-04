"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe, Star, TrendingUp, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./forex.module.css";

export default function ForexPage() {
  const { t } = useTranslation("common");

  const bentoItems = [
    {
      icon: <Globe size={22} />,
      title: t("forexPage.features.security.title"),
      desc: t("forexPage.features.security.desc"),
    },
    {
      icon: <Zap size={22} />,
      title: t("forexPage.features.cost.title"),
      desc: t("forexPage.features.cost.desc"),
    },
    {
      icon: <ShieldCheck size={22} />,
      title: t("forexPage.features.flexibility.title"),
      desc: t("forexPage.features.flexibility.desc"),
    },
  ];

  const stats = [
    { value: "600+", label: t("forexPage.stats.instruments"), suffix: "" },
    { value: "0.0", label: t("forexPage.stats.spread"), suffix: "pip" },
    { value: "15+", label: t("forexPage.stats.years"), suffix: "" },
    { value: "FCA", label: t("forexPage.stats.regulated"), suffix: "" },
  ];

  return (
    <div className={styles.forexPage}>
      {/* ── Risk Uyarı Bandı ── */}
      <div className={styles.riskWarning}>
        {t("forexPage.riskWarning")}
      </div>

      {/* ── Animated Background ── */}
      <div className={styles.bgContainer}>
        <div className={styles.meshGradient} />
        <div className={styles.gridOverlay} />
        <div className={styles.particlesContainer}>
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${(i * 5.6) % 100}%`,
                top: `${(i * 7.3) % 100}%`,
                animationDelay: `${(i * 1.3) % 10}s`,
                animationDuration: `${12 + (i % 5) * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Background Glow ── */}
      <div className={styles.heroGlow} aria-hidden="true" />

      {/* ── Hero Section ── */}
      <section className={styles.hero}>

        {/* Partner badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.brandBadge}
        >
          <span className={styles.brandDot} />
          {t("forexPage.partnerBadge")}
        </motion.div>

        {/* Yıldız rating satırı */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={styles.ratingRow}
          style={{ marginTop: "1.5rem" }}
        >
          <div className={styles.stars}>
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={18} fill="#00ff88" strokeWidth={0} />
            ))}
            <Star size={18} fill="none" stroke="#00ff88" strokeWidth={1.5} />
          </div>
          <span className={styles.ratingLabel}>4.5 / 5 · TradingView</span>
          <div className={styles.bestBadge}>
            BEST<br />2025
          </div>
        </motion.div>

        {/* Ana başlık */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.heroTitle}
        >
          {t("forexPage.heroTitleLine1")}{" "}
          <span className={styles.heroTitleAccent}>
            {t("forexPage.heroTitleAccent")}
          </span>
          <br />
          {t("forexPage.heroTitleLine2")}
        </motion.h1>

        {/* Alt yazı */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={styles.heroSubtitle}
        >
          {t("forexPage.heroSubtitle")}
        </motion.p>

        {/* CTA Butonları */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.ctaGroup}
        >
          <a
            href="https://t.co/kUUMsLhRJZ?amp=1"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
            id="forex-open-account-cta"
          >
            {t("forexPage.ctaButton")}
            <ArrowRight size={18} />
          </a>
          <a
            href="https://t.co/kUUMsLhRJZ?amp=1"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaSecondary}
          >
            {t("forexPage.ctaDemo")}
          </a>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className={styles.statsRow}
        >
          {stats.map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.statValue}>
                {stat.value}
                {stat.suffix && <span>{stat.suffix}</span>}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section className={styles.featuresSection}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={styles.sectionLabel}
        >
          {t("forexPage.featuresLabel")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={styles.sectionTitle}
        >
          {t("forexPage.featuresTitle")}
        </motion.h2>

        <div className={styles.bentoGrid}>
          {bentoItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * idx }}
              className={styles.featureCard}
            >
              <div className={styles.iconWrapper}>{item.icon}</div>
              <h3 className={styles.featureTitle}>{item.title}</h3>
              <p className={styles.featureDesc}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom Glow ── */}
      <div className={styles.bottomGlow} aria-hidden="true" />
    </div>
  );
}
