"use client";

import { useRef } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./landing.module.css";

export default function HeroSection() {
  const { t } = useTranslation("common");

  return (
    <section className={styles.heroAsymmetric}>
      {/* ── Video Background ── */}
      <div className={styles.videoBackgroundWrapper}>
        <video 
          className={styles.heroVideo}
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay Overlay */}
        <div className={styles.videoOverlay} />
      </div>

      {/* ── Content Container (Left Aligned) ── */}
      <div className={styles.heroContainer}>
        <div className={styles.heroContentLeft}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={styles.heroBadgeLeft}
          >
            {t("hero.badge")}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className={styles.heroAsymmetricTitle}
          >
            Borsa, yapay zeka ile buluştu: <br />
            <span className={styles.heroCenteredAccent}>BorsaZeka!</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={styles.heroAsymmetricSubtitle}
          >
            {t("hero.subSlogan")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex items-start justify-start"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/urun-sec" className={styles.heroAsymmetricCTA}>
                {t("hero.ctaButton")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
