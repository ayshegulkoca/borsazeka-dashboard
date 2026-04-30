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
import SetupWizard from "@/app/components/shared/SetupWizard";

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
      <div className={styles.welcomeSection}>
        <p className={styles.welcomeText}>{t("dashboard.home.welcome")}</p>
        <h1 className={styles.title}>{displayName}</h1>
      </div>

      {/* Setup Wizard — setup eksikse göster */}
      <SetupWizard
        step1Completed={true}
        step2Completed={hasRobots}
        step2Pending={subscriptionStatus === "PENDING"}
        step3Completed={hasBrokerAccounts}
        variant="dashboard"
      />


      {/* ── Kurulum tamamlanmadan bu bölümleri gösterme ── */}
      {hasRobots ? (
        <div className={styles.bentoGrid}>
          {/* Ana Bakiye Kartı */}
          <div className={`${styles.card} ${styles.balanceCard}`}>
            <div className={styles.balanceHeader}>
              {t("dashboard.home.balanceCard")}
              <button
                onClick={() => setShowBalance(!showBalance)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
                aria-label={t("dashboard.home.hideShowBalance")}
              >
                {showBalance ? <Eye size={16} strokeWidth={1.5} /> : <EyeOff size={16} strokeWidth={1.5} />}
              </button>
            </div>
            <div className={styles.balanceValue}>
              {showBalance ? "₺100.000,00" : "*********"}
            </div>
            <div className={styles.pnlPill}>
              <div className={styles.pnlIconWrapper}>
                <TrendingUp size={16} strokeWidth={2} />
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
              <div className={styles.statIconWrapper}>
                <Bot size={18} strokeWidth={1.5} />
              </div>
              <span className={styles.statValue}>{activeRobotCount}</span>
              <span className={styles.statLabel}>{t("dashboard.home.activeRobots")}</span>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <ClipboardList size={18} strokeWidth={1.5} />
              </div>
              <span className={styles.statValue}>2</span>
              <span className={styles.statLabel}>{t("dashboard.home.pendingOrders")}</span>
            </div>
          </div>

          {/* Aktif Robotlarım */}
          {robots.length > 0 && (
            <div>
              <h3 className={styles.sectionHeader}>{t("dashboard.home.myActiveRobots")}</h3>
              <div className={styles.tickerList}>
                {robots.map((r) => (
                  <div key={r.robotId} className={styles.tickerCard}>
                    <div className={styles.tickerInfo}>
                      <div className={styles.tickerIcon}>
                        <Activity size={18} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className={styles.tickerName}>{r.meta?.name ?? r.robotId}</div>
                        <div className={styles.tickerPrice}>
                          {r.meta?.tagline}
                        </div>
                      </div>
                    </div>
                    <div className={styles.tickerBadge}>
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
                <TrendingDown size={18} strokeWidth={1.5} />
              </div>
              <div>
                <div className={styles.tickerName}>BIST 100</div>
                <div className={styles.tickerPrice}>
                  8.100 <span style={{ color: '#ef4444' }}>-0.4%</span>
                </div>
              </div>
            </div>
            <div className={styles.tickerBadge} style={{ background: 'rgba(255,255,255,0.05)', color: '#A1A1AA', borderColor: 'transparent' }}>
              {t("dashboard.home.marketClosed")}
            </div>
          </div>

          {/* Hızlı İşlemler */}
          <h3 className={styles.sectionHeader}>{t("dashboard.home.quickActions")}</h3>
          <Link href="/dashboard/robots">
            <button className={styles.actionButton}>
              <div className={styles.actionIcon}>
                <Plus size={18} strokeWidth={1.5} />
                {robots.length === 0
                  ? t("dashboard.home.addRobot")
                  : t("dashboard.home.addNewRobot")}
              </div>
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </Link>
        </div>
      ) : null}
      {!hasRobots && (
        <div className={styles.zeroState}>
          <div className={styles.zeroIconWrapper}>
            <Bot size={28} strokeWidth={1.5} />
          </div>
          <h3 className={styles.zeroTitle}>
            {t("dashboard.home.noRobotsTitle")}
          </h3>
          <p className={styles.zeroDesc}>
            {t("dashboard.home.noRobotsDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
