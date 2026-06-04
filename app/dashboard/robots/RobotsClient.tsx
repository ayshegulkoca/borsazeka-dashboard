"use client";

import { useState } from "react";
import {
  BrainCircuit,
  Plus,
  Trash2,
  Shield,
  TrendingUp,
  Activity,
  ChevronRight,
  ArrowRight,
  Bot
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { removeRobot } from "@/app/actions/robots";
import type { RobotDef, RobotId } from "@/lib/robots";
import styles from "./page.module.css";

interface Props {
  ownedRobots: RobotDef[];
  hasOwnedRobots: boolean;
}

const ICON_MAP = {
  darkroom: Shield,
  highway: TrendingUp,
  trademate: Activity,
} as const;

export default function RobotsClient({ ownedRobots, hasOwnedRobots }: Props) {
  const { t } = useTranslation("common");
  const [robots, setRobots] = useState<RobotDef[]>(ownedRobots);
  const [selectedRobot, setSelectedRobot] = useState<RobotDef | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRemove = async (robotId: RobotId) => {
    setLoadingId(robotId);
    try {
      await removeRobot(robotId);
      setRobots((prev) => prev.filter((r) => r.id !== robotId));
      if (selectedRobot?.id === robotId) setSelectedRobot(null);
    } catch (err) {
      console.error("Failed to remove robot:", err);
    } finally {
      setLoadingId(null);
    }
  };

  if (!hasOwnedRobots) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyIconWrapper}>
            <Bot size={48} />
          </div>
          <h2 className={styles.emptyTitle}>{t("dashboard.robots.emptyTitle")}</h2>
          <p className={styles.emptyDesc}>
            {t("dashboard.robots.emptyDesc")}
          </p>
          <Link href="/#robotlarimiz" className={styles.emptyCta}>
            {t("dashboard.robots.emptyCta")} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Başlık Banner */}
      <div className={styles.featuredCard}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          {t("dashboard.robots.bannerBadge")}
        </div>
        <h2 className={styles.featuredTitle}>{t("dashboard.robots.bannerTitle")}</h2>
        <p className={styles.featuredSubtitle}>
          {t("dashboard.robots.bannerSubtitle")}
        </p>
        <div className={styles.featuredIcon}>
          <BrainCircuit size={140} color="var(--accent-primary)" />
        </div>
      </div>

      {/* Robot Grid */}
      <div className={styles.robotGrid}>
        {robots.map((robot) => {
          const Icon = ICON_MAP[robot.id] ?? Activity;
          const isLoading = loadingId === robot.id;

          return (
            <div
              key={robot.id}
              className={styles.robotCard}
              style={{
                borderColor: robot.color + "25",
                background: `linear-gradient(135deg, var(--bg-card) 0%, ${robot.color}05 100%)`,
                cursor: "pointer",
                ["--robot-color" as any]: robot.color,
                ["--robot-color-alpha" as any]: robot.color + "45",
                ["--robot-color-glow" as any]: robot.color + "15",
              } as React.CSSProperties}
              onClick={() => setSelectedRobot(robot)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div
                  className={styles.robotCardIconWrapper}
                  style={{
                    background: robot.color + "12",
                  }}
                >
                  <Icon size={26} color={robot.color} />
                </div>
                <span
                  className={styles.robotCardStatusBadge}
                  style={{
                    color: robot.color,
                    background: robot.color + "12",
                    border: `1px solid ${robot.color}25`,
                  }}
                >
                  <span className={styles.robotCardStatusBadgeDot} style={{ color: robot.color, background: robot.color }} />
                  {t("dashboard.robots.active")}
                </span>
              </div>

              <h3 className={styles.robotCardTitle}>{robot.name}</h3>
              <p className={styles.robotCardTagline}>{robot.tagline}</p>

              <div className={styles.robotCardStatsContainer}>
                <div className={styles.robotCardStat}>
                  <span className={styles.robotCardStatLabel}>{t("dashboard.robots.monthlyReturn")}</span>
                  <span className={styles.robotCardStatValue} style={{ color: robot.color }}>{robot.monthlyReturn}</span>
                </div>
                <div className={styles.robotCardStat}>
                  <span className={styles.robotCardStatLabel}>{t("dashboard.robots.riskLevel")}</span>
                  <span className={styles.robotCardStatValue} style={{ color: "var(--text-primary)" }}>{robot.riskLevel}</span>
                </div>
              </div>

              <div className={styles.robotCardButtons} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.robotCardDisableButton}
                  onClick={() => handleRemove(robot.id as RobotId)}
                  disabled={isLoading}
                >
                  <Trash2 size={16} />
                  {isLoading
                    ? t("dashboard.robots.disabling")
                    : t("dashboard.robots.disable")}
                </button>
                <button
                  className={styles.robotCardDetailsButton}
                  onClick={() => setSelectedRobot(robot)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

       {/* Add More CTA */}
       <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link href="/#robotlarimiz">
          <button className={styles.emptyCta} style={{ display: "inline-flex", width: "auto", margin: "0" }}>
            <Plus size={18} /> {t("dashboard.robots.addMore")}
          </button>
        </Link>
      </div>
    </div>
  );
}
