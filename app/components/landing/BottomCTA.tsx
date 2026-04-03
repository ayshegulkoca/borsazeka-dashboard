"use client";

import { signIn } from "next-auth/react";
import { Rocket, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";

export default function BottomCTA() {
  const { t } = useTranslation("common");

  return (
    <section id="cta" className={`${styles.section} ${styles.ctaSection}`}>
      <div className={styles.container}>
        <h2 className={styles.ctaTitle}>{t("cta.title")}</h2>
        <p className={styles.ctaSubtitle}>{t("cta.subtitle")}</p>
        <div className={styles.ctaButtonGroup}>
          <button
            className={styles.btnCtaPrimary}
            onClick={() => signIn("google", { callbackUrl: "/checkout" })}
          >
            <Rocket size={20} />
            {t("cta.getStarted")}
          </button>
          <button
            className={styles.btnCtaSecondary}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <LogIn size={18} />
            {t("cta.signIn")}
          </button>
        </div>
      </div>
    </section>
  );
}
