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
  CheckCircle2,
  ArrowRight,
  Bot
} from "lucide-react";
import Link from "next/link";
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
          <h2 className={styles.emptyTitle}>Henüz aktif bir robotunuz bulunmuyor</h2>
          <p className={styles.emptyDesc}>
            Algoritmik ticarete başlamak için borsa robotlarımıza göz atabilir ve size en uygun stratejiyi seçebilirsiniz.
          </p>
          <Link href="/#robotlarimiz" className={styles.emptyCta}>
            Robot Vitrinine Göz At <ArrowRight size={18} />
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
          Aktif Robotlarım
        </div>
        <h2 className={styles.featuredTitle}>Robotlarınızı Yönetin</h2>
        <p className={styles.featuredSubtitle}>
          Şu an aktif olan robotlarınızın durumunu izleyebilir veya yeni ayarlar yapabilirsiniz.
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
                borderColor: robot.color + "44",
                background: `linear-gradient(135deg, var(--bg-card) 0%, ${robot.color}08 100%)`,
                cursor: "pointer",
              }}
              onClick={() => setSelectedRobot(robot)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: robot.color + "18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={24} color={robot.color} />
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: robot.color,
                    background: robot.color + "18",
                    padding: "0.2rem 0.6rem",
                    borderRadius: 100,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <CheckCircle2 size={12} /> Aktif
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.25rem" }}>{robot.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.5 }}>
                {robot.tagline}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Aylık Getiri</div>
                  <div style={{ fontWeight: 700, color: robot.color, fontSize: "0.95rem" }}>{robot.monthlyReturn}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Risk Seviyesi</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{robot.riskLevel}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleRemove(robot.id as RobotId)}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "0.65rem",
                    borderRadius: 10,
                    border: "1px solid rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.08)",
                    color: "#f87171",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  <Trash2 size={15} />
                  {isLoading ? "Devre Dışı..." : "Devre Dışı Bırak"}
                </button>
                <button
                  onClick={() => setSelectedRobot(robot)}
                  style={{
                    padding: "0.65rem 0.75rem",
                    borderRadius: 10,
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-card-hover)",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <ChevronRight size={16} />
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
            <Plus size={18} /> Yeni Robot Keşfet
          </button>
        </Link>
      </div>
    </div>
  );
}
