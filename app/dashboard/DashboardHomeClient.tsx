"use client";

import { useState } from "react";
import {
  Eye, EyeOff, Bot, ClipboardList,
  TrendingUp, TrendingDown, ArrowRight, Plus, Activity,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";
import Link from "next/link";
import type { RobotDef } from "@/lib/robots";
import OnboardingProgressWidget from "./OnboardingProgressWidget";

interface RobotWithMeta {
  id: string;
  robotId: string;
  isActive: boolean;
  addedAt: Date;
  meta: RobotDef | null;
}

interface Props {
  displayName: string;
  activeRobotCount: number;
  robots: RobotWithMeta[];
  hasRobots: boolean;
  hasBrokerAccounts: boolean;
  subscriptionStatus?: string;
}


export default function DashboardHomeClient({
  displayName,
  activeRobotCount,
  robots,
  hasRobots,
  hasBrokerAccounts,
  subscriptionStatus,
}: Props) {
  const { t } = useTranslation("common");
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className={styles.container}>
      {/* Hoşgeldin */}
      <div>
        <p className={styles.welcomeText}>{t("dashboard.home.welcome")}</p>
        <h1 className={styles.title}>{displayName}</h1>
      </div>

      {/* Onboarding Widget — setup eksikse göster */}
      <OnboardingProgressWidget 
        hasRobots={hasRobots} 
        hasBrokerAccounts={hasBrokerAccounts} 
        subscriptionStatus={subscriptionStatus}
      />


      {/* ── Kurulum tamamlanmadan bu bölümleri gösterme ── */}
      {hasRobots ? (
        <>
          {/* Ana Bakiye Kartı */}
          <div className={styles.balanceCard}>
            <div className={styles.balanceHeader}>
              {t("dashboard.home.balanceCard")}
              <button
                onClick={() => setShowBalance(!showBalance)}
                className={styles.eyeIcon}
                aria-label={t("dashboard.home.hideShowBalance")}
              >
                {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <div className={styles.balanceValue}>
              {showBalance ? "₺100.000,00" : "*********"}
            </div>
            <div className={styles.pnlPill}>
              <div className={styles.pnlIconWrapper}>
                <TrendingUp size={18} />
              </div>
              <div>
                <span className={styles.pnlLabel}>{t("dashboard.home.dailyPnl")}</span>
                <span className={styles.pnlValue}>+₺1.250 (%0.85)</span>
              </div>
            </div>
          </div>

          {/* İstatistik Kartları */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.robotIcon}`}>
                <Bot size={20} />
              </div>
              <span className={styles.statValue}>{activeRobotCount}</span>
              <span className={styles.statLabel}>{t("dashboard.home.activeRobots")}</span>
            </div>
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.orderIcon}`}>
                <ClipboardList size={20} />
              </div>
              <span className={styles.statValue}>2</span>
              <span className={styles.statLabel}>{t("dashboard.home.pendingOrders")}</span>
            </div>
          </div>

          {/* Aktif Robotlarım */}
          {robots.length > 0 && (
            <div>
              <h3 className={styles.actionsHeader}>{t("dashboard.home.myActiveRobots")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {robots.map((r) => (
                  <div key={r.robotId} className={styles.tickerCard}>
                    <div className={styles.tickerInfo}>
                      <div
                        className={styles.tickerIcon}
                        style={{ background: (r.meta?.color ?? "var(--accent-primary)") + "22" }}
                      >
                        <Activity size={20} color={r.meta?.color ?? "var(--accent-primary)"} />
                      </div>
                      <div>
                        <div className={styles.tickerName}>{r.meta?.name ?? r.robotId}</div>
                        <div
                          className={styles.tickerPrice}
                          style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                        >
                          {r.meta?.tagline}
                        </div>
                      </div>
                    </div>
                    <div
                      className={styles.tickerBadge}
                      style={{
                        background: "rgba(16,185,129,0.1)",
                        color: "var(--accent-primary)",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      {r.meta?.monthlyReturn ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Ticker */}
          <div className={styles.tickerCard}>
            <div className={styles.tickerInfo}>
              <div className={styles.tickerIcon}>
                <TrendingDown size={20} />
              </div>
              <div>
                <div className={styles.tickerName}>BIST 100</div>
                <div className={styles.tickerPrice}>
                  8.100 <span className={styles.tickerChange}>-0.4%</span>
                </div>
              </div>
            </div>
            <div className={styles.tickerBadge}>{t("dashboard.home.marketClosed")}</div>
          </div>

          {/* Hızlı İşlemler */}
          <h3 className={styles.actionsHeader}>{t("dashboard.home.quickActions")}</h3>
          <Link href="/dashboard/robots">
            <button className={styles.actionButton}>
              <div className={styles.actionIcon}>
                <Plus size={20} />
                {robots.length === 0
                  ? t("dashboard.home.addRobot")
                  : t("dashboard.home.addNewRobot")}
              </div>
              <ArrowRight size={20} />
            </button>
          </Link>
        </>
      ) : (
        /* Zero Data Message */
        <div style={{
          marginTop: "2rem",
          padding: "3rem 2rem",
          textAlign: "center",
          background: "rgba(16,185,129,0.03)",
          border: "1px dashed rgba(16,185,129,0.15)",
          borderRadius: "20px",
          color: "var(--text-muted)"
        }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "rgba(16,185,129,0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            color: "var(--accent-primary)"
          }}>
            <Bot size={28} />
          </div>
          <h3 style={{ color: "var(--text-primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
            {t("dashboard.home.noRobotsTitle")}
          </h3>
          <p style={{ fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto" }}>
            {t("dashboard.home.noRobotsDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
