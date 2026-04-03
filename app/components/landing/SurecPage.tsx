"use client";

import Link from "next/link";
import {
  Activity, Users, Cpu, ShieldCheck, TrendingUp, Clock,
  ChevronRight, ArrowLeft, CheckCircle2, Server, Bot,
  BarChart2, Lock, Coins,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./surec.module.css";

export default function SurecPage() {
  const { t } = useTranslation("common");

  const STEPS = [
    { icon: Users,      number: "01", titleKey: "surec.step1Title", descKey: "surec.step1Desc", color: "#10b981" },
    { icon: ShieldCheck,number: "02", titleKey: "surec.step2Title", descKey: "surec.step2Desc", color: "#34d399" },
    { icon: Cpu,        number: "03", titleKey: "surec.step3Title", descKey: "surec.step3Desc", color: "#6ee7b7" },
    { icon: Activity,   number: "04", titleKey: "surec.step4Title", descKey: "surec.step4Desc", color: "#10b981" },
    { icon: Server,     number: "05", titleKey: "surec.step5Title", descKey: "surec.step5Desc", color: "#34d399" },
    { icon: TrendingUp, number: "06", titleKey: "surec.step6Title", descKey: "surec.step6Desc", color: "#6ee7b7" },
  ];

  const ROBOTS = [
    {
      name: "DarkRoom",
      maxUsers: 40,
      budgetKey: "surec.darkroomBudget",
      profitKey: "surec.darkroomProfit",
      setupKey:  "surec.darkroomSetup",
      serverKey: "surec.darkroomServer",
      highlightKeys: [
        "surec.darkroomH1","surec.darkroomH2","surec.darkroomH3",
        "surec.darkroomH4","surec.darkroomH5","surec.darkroomH6",
      ],
      badgeKey: "surec.darkroomBadge",
      badgeColor: "#10b981",
      gradient: "linear-gradient(135deg, #0e1b15 0%, #072b1c 100%)",
      border: "rgba(16,185,129,0.35)",
    },
    {
      name: "TradeMate",
      maxUsers: 50,
      budgetKey: "surec.trademateBudget",
      profitKey: "surec.trademateProfit",
      setupKey:  "surec.trademateSetup",
      serverKey: "surec.trademateServer",
      highlightKeys: [
        "surec.trademateH1","surec.trademateH2","surec.trademateH3",
        "surec.trademateH4","surec.trademateH5","surec.trademateH6",
      ],
      badgeKey: "surec.trademateBadge",
      badgeColor: "#3b82f6",
      gradient: "linear-gradient(135deg, #0f172a 0%, #0e1b35 100%)",
      border: "rgba(59,130,246,0.3)",
    },
    {
      name: "Highway",
      maxUsers: 30,
      budgetKey: "surec.highwayBudget",
      profitKey: "surec.highwayProfit",
      setupKey:  "surec.highwaySetup",
      serverKey: "surec.highwayServer",
      highlightKeys: [
        "surec.highwayH1","surec.highwayH2","surec.highwayH3",
        "surec.highwayH4","surec.highwayH5","surec.highwayH6",
      ],
      badgeKey: "surec.highwayBadge",
      badgeColor: "#f59e0b",
      gradient: "linear-gradient(135deg, #1c130a 0%, #231a06 100%)",
      border: "rgba(245,158,11,0.3)",
    },
  ];

  const SHARED_TERMS = [
    "surec.term1","surec.term2","surec.term3","surec.term4",
    "surec.term5","surec.term6","surec.term7","surec.term8",
  ];

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
      {/* ── NAV BACK ── */}
      <nav className={styles.topNav}>
        <div className={styles.topNavInner}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            {t("surec.backLink")}
          </Link>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <Activity size={16} color="#022c22" strokeWidth={2.5} />
            </div>
            BorsaZeka
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
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

      {/* ── ROBOTLAR ── */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>{t("surec.robotsTag")}</span>
            <h2 className={styles.sectionTitle}>{t("surec.robotsTitle")}</h2>
            <p className={styles.sectionSubtitle}>{t("surec.robotsSubtitle")}</p>
          </div>
          <div className={styles.robotGrid}>
            {ROBOTS.map((r) => (
              <div
                key={r.name}
                className={styles.robotCard}
                style={{ background: r.gradient, borderColor: r.border }}
              >
                <div className={styles.robotCardTop}>
                  <span className={styles.robotName}>{r.name}</span>
                  <span
                    className={styles.robotBadge}
                    style={{
                      background: `${r.badgeColor}22`,
                      color: r.badgeColor,
                      borderColor: `${r.badgeColor}44`,
                    }}
                  >
                    {t(r.badgeKey)}
                  </span>
                </div>

                <div className={styles.robotStats}>
                  <div className={styles.robotStat}>
                    <span className={styles.robotStatLabel}>{t("surec.maxUsers")}</span>
                    <span className={styles.robotStatValue}>{r.maxUsers} {t("surec.maxUsersSuffix")}</span>
                  </div>
                  <div className={styles.robotStat}>
                    <span className={styles.robotStatLabel}>{t("surec.budgetRange")}</span>
                    <span className={styles.robotStatValue}>{t(r.budgetKey)}</span>
                  </div>
                  <div className={styles.robotStat}>
                    <span className={styles.robotStatLabel}>{t("surec.profitShare")}</span>
                    <span className={styles.robotStatValue}>{t(r.profitKey)}</span>
                  </div>
                  <div className={styles.robotStat}>
                    <span className={styles.robotStatLabel}>{t("surec.setupFee")}</span>
                    <span className={styles.robotStatValue}>{t(r.setupKey)}</span>
                  </div>
                </div>

                <div className={styles.robotDivider} />

                <ul className={styles.robotFeatureList}>
                  {r.highlightKeys.map((hKey) => (
                    <li key={hKey} className={styles.robotFeature}>
                      <CheckCircle2 size={14} color={r.badgeColor} style={{ flexShrink: 0, marginTop: 2 }} />
                      {t(hKey)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Ortak şartlar */}
          <div className={styles.sharedTerms}>
            <h3 className={styles.sharedTermsTitle}>{t("surec.sharedTermsTitle")}</h3>
            <div className={styles.sharedTermsGrid}>
              {SHARED_TERMS.map((termKey) => (
                <div key={termKey} className={styles.sharedTermItem}>
                  <ChevronRight size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                  <span>{t(termKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ADIM ADIM SÜREÇ ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>{t("surec.stepsTag")}</span>
            <h2 className={styles.sectionTitle}>{t("surec.stepsTitle")}</h2>
            <p className={styles.sectionSubtitle}>{t("surec.stepsSubtitle")}</p>
          </div>

          <div className={styles.stepperWrap}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className={styles.stepItem}>
                  <div className={styles.stepLeft}>
                    <div
                      className={styles.stepCircle}
                      style={{ borderColor: step.color, boxShadow: `0 0 20px ${step.color}33` }}
                    >
                      <Icon size={22} color={step.color} />
                    </div>
                    {i < STEPS.length - 1 && <div className={styles.stepLine} />}
                  </div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepNumber} style={{ color: step.color }}>{step.number}</div>
                    <h3 className={styles.stepTitle}>{t(step.titleKey)}</h3>
                    <p className={styles.stepDesc}>{t(step.descKey)}</p>
                  </div>
                </div>
              );
            })}
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
    </div>
  );
}
