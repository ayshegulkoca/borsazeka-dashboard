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
        <div className={styles.heroMockupGlow} style={{ opacity: 0.2 }} />
      </div>

      {/* ── Content ── */}
      <div className={styles.heroCenteredInner}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={styles.heroBadge}
        >
          {t("hero.badge")}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className={styles.heroCenteredTitle}
        >
          Borsa, yapay zeka ile buluştu: <br />
          <span className={styles.heroCenteredAccent}>BorsaZeka!</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className={styles.heroCenteredSubtitle}
        >
          {t("hero.subSlogan")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/urun-sec" className={styles.heroCenteredCTA}>
              {t("hero.ctaButton")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Visual Cue: Downward line for flow */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 1 }}
          className={styles.heroFlowCue} 
          style={{ marginTop: '4rem' }}
          aria-hidden="true"
        >
          <div className={styles.heroFlowLine} />
        </motion.div>
      </div>
    </section>
  );
}
