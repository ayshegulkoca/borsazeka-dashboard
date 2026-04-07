"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity, Bot, TrendingUp, Zap, Shield, Target,
  Coins, Globe, ArrowRight, Check, Lock,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import styles from "./landing.module.css";
import robotStyles from "./robots.module.css";

// Robot catalog data — display layer (not wizard data layer)
const ROBOT_CATALOG = [
  // ── BIST Premium ──────────────────────────────────────────────────────────
  {
    id: "DARKROOM",
    nameKey: "wizard.robots.darkroom.name",
    descKey: "wizard.robots.darkroom.desc",
    market: "BIST",
    icon: Shield,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #0e1b15 0%, #072b1c 100%)",
    border: "rgba(16,185,129,0.3)",
    comingSoon: false,
    minBudget: "600.000 ₺",
    maxCapacity: 40,
    profitShare: "%50",
    featureKeys: [
      "wizard.robots.darkroom.f1",
      "wizard.robots.darkroom.f2",
      "wizard.robots.darkroom.f3",
      "wizard.robots.darkroom.f4",
    ],
  },
  {
    id: "HIGHWAY",
    nameKey: "wizard.robots.highway.name",
    descKey: "wizard.robots.highway.desc",
    market: "BIST",
    icon: TrendingUp,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #1c130a 0%, #231a06 100%)",
    border: "rgba(245,158,11,0.3)",
    comingSoon: false,
    minBudget: "600.000 ₺",
    maxCapacity: 30,
    profitShare: "%50",
    featureKeys: [
      "wizard.robots.highway.f1",
      "wizard.robots.highway.f2",
      "wizard.robots.highway.f3",
      "wizard.robots.highway.f4",
    ],
  },
  {
    id: "TRADEMATE",
    nameKey: "wizard.robots.trademate.name",
    descKey: "wizard.robots.trademate.desc",
    market: "BIST",
    icon: Target,
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #0f172a 0%, #0e1b35 100%)",
    border: "rgba(59,130,246,0.3)",
    comingSoon: false,
    minBudget: "600.000 ₺",
    maxCapacity: 50,
    profitShare: "%50",
    featureKeys: [
      "wizard.robots.trademate.f1",
      "wizard.robots.trademate.f2",
      "wizard.robots.trademate.f3",
      "wizard.robots.trademate.f4",
    ],
  },
  {
    id: "FABRIKA",
    nameKey: "wizard.robots.fabrika.name",
    descKey: "wizard.robots.fabrika.desc",
    market: "BIST",
    icon: Activity,
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #160e2a 0%, #1e1040 100%)",
    border: "rgba(139,92,246,0.3)",
    comingSoon: false,
    minBudget: "5.000.000 ₺",
    maxCapacity: 20,
    profitShare: "%45–50",
    featureKeys: [
      "wizard.robots.fabrika.f1",
      "wizard.robots.fabrika.f2",
      "wizard.robots.fabrika.f3",
      "wizard.robots.fabrika.f5",
    ],
  },
  {
    id: "CLASSIC",
    nameKey: "wizard.robots.classic.name",
    descKey: "wizard.robots.classic.desc",
    market: "BIST",
    icon: Zap,
    color: "#64748b",
    gradient: "linear-gradient(135deg, #0f1117 0%, #131820 100%)",
    border: "rgba(100,116,139,0.2)",
    comingSoon: true,
    minBudget: "—",
    maxCapacity: 0,
    profitShare: "—",
    featureKeys: [
      "wizard.robots.classic.f1",
      "wizard.robots.classic.f2",
      "wizard.robots.classic.f3",
    ],
  },
  // ── Kripto ────────────────────────────────────────────────────────────────
  {
    id: "KRIPTTOZEKA",
    nameKey: "wizard.robots.kriptoZeka.name",
    descKey: "wizard.robots.kriptoZeka.desc",
    market: "CRYPTO",
    icon: Coins,
    color: "#f97316",
    gradient: "linear-gradient(135deg, #1c0f06 0%, #291508 100%)",
    border: "rgba(249,115,22,0.3)",
    comingSoon: false,
    minBudget: "$5,000",
    maxCapacity: 20,
    profitShare: "%50",
    featureKeys: [
      "wizard.robots.kriptoZeka.f1",
      "wizard.robots.kriptoZeka.f2",
      "wizard.robots.kriptoZeka.f3",
      "wizard.robots.kriptoZeka.f4",
    ],
  },
  {
    id: "KRIPTTOZEKA_ASCENT",
    nameKey: "wizard.robots.kriptoZekaAscent.name",
    descKey: "wizard.robots.kriptoZekaAscent.desc",
    market: "CRYPTO",
    icon: Bot,
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #1a0a14 0%, #27081a 100%)",
    border: "rgba(236,72,153,0.2)",
    comingSoon: true,
    minBudget: "$5,000",
    maxCapacity: 20,
    profitShare: "%50",
    featureKeys: [
      "wizard.robots.kriptoZekaAscent.f1",
      "wizard.robots.kriptoZekaAscent.f2",
      "wizard.robots.kriptoZekaAscent.f3",
      "wizard.robots.kriptoZekaAscent.f4",
    ],
  },
  // ── Forex ─────────────────────────────────────────────────────────────────
  {
    id: "FOREXZEKA",
    nameKey: "wizard.robots.forexZeka.name",
    descKey: "wizard.robots.forexZeka.desc",
    market: "FOREX",
    icon: Globe,
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #061820 0%, #082434 100%)",
    border: "rgba(6,182,212,0.2)",
    comingSoon: true,
    minBudget: "—",
    maxCapacity: 0,
    profitShare: "—",
    featureKeys: [
      "wizard.robots.forexZeka.f2",
      "wizard.robots.forexZeka.f3",
      "wizard.robots.forexZeka.f4",
    ],
  },
];

