"use client";

import Link from "next/link";
import {
  Activity, Bot, BarChart2, Lock, Coins, ArrowRight, Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import styles from "./surec.module.css";

export default function SurecPage() {
  const { t } = useTranslation("common");

  const MISSION_CARDS = [
    { Icon: Bot,      titleKey: "surec.card1Title", descKey: "surec.card1Desc" },
    { Icon: BarChart2,titleKey: "surec.card2Title", descKey: "surec.card2Desc" },
    { Icon: Lock,     titleKey: "surec.card3Title", descKey: "surec.card3Desc" },
    { Icon: Coins,    titleKey: "surec.card4Title", descKey: "surec.card4Desc" },
  ];

  const MOCK_REPORT = [
    { key: 1, positive: true,  value: "+2.4%" },
    { key: 2, positive: true,  value: "+1.7%" },
    { key: 3, positive: true,  value: "+3.1%" },
    { key: 4, positive: false, value: "-0.3%" },
    { key: 5, positive: true,  value: "+2.8%" },
  ];

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ── HERO ── */}
      <section className={styles.hero} style={{ paddingTop: "8rem" }}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>
            {t("surec.heroTitle")} <span className={styles.accent}>{t("surec.heroTitleAccent")}</span>
          </h1>
          <p className={styles.heroSubtitle}>{t("surec.heroSubtitle")}</p>
        </div>
      </section>

      {/* ── MİSYON ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionText}>
              <span className={styles.sectionTag}>{t("surec.missionTag")}</span>
              <h2 className={styles.sectionTitle}>
                {t("surec.missionTitle")}<br />{t("surec.missionTitleLine2")}
              </h2>
              <p className={styles.sectionDesc}>{t("surec.missionDesc1")}</p>
              <p className={styles.sectionDesc} style={{ marginTop: "1rem" }}>
                {t("surec.missionDesc2")} <strong>09:00</strong> {t("surec.missionDesc2Mid")}{" "}
                <strong>12:00</strong> {t("surec.missionDesc2End")}
              </p>
            </div>
            <div className={styles.missionCards}>
              {MISSION_CARDS.map((c) => (
                <div key={c.titleKey} className={styles.missionCard}>
                  <div className={styles.missionCardIconWrap}>
                    <c.Icon size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <div className={styles.missionCardTitle}>{t(c.titleKey)}</div>
                    <div className={styles.missionCardDesc}>{t(c.descKey)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ŞEFFAFLIK ── */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <div className={styles.transparencyWrap}>
            <div className={styles.transparencyLeft}>
              <span className={styles.sectionTag}>{t("surec.transparencyTag")}</span>
              <h2 className={styles.sectionTitle}>{t("surec.transparencyTitle")}</h2>
              <p className={styles.sectionDesc}>
                {t("surec.transparencyDesc")} <strong className={styles.accentText}>09:00</strong>{" "}
                {t("surec.transparencyDescMid")}{" "}
                <strong className={styles.accentText}>12:00</strong>{" "}
                {t("surec.transparencyDescEnd")}
              </p>
              <div className={styles.reportingBadges}>
                <div className={styles.reportingBadge}>
                  <Clock size={18} color="#10b981" />
                  <span>{t("surec.reportBadge1")}</span>
                </div>
                <div className={styles.reportingBadge}>
                  <Clock size={18} color="#10b981" />
                  <span>{t("surec.reportBadge2")}</span>
                </div>
              </div>
            </div>
            <div className={styles.transparencyRight}>
              <div className={styles.mockReport}>
                <div className={styles.mockReportHeader}>
                  <span className={styles.mockReportTitle}>{t("surec.mockReportTitle")}</span>
                  <span className={styles.mockReportTime}>09:00</span>
                </div>
                {MOCK_REPORT.map((row) => (
                  <div key={row.key} className={styles.mockReportRow}>
                    <span className={styles.mockReportAccount}>
                      {t("surec.client")} #{row.key}
                    </span>
                    <span
                      className={styles.mockReportVal}
                      style={{ color: row.positive ? "#10b981" : "#f87171" }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
                <div className={styles.mockReportFooter}>{t("surec.mockReportFooter")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROBOTLAR CTA ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div
            style={{
              textAlign: "center",
              padding: "3.5rem 2rem",
              background: "rgba(16,185,129,0.04)",
              border: "1px solid rgba(16,185,129,0.12)",
              borderRadius: 24,
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent-primary)",
                marginBottom: "1rem",
              }}
            >
              {t("surec.robotsTag")}
            </span>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                marginBottom: "0.75rem",
              }}
            >
              {t("surec.robotsTitle")}
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "1.75rem",
                maxWidth: 520,
                margin: "0 auto 1.75rem",
                lineHeight: 1.65,
              }}
            >
              {t("surec.robotsSubtitle")}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/robotlar"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 2rem",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  background: "var(--accent-primary)",
                  color: "#022c22",
                }}
              >
                {t("robots.sectionTitle")}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/urun-sec"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 2rem",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  border: "1px solid rgba(16,185,129,0.25)",
                  color: "var(--accent-primary)",
                  background: "rgba(16,185,129,0.06)",
                }}
              >
                {t("hero.ctaButton")}
                <Activity size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
