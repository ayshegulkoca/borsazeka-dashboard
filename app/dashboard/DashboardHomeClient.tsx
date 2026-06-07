"use client";

import { useState } from "react";
import {
  Eye, EyeOff, Bot, ClipboardList,
  TrendingUp, TrendingDown, ArrowRight, Plus, Activity,
  Zap, BarChart3, Wifi,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import s from "./page.module.css";
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
    <div className={s.pageRoot}>

      {/* ── Hoşgeldin Başlığı ──────────────────────────────────── */}
      <div className={s.welcomeRow}>
        <div className={s.welcomeLeft}>
          <div className={s.greetingDot} />
          <div>
            <p className={s.greetingLabel}>{t("dashboard.home.welcome")}</p>
            <h1 className={s.greetingName}>{displayName}</h1>
          </div>
        </div>
        <div className={s.headerBadge}>
          <Wifi size={12} strokeWidth={2} />
          <span>Canlı</span>
        </div>
      </div>

      {/* ── Slim Onboarding Bar ────────────────────────────────── */}
      <SetupWizard
        step1Completed={true}
        step2Completed={hasRobots}
        step2Pending={subscriptionStatus === "PENDING"}
        step3Completed={hasBrokerAccounts}
        variant="dashboard"
      />

      {/* ── Ana İçerik: 3 Kolonlu Grid ─────────────────────────── */}
      {hasRobots ? (
        <div className={s.mainGrid}>

          {/* ══ SOL + ORTA (2 Kolon) ══════════════════════════════ */}
          <div className={s.leftCenter}>

            {/* ── Elit Bakiye Kartı ──────────────────────────────── */}
            <div className={s.balanceCard}>
              {/* Arka plan efektleri */}
              <div className={s.balanceGlowBlue} aria-hidden />
              <div className={s.balanceGlowGreen} aria-hidden />

              {/* Üst Row: Label + Göz butonu */}
              <div className={s.balanceHeader}>
                <div className={s.balanceLabelGroup}>
                  <BarChart3 size={14} strokeWidth={1.5} className={s.balanceLabelIcon} />
                  <span className={s.balanceLabelText}>{t("dashboard.home.balanceCard")}</span>
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className={s.eyeBtn}
                  aria-label={t("dashboard.home.hideShowBalance")}
                >
                  {showBalance
                    ? <Eye size={15} strokeWidth={1.5} />
                    : <EyeOff size={15} strokeWidth={1.5} />}
                </button>
              </div>

              {/* Bakiye Miktarı */}
              <div className={s.balanceAmountWrapper}>
                <span className={s.balanceCurrency}>₺</span>
                <span className={s.balanceAmount}>
                  {showBalance ? "100.000,00" : "••••••••"}
                </span>
              </div>

              {/* PnL Şeridi */}
              <div className={s.pnlStrip}>
                <div className={s.pnlIconBox}>
                  <TrendingUp size={15} strokeWidth={2} />
                </div>
                <div className={s.pnlTexts}>
                  <span className={s.pnlLabel}>{t("dashboard.home.dailyPnl")}</span>
                  <span className={s.pnlValue}>+₺1.250 <em>(%0.85)</em></span>
                </div>
                <div className={s.pnlBadge}>▲ Yükselen</div>
              </div>

              {/* Alt mini metrikler */}
              <div className={s.balanceMinis}>
                <div className={s.balanceMini}>
                  <span className={s.balanceMiniLabel}>Haftalık</span>
                  <span className={s.balanceMiniPos}>+₺4.320</span>
                </div>
                <div className={s.balanceMiniDivider} />
                <div className={s.balanceMini}>
                  <span className={s.balanceMiniLabel}>Aylık</span>
                  <span className={s.balanceMiniPos}>+₺18.750</span>
                </div>
                <div className={s.balanceMiniDivider} />
                <div className={s.balanceMini}>
                  <span className={s.balanceMiniLabel}>Yıllık</span>
                  <span className={s.balanceMiniPos}>+%23.4</span>
                </div>
              </div>
            </div>

            {/* ── Aktif Robotlarım ───────────────────────────────── */}
            {robots.length > 0 && (
              <div className={s.robotsSection}>
                <div className={s.sectionTitleRow}>
                  <h2 className={s.sectionTitle}>{t("dashboard.home.myActiveRobots")}</h2>
                  <Link href="/dashboard/robots" className={s.sectionLink}>
                    Tümünü gör <ArrowRight size={13} strokeWidth={2} />
                  </Link>
                </div>
                <div className={s.robotGrid}>
                  {robots.map((r) => (
                    <div key={r.robotId} className={s.robotCard}>
                      <div className={s.robotCardTop}>
                        <div className={s.robotIconBox}>
                          <Activity size={16} strokeWidth={1.5} />
                        </div>
                        <div className={`${s.robotStatusDot} ${r.isActive ? s.robotStatusActive : s.robotStatusOff}`} />
                      </div>
                      <div className={s.robotName}>{r.meta?.name ?? r.robotId}</div>
                      <div className={s.robotTagline}>{r.meta?.tagline}</div>
                      <div className={s.robotFooter}>
                        <span className={s.robotReturn}>{r.meta?.monthlyReturn ?? "—"}</span>
                        <span className={s.robotReturnLabel}>/ ay</span>
                      </div>
                    </div>
                  ))}

                  {/* BIST 100 Market Kartı */}
                  <div className={`${s.robotCard} ${s.marketCard}`}>
                    <div className={s.robotCardTop}>
                      <div className={`${s.robotIconBox} ${s.robotIconRed}`}>
                        <TrendingDown size={16} strokeWidth={1.5} />
                      </div>
                      <span className={s.marketClosedBadge}>{t("dashboard.home.marketClosed")}</span>
                    </div>
                    <div className={s.robotName}>BIST 100</div>
                    <div className={s.robotTagline}>Borsa İstanbul Endeksi</div>
                    <div className={s.robotFooter}>
                      <span className={s.robotReturn} style={{ color: '#ef4444' }}>-0.4%</span>
                      <span className={s.robotReturnLabel}>8.100</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══ SAĞ SÜTUN (1 Kolon) ═══════════════════════════════ */}
          <div className={s.rightColumn}>

            {/* Aktif Robot Kartı */}
            <div className={s.metricCard}>
              <div className={s.metricIconBox}>
                <Bot size={16} strokeWidth={1.5} />
              </div>
              <div className={s.metricContent}>
                <span className={s.metricValue}>{activeRobotCount}</span>
                <span className={s.metricLabel}>{t("dashboard.home.activeRobots")}</span>
              </div>
              <div className={s.metricPulse} />
            </div>

            {/* Bekleyen Emir Kartı */}
            <div className={s.metricCard}>
              <div className={`${s.metricIconBox} ${s.metricIconYellow}`}>
                <ClipboardList size={16} strokeWidth={1.5} />
              </div>
              <div className={s.metricContent}>
                <span className={s.metricValue}>2</span>
                <span className={s.metricLabel}>{t("dashboard.home.pendingOrders")}</span>
              </div>
            </div>

            {/* Performans Mini Kartı */}
            <div className={s.performanceCard}>
              <div className={s.performanceTitle}>
                <Zap size={13} strokeWidth={2} />
                Sistem Durumu
              </div>
              <div className={s.performanceRows}>
                <div className={s.perfRow}>
                  <span className={s.perfLabel}>Robot Uptime</span>
                  <span className={s.perfValue}>99.8%</span>
                </div>
                <div className={s.perfRowBar}>
                  <div className={s.perfBarTrack}>
                    <div className={s.perfBarFill} style={{ width: '99.8%' }} />
                  </div>
                </div>
                <div className={s.perfRow}>
                  <span className={s.perfLabel}>API Latency</span>
                  <span className={s.perfValue}>12ms</span>
                </div>
                <div className={s.perfRowBar}>
                  <div className={s.perfBarTrack}>
                    <div className={s.perfBarFill} style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Yeni Robot Ekle Butonu */}
            <Link href="/dashboard/robots" className={s.addRobotBtn}>
              <div className={s.addRobotBtnInner}>
                <div className={s.addRobotIcon}>
                  <Plus size={18} strokeWidth={2} />
                </div>
                <div className={s.addRobotTexts}>
                  <span className={s.addRobotTitle}>
                    {robots.length === 0
                      ? t("dashboard.home.addRobot")
                      : t("dashboard.home.addNewRobot")}
                  </span>
                  <span className={s.addRobotSub}>Robot portföyünü genişlet</span>
                </div>
              </div>
              <ArrowRight size={16} strokeWidth={1.5} className={s.addRobotArrow} />
            </Link>

          </div>
        </div>
      ) : (
        /* ── Sıfır Durum ─────────────────────────────────────── */
        <div className={s.zeroState}>
          <div className={s.zeroIconWrapper}>
            <Bot size={28} strokeWidth={1.5} />
          </div>
          <h3 className={s.zeroTitle}>{t("dashboard.home.noRobotsTitle")}</h3>
          <p className={s.zeroDesc}>{t("dashboard.home.noRobotsDesc")}</p>
          <Link href="/dashboard/robots" className={s.zeroCta}>
            <Plus size={16} strokeWidth={2} />
            {t("dashboard.home.addRobot")}
          </Link>
        </div>
      )}
    </div>
  );
}