const MARKET_LABELS: Record<string, { tr: string; en: string; color: string }> = {
  BIST:   { tr: "BIST", en: "BIST", color: "#10b981" },
  CRYPTO: { tr: "Kripto", en: "Crypto", color: "#f97316" },
  FOREX:  { tr: "Forex", en: "Forex", color: "#06b6d4" },
};

export default function RobotsPage() {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language?.startsWith("tr") ? "tr" : "en";
  const router = useRouter();

  const handleSelect = (robotId: string, comingSoon: boolean) => {
    if (comingSoon) return;
    router.push(`/urun-sec?robot=${robotId}`);
  };

  return (
    <div className={robotStyles.page}>
      <Navbar />

      {/* Hero */}
      <section className={robotStyles.hero}>
        <div className={robotStyles.heroInner}>
          <span className={robotStyles.sectionTag}>{t("robots.sectionTag")}</span>
          <h1 className={robotStyles.heroTitle}>{t("robots.sectionTitle")}</h1>
          <p className={robotStyles.heroSubtitle}>{t("robots.sectionSubtitle")}</p>
        </div>
      </section>

      {/* Robot Grid */}
      <section className={robotStyles.section}>
        <div className={robotStyles.container}>
          <div className={robotStyles.grid}>
            {ROBOT_CATALOG.map((robot) => {
              const Icon = robot.icon;
              const mktLabel = MARKET_LABELS[robot.market];
              return (
                <div
                  key={robot.id}
                  className={`${robotStyles.card} ${robot.comingSoon ? robotStyles.cardComingSoon : ""}`}
                  style={{ background: robot.gradient, borderColor: robot.border }}
                >
                  {robot.comingSoon && (
                    <div className={robotStyles.comingSoonOverlay}>
                      <Lock size={14} />
                      {t("robots.comingSoon")}
                    </div>
                  )}

                  {/* Card top */}
                  <div className={robotStyles.cardTop}>
                    <div
                      className={robotStyles.iconWrap}
                      style={{ background: `${robot.color}1a`, border: `1px solid ${robot.color}33` }}
                    >
                      <Icon size={22} color={robot.color} />
                    </div>
                    <span
                      className={robotStyles.marketBadge}
                      style={{ color: mktLabel.color, background: `${mktLabel.color}18`, borderColor: `${mktLabel.color}33` }}
                    >
                      {mktLabel[lang]}
                    </span>
                  </div>

                  {/* Name & desc */}
                  <div className={robotStyles.cardBody}>
                    <h2 className={robotStyles.cardName} style={{ color: robot.comingSoon ? "#475569" : "var(--text-primary)" }}>
                      {t(robot.nameKey)}
                    </h2>
                    <p className={robotStyles.cardDesc}>{t(robot.descKey)}</p>
                  </div>

                  {/* Stats row */}
                  <div className={robotStyles.statsRow}>
                    <div className={robotStyles.statItem}>
                      <span className={robotStyles.statLabel}>{t("robots.minBudget")}</span>
                      <span className={robotStyles.statValue} style={{ color: robot.comingSoon ? "#475569" : robot.color }}>
                        {robot.minBudget}
                      </span>
                    </div>
                    {robot.maxCapacity > 0 && (
                      <div className={robotStyles.statItem}>
                        <span className={robotStyles.statLabel}>{t("robots.maxCapacity")}</span>
                        <span className={robotStyles.statValue} style={{ color: robot.comingSoon ? "#475569" : robot.color }}>
                          {robot.maxCapacity}
                        </span>
                      </div>
                    )}
                    <div className={robotStyles.statItem}>
                      <span className={robotStyles.statLabel}>{t("robots.profitShare")}</span>
                      <span className={robotStyles.statValue} style={{ color: robot.comingSoon ? "#475569" : robot.color }}>
                        {robot.profitShare}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={robotStyles.divider} />

                  {/* Features */}
                  <ul className={robotStyles.featureList}>
                    {robot.featureKeys.map((fk) => (
                      <li key={fk} className={robotStyles.featureItem}>
                        <Check size={13} color={robot.comingSoon ? "#334155" : robot.color} style={{ flexShrink: 0 }} />
                        <span style={{ color: robot.comingSoon ? "#334155" : "var(--text-secondary)" }}>{t(fk)}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    className={`${robotStyles.cardCta} ${robot.comingSoon ? robotStyles.cardCtaDisabled : ""}`}
                    disabled={robot.comingSoon}
                    onClick={() => handleSelect(robot.id, robot.comingSoon)}
                    style={
                      robot.comingSoon
                        ? {}
                        : { background: robot.color, color: "#fff" }
                    }
                  >
                    {robot.comingSoon ? (
                      <>
                        <Lock size={14} />
                        {t("robots.comingSoon")}
                      </>
                    ) : (
                      <>
                        {t("robots.ctaButton")}
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className={robotStyles.bottomCta}>
            <p className={robotStyles.bottomCtaText}>
              {t("wizardCta.subtitle")}
            </p>
            <Link href="/urun-sec" className={robotStyles.bottomCtaBtn} id="robots-wizard-btn">
              {t("hero.ctaButton")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
