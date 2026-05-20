"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity, Bot, TrendingUp, Zap, Shield, Target,
  Coins, Globe, ArrowRight, Check, Lock, Cpu, Route
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import styles from "./landing.module.css";
import robotStyles from "./robots.module.css";

// Dynamic Wizard Data Source
import { ROBOTS, getBudgetOptionsForRobot, calcPriceForRobot, type RobotDefinition } from "@/src/data/products";

const ROBOT_STYLE_MAP: Record<string, {
  icon: any;
  color: string;
  gradient: string;
  border: string;
}> = {
  DARKROOM: { icon: Shield, color: "#a855f7", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  DARKROOM_SELF: { icon: Shield, color: "#a855f7", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  HIGHWAY: { icon: TrendingUp, color: "#3b82f6", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  HIGHWAY_SELF: { icon: TrendingUp, color: "#3b82f6", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  TRADEMATE: { icon: Target, color: "#10b981", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  TRADEMATE_SELF: { icon: Target, color: "#10b981", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  FABRIKA: { icon: Activity, color: "#f59e0b", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  FABRIKA_SELF: { icon: Activity, color: "#f59e0b", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  CLASSIC: { icon: Zap, color: "#94a3b8", gradient: "linear-gradient(135deg, #050505 0%, #000000 100%)", border: "rgba(100,116,139,0.2)" },
  KRIPTTOZEKA: { icon: Coins, color: "#f59e0b", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  KRIPTTOZEKA_ASCENT: { icon: Bot, color: "#f97316", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  KRIPTTOZEKA_SELF: { icon: Bot, color: "#a855f7", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
  FOREXZEKA: { icon: Globe, color: "#0d9488", gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)", border: "rgba(255, 255, 255, 0.08)" },
};

// Localized Strategy Summaries for dynamic cards
const STRATEGY_SUMMARIES: Record<string, { tr: string; en: string }> = {
  DARKROOM: { tr: "Gap / Boşluk Ticareti", en: "Gap Trading" },
  DARKROOM_SELF: { tr: "Gap / Boşluk Ticareti", en: "Gap Trading" },
  HIGHWAY: { tr: "Trend Takip Algoritması", en: "Trend Following Algorithm" },
  HIGHWAY_SELF: { tr: "Trend Takip Algoritması", en: "Trend Following Algorithm" },
  TRADEMATE: { tr: "Overnight & Gün İçi Algoritma", en: "Overnight & Intraday Algorithm" },
  TRADEMATE_SELF: { tr: "Overnight & Gün İçi Algoritma", en: "Overnight & Intraday Algorithm" },
  FABRIKA: { tr: "Çoklu Zaman Dilimi Trendi", en: "Multi-Timeframe Trend" },
  FABRIKA_SELF: { tr: "Çoklu Zaman Dilimi Trendi", en: "Multi-Timeframe Trend" },
  CLASSIC: { tr: "Standart Trend Takip", en: "Standard Trend Following" },
  KRIPTTOZEKA: { tr: "Kripto Portföy & Hızlı Trend", en: "Crypto Portfolio & Trend" },
  KRIPTTOZEKA_ASCENT: { tr: "Kripto Trend & Yapay Zeka", en: "Crypto Trend & AI" },
  KRIPTTOZEKA_SELF: { tr: "Gelişmiş Kripto Portföy", en: "Advanced Crypto Portfolio" },
  FOREXZEKA: { tr: "Global Pariteler & Emtia Arbitraj", en: "Global FX & Commodity" },
};

const MARKET_LABELS: Record<string, { tr: string; en: string }> = {
  BIST:   { tr: "BIST", en: "BIST" },
  CRYPTO: { tr: "Kripto", en: "Crypto" },
  FOREX:  { tr: "Forex", en: "Forex" },
};

function getRobotPricingDetails(robotId: string, lang: "tr" | "en") {
  const isTr = lang === "tr";
  
  if (robotId === "CLASSIC") {
    return {
      budgetRange: isTr ? "Yakında Belirlenecek" : "TBD",
      costDisplay: isTr ? "Yakında Belirlenecek" : "TBD",
    };
  }

  const options = getBudgetOptionsForRobot(robotId as any);
  if (options.length === 0) {
    return {
      budgetRange: "—",
      costDisplay: "—",
    };
  }

  let finalBudget = "";
  if (robotId === "DARKROOM" || robotId === "HIGHWAY") {
    finalBudget = isTr ? "600K - 5M ₺" : "600K - 5M ₺";
  } else if (robotId === "TRADEMATE") {
    finalBudget = isTr ? "600K - 100M ₺" : "600K - 100M ₺";
  } else if (robotId === "FABRIKA") {
    finalBudget = isTr ? "5M - 100M ₺" : "5M - 100M ₺";
  } else if (robotId === "DARKROOM_SELF" || robotId === "HIGHWAY_SELF" || robotId === "TRADEMATE_SELF") {
    finalBudget = isTr ? "0 - 600K ₺" : "0 - 600K ₺";
  } else if (robotId === "FABRIKA_SELF") {
    finalBudget = isTr ? "600K - 5M ₺" : "600K - 5M ₺";
  } else if (robotId === "KRIPTTOZEKA" || robotId === "KRIPTTOZEKA_ASCENT") {
    finalBudget = isTr ? "$5K - $50K+" : "$5K - $50K+";
  } else if (robotId === "KRIPTTOZEKA_SELF") {
    finalBudget = isTr ? "$0 - $5K" : "$0 - $5K";
  } else if (robotId === "FOREXZEKA") {
    finalBudget = isTr ? "$500 - $5K+" : "$500 - $5K+";
  } else {
    const minOpt = options[0];
    const maxOpt = options[options.length - 1];
    const firstLabel = minOpt.label.replace("₺", " ₺").replace("$", "$ ");
    const lastLabel = maxOpt.label.replace("₺", " ₺").replace("$", "$ ");
    finalBudget = `${firstLabel.split(" – ")[0]} - ${lastLabel.split(" – ").pop()}`;
  }

  const minOpt = options[0];
  const maxOpt = options[options.length - 1];
  const minPrice = calcPriceForRobot(robotId as any, minOpt.value);
  const maxPrice = calcPriceForRobot(robotId as any, maxOpt.value);
  
  let costDisplay = "";
  if (minPrice && maxPrice) {
    const hasProfitShare = minPrice.profitSharePercent > 0 || maxPrice.profitSharePercent > 0;
    const profitShareStr = hasProfitShare
      ? (minPrice.profitSharePercent === maxPrice.profitSharePercent
          ? ` + %${minPrice.profitSharePercent} ${isTr ? "Kâr Paylaşımı" : "Profit Share"}`
          : ` + %${minPrice.profitSharePercent}–%${maxPrice.profitSharePercent} ${isTr ? "Kâr Paylaşımı" : "Profit Share"}`)
      : "";
      
    const perPeriod = isTr ? "/ay" : "/mo";
    
    if (minPrice.serverCostEUR === maxPrice.serverCostEUR) {
      costDisplay = `€${minPrice.serverCostEUR}${perPeriod}${profitShareStr}`;
    } else {
      costDisplay = `€${minPrice.serverCostEUR} - €${maxPrice.serverCostEUR}${perPeriod}${profitShareStr}`;
    }
  } else {
    costDisplay = "—";
  }
  
  return {
    budgetRange: finalBudget,
    costDisplay,
  };
}

export default function RobotsPage() {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language?.startsWith("tr") ? "tr" : "en";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"PREMIUM" | "SELF_SERVICE">("PREMIUM");

  const handleSelect = (robotId: string, comingSoon: boolean) => {
    if (comingSoon) return;
    router.push(`/urun-sec?robot=${robotId}`);
  };

  const filteredRobots = ROBOTS.filter((r: RobotDefinition) => r.managementType === activeTab);

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

      {/* Robot Filtering Tabs */}
      <div className={robotStyles.tabContainer}>
        <button
          className={`${robotStyles.tabButton} ${activeTab === "PREMIUM" ? robotStyles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("PREMIUM")}
        >
          {t("wizard.step3.premium") || "Premium: Biz Yönetelim"}
        </button>
        <button
          className={`${robotStyles.tabButton} ${activeTab === "SELF_SERVICE" ? robotStyles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("SELF_SERVICE")}
        >
          {t("wizard.step3.selfService") || "Self-Service: Kendi Yönet"}
        </button>
      </div>

      {/* Robot Grid */}
      <section className={robotStyles.section}>
        <div className={robotStyles.container}>
          <div className={robotStyles.grid}>
            {filteredRobots.map((robot: RobotDefinition) => {
              const styleConfig = ROBOT_STYLE_MAP[robot.id] || {
                icon: Cpu,
                color: "#94a3b8",
                gradient: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)",
                border: "rgba(255, 255, 255, 0.08)",
              };
              const Icon = styleConfig.icon;
              const mktLabel = MARKET_LABELS[robot.market];
              const { budgetRange, costDisplay } = getRobotPricingDetails(robot.id, lang);
              const strategySummary = STRATEGY_SUMMARIES[robot.id]?.[lang] || "—";

              return (
                <div
                  key={robot.id}
                  className={`${robotStyles.card} ${robot.comingSoon ? robotStyles.cardComingSoon : ""}`}
                  style={{ "--card-accent": styleConfig.color } as React.CSSProperties}
                >
                  {robot.comingSoon && (
                    <div 
                      className={robotStyles.comingSoonOverlay}
                      style={{ 
                        color: styleConfig.color, 
                        background: `${styleConfig.color}15`, 
                        borderColor: `${styleConfig.color}30` 
                      }}
                    >
                      <Lock size={12} color={styleConfig.color} />
                      {t("wizard.comingSoonBadge") || "Pek Yakında"}
                    </div>
                  )}

                  {/* Card top */}
                  <div className={robotStyles.cardTop}>
                    <div
                      className={robotStyles.iconWrap}
                      style={{ background: `${styleConfig.color}10`, border: `1px solid ${styleConfig.color}33` }}
                    >
                      <div 
                        className={robotStyles.iconGlow} 
                        style={{ background: styleConfig.color }}
                      />
                      <Icon size={18} color={styleConfig.color} style={{ position: "relative", zIndex: 1 }} />
                    </div>
                    <div className={robotStyles.badgeRow}>
                      {robot.maxCapacity > 0 && !robot.comingSoon && (
                        <span className={robotStyles.capacityBadge}>
                          {lang === "tr" ? `${robot.maxCapacity} Kişilik` : `${robot.maxCapacity} Users`}
                        </span>
                      )}
                      <span
                        className={robotStyles.marketBadge}
                        style={{ 
                          color: robot.comingSoon ? `${styleConfig.color}80` : styleConfig.color, 
                          background: `${styleConfig.color}10`, 
                          borderColor: `${styleConfig.color}25` 
                        }}
                      >
                        {mktLabel[lang]}
                      </span>
                    </div>
                  </div>

                  {/* Name & desc */}
                  <div className={robotStyles.cardBody}>
                    <h2 className={robotStyles.cardName}>
                      {t(robot.nameKey)}
                    </h2>
                    <p className={robotStyles.cardDesc}>{t(robot.descKey)}</p>
                  </div>

                  {/* Dynamic Technical Details & Pricing */}
                  <div className={robotStyles.techInfoContainer}>
                    <div className={robotStyles.techInfoItem}>
                      <span className={robotStyles.techInfoLabel}>{lang === "tr" ? "Strateji" : "Strategy"}</span>
                      <span className={robotStyles.techInfoValue}>{strategySummary}</span>
                    </div>
                    <div className={robotStyles.techInfoItem}>
                      <span className={robotStyles.techInfoLabel}>{lang === "tr" ? "Bütçe Aralığı" : "Budget Range"}</span>
                      <span className={robotStyles.techInfoValue}>{budgetRange}</span>
                    </div>
                    <div className={robotStyles.techInfoItem}>
                      <span className={robotStyles.techInfoLabel}>{lang === "tr" ? "Maliyet" : "Cost"}</span>
                      <span className={robotStyles.techInfoValue}>{costDisplay}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={robotStyles.divider} />

                  {/* Features */}
                  <ul className={robotStyles.featureList}>
                    {robot.features.slice(0, 3).map((fk: string) => (
                      <li key={fk} className={robotStyles.featureItem}>
                        <Check size={12} color={robot.comingSoon ? "#94a3b8" : styleConfig.color} style={{ flexShrink: 0 }} />
                        <span>{t(fk)}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    className={`${robotStyles.cardCta} ${robot.comingSoon ? robotStyles.cardCtaDisabled : ""}`}
                    disabled={robot.comingSoon}
                    onClick={() => handleSelect(robot.id, robot.comingSoon)}
                  >
                    {robot.comingSoon ? (
                      <>
                        <Lock size={12} style={{ marginRight: "4px" }} />
                        {t("wizard.comingSoonBadge") || "Pek Yakında"}
                      </>
                    ) : (
                      lang === "tr" ? "Detayları Gör" : "View Details"
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
      {/* Gradient fade from light section back to dark footer */}
      <div className={robotStyles.sectionFadeBottom} />
    </div>
  );
}
