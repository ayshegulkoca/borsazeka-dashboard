"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";

export default function WizardCTA() {
  const { t } = useTranslation("common");

  return (
    <section className={styles.wizardCtaSection}>
      <div className={styles.container}>
        <div className={styles.wizardCtaInner}>
          {/* Left side */}
          <div className={styles.wizardCtaLeft}>
            <span className={styles.wizardCtaTag}>
              <Sparkles size={14} />
              {t("wizardCta.tag")}
            </span>
            <h2 className={styles.wizardCtaTitle}>{t("wizardCta.title")}</h2>
            <p className={styles.wizardCtaSubtitle}>{t("wizardCta.subtitle")}</p>

            <div className={styles.wizardCtaSteps}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className={styles.wizardCtaStep}>
                  <span className={styles.wizardCtaStepNum}>{n}</span>
                </div>
              ))}
              <span className={styles.wizardCtaStepArrow}>→</span>
              <span className={styles.wizardCtaStepResult}>€</span>
            </div>
          </div>

          {/* Right side: CTA */}
          <div className={styles.wizardCtaRight}>
            <Link href="/urun-sec" className={styles.wizardCtaBtn} id="wizard-cta-btn">
              {t("wizardCta.button")}
              <ArrowRight size={20} />
            </Link>
            <p className={styles.wizardCtaNote}>{t("wizardCta.note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
