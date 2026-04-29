"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./landing.module.css";

export default function HeroSection() {
  const { t } = useTranslation("common");

  return (
    <section className={styles.heroCentered}>
      {/* ── Background Detail ── */}
      <div className={styles.heroBackground} aria-hidden="true">
        <div className={styles.heroMockupGlow} />
      </div>

      {/* ── Content ── */}
      <div className={styles.heroCenteredInner}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.heroBadge}
        >
          {t("hero.badge")}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className={`${styles.heroCenteredTitle} tracking-tighter`}
        >
          {t("hero.mainSlogan")}
          <span className={styles.heroCenteredAccent}> {t("hero.titleAccent")}</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className={styles.heroCenteredSubtitle}
        >
          {t("hero.subSlogan")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Link href="/urun-sec" className={styles.heroCenteredCTA}>
            {t("hero.ctaButton")}
            <ArrowRight size={20} strokeWidth={2.5} />
          </Link>
        </motion.div>

        {/* ── Low-key Lighting Mockup ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "circOut" }}
          className={styles.heroMockupWrapper}
        >
          <img 
            src="/images/hero-mockup.png" 
            alt="BorsaZeka Premium Dashboard" 
            className={styles.heroMockupImage}
          />
          {/* Bottom highlight flow */}
          <div className={styles.heroFlowCue} aria-hidden="true">
            <div className={styles.heroFlowLine} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
