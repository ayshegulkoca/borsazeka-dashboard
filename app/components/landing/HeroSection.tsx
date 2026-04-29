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
      {/* ── Minimalist Background Detail ── */}
      <div className={styles.heroBackground} aria-hidden="true">
        <div className={styles.heroMockupGlow} style={{ opacity: 0.4 }} />
      </div>

      {/* ── Content ── */}
      <div className={styles.heroCenteredInner}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.heroBadge}
        >
          {t("hero.badge")}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className={`${styles.heroCenteredTitle} tracking-tighter font-thin`}
        >
          {t("hero.mainSlogan")}
          <br />
          <span className={styles.heroCenteredAccent}> {t("hero.titleAccent")}</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className={styles.heroCenteredSubtitle}
        >
          {t("hero.subSlogan")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <Link href="/urun-sec" className={styles.heroCenteredCTA}>
            {t("hero.ctaButton")}
            <ArrowRight size={20} strokeWidth={2} />
          </Link>
          
          <Link href="/surec" className={styles.heroCenteredGhost}>
            {t("navbar.howItWorks")}
          </Link>
        </motion.div>

        {/* Visual Cue: Downward line for flow */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
          className={styles.heroFlowCue} 
          style={{ marginTop: '8rem' }}
          aria-hidden="true"
        >
          <div className={styles.heroFlowLine} />
        </motion.div>
      </div>
    </section>
  );
}
