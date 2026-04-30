"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./forex.module.css";

export default function ForexPage() {
  const { t } = useTranslation("common");

  const bentoItems = [
    {
      icon: <Globe size={24} />,
      title: t("forexPage.features.security.title"),
      desc: t("forexPage.features.security.desc"),
    },
    {
      icon: <Zap size={24} />,
      title: t("forexPage.features.cost.title"),
      desc: t("forexPage.features.cost.desc"),
    },
    {
      icon: <ShieldCheck size={24} />,
      title: t("forexPage.features.flexibility.title"),
      desc: t("forexPage.features.flexibility.desc"),
    },
  ];

  return (
    <div className={styles.forexPage}>
      {/* ── High-End Animated Background ── */}
      <div className={styles.bgContainer}>
        <div className={styles.meshGradient} />
        <div className={styles.gridOverlay} />
        <div className={styles.particlesContainer}>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Background Glow ── */}
      <div className={styles.heroGlow} aria-hidden="true" />

      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.heroTag}
        >
          {t("forexPage.heroTag")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={styles.heroTitle}
        >
          {t("forexPage.heroTitle")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.heroSubtitle}
        >
          {t("forexPage.heroSubtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="https://t.co/kUUMsLhRJZ?amp=1"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            {t("forexPage.ctaButton")}
          </a>
        </motion.div>
      </section>

      {/* ── Features Section (Bento Grid) ── */}
      <section className={styles.featuresSection}>
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

      {/* ── Decorative Background Glow ── */}
      <div className={styles.bottomGlow} aria-hidden="true" />
    </div>
  );
}
