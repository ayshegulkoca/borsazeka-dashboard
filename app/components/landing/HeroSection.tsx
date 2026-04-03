"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";

export default function HeroSection() {
  const { t } = useTranslation("common");

  return (
    <section className={styles.hero} style={{ padding: "10rem 2rem 8rem" }}>
      <div className={styles.heroInner}>
        {/* Left: Copy */}
        <div>
          <div className={styles.heroBadge}>
            <span
              style={{
                width: 6,
                height: 6,
                background: "var(--accent-primary)",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            {t("hero.badge")}
          </div>

          <h1 className={styles.heroTitle}>
            {t("hero.title")}{" "}
            <span className={styles.accent}>{t("hero.titleAccent")}</span>
          </h1>

          <p className={styles.heroSubtitle}>{t("hero.subtitle")}</p>

          <div className={styles.heroCTAGroup}>
            {/* Primary CTA: Ürün Sihirbazı */}
            <Link href="/urun-sec" className={styles.btnHeroPrimary}>
              {t("hero.selectProduct")}
              <ArrowRight size={18} />
            </Link>
            {/* Secondary CTA: Nasıl Çalışır */}
            <Link href="/surec" className={styles.btnHeroSecondary}>
              <ChevronRight size={16} />
              {t("hero.exploreRobots")}
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>
                {t("hero.stat1Number")}
              </span>
              <span className={styles.heroStatLabel}>{t("hero.stat1Label")}</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>
                {t("hero.stat2Number")}
              </span>
              <span className={styles.heroStatLabel}>{t("hero.stat2Label")}</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>
                {t("hero.stat3Number")}
              </span>
              <span className={styles.heroStatLabel}>{t("hero.stat3Label")}</span>
            </div>
          </div>
        </div>

        {/* Right: Mockup */}
        <div className={styles.heroImagePanel}>
          <div className={styles.heroImageWrap}>
            <Image
              src="/dashboard-mockup.png"
              alt="BorsaZeka Dashboard Preview"
              width={900}
              height={560}
              priority
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.heroImageGlow} />
        </div>
      </div>
    </section>
  );
}
