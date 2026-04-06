"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";

export default function HeroSection() {
  const { t } = useTranslation("common");

  return (
    <section className={styles.heroCentered}>
      {/* Animated Background */}
      <div className={styles.heroBackground} aria-hidden="true">
        {/* Floating chart lines */}
        <svg className={styles.heroChartSvg} viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice">
          <polyline
            className={styles.heroChartLine1}
            points="0,400 120,360 240,380 360,300 480,320 600,260 720,280 840,220 960,240 1080,180 1200,200 1320,140 1440,160"
            fill="none" strokeWidth="2"
          />
          <polyline
            className={styles.heroChartLine2}
            points="0,460 150,440 300,450 450,400 600,420 750,370 900,390 1050,340 1200,360 1440,310"
            fill="none" strokeWidth="1.5"
          />
          <polyline
            className={styles.heroChartLine3}
            points="0,500 200,490 400,480 500,460 650,470 800,440 1000,430 1200,410 1440,400"
            fill="none" strokeWidth="1"
          />
          {/* Vertical grid lines */}
          {[180, 360, 540, 720, 900, 1080, 1260].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="600" stroke="rgba(16,185,129,0.04)" strokeWidth="1" />
          ))}
          {/* Horizontal grid lines */}
          {[150, 300, 450].map((y) => (
            <line key={y} x1="0" y1={y} x2="1440" y2={y} stroke="rgba(16,185,129,0.04)" strokeWidth="1" />
          ))}
          {/* Bullet dots on main line */}
          {[[480, 320], [720, 280], [960, 240], [1200, 200]].map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r="4" fill="rgba(16,185,129,0.5)" className={styles.heroChartDot} />
          ))}
        </svg>

        {/* Neural network nodes */}
        <div className={styles.heroNeuralNet} aria-hidden="true">
          {[
            { x: "15%", y: "25%", size: 6, delay: 0 },
            { x: "25%", y: "65%", size: 4, delay: 0.8 },
            { x: "40%", y: "30%", size: 5, delay: 1.4 },
            { x: "55%", y: "70%", size: 3, delay: 0.4 },
            { x: "70%", y: "20%", size: 6, delay: 2.1 },
            { x: "80%", y: "55%", size: 4, delay: 1.1 },
            { x: "90%", y: "35%", size: 5, delay: 0.6 },
          ].map((node, i) => (
            <div
              key={i}
              className={styles.heroNeuralNode}
              style={{
                left: node.x,
                top: node.y,
                width: node.size * 2,
                height: node.size * 2,
                animationDelay: `${node.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Radial glow */}
        <div className={styles.heroGlow1} />
        <div className={styles.heroGlow2} />
      </div>

      {/* Content */}
      <div className={styles.heroCenteredInner}>
        <div className={styles.heroBadge}>
          <span
            style={{
              width: 6, height: 6,
              background: "var(--accent-primary)",
              borderRadius: "50%",
              display: "inline-block",
            }}
          />
          {t("hero.badge")}
        </div>

        <h1 className={styles.heroCenteredTitle}>
          {t("hero.mainSlogan")}
          <span className={styles.heroCenteredAccent}> {t("hero.titleAccent")}</span>
        </h1>

        <p className={styles.heroCenteredSubtitle}>{t("hero.subSlogan")}</p>

        <Link href="/urun-sec" className={styles.heroCenteredCTA} id="hero-cta-btn">
          {t("hero.ctaButton")}
          <ArrowRight size={20} />
        </Link>

        {/* Stats */}
        <div className={styles.heroCenteredStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNumber}>{t("hero.stat1Number")}</span>
            <span className={styles.heroStatLabel}>{t("hero.stat1Label")}</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNumber}>{t("hero.stat2Number")}</span>
            <span className={styles.heroStatLabel}>{t("hero.stat2Label")}</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNumber}>{t("hero.stat3Number")}</span>
            <span className={styles.heroStatLabel}>{t("hero.stat3Label")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
