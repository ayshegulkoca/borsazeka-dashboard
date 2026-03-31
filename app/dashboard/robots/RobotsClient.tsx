"use client";

import { useState, useTransition } from "react";
import {
  BrainCircuit,
  X,
  Plus,
  Trash2,
  TrendingUp,
  Shield,
  Activity,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { addRobot, removeRobot } from "@/app/actions/robots";
import type { RobotDef, RobotId } from "@/lib/robots";
import styles from "./page.module.css";

interface Props {
  catalog: RobotDef[];
  activeRobotIds: string[];
}

const ICON_MAP = {
  darkroom: Shield,
  highway: TrendingUp,
  trademate: Activity,
} as const;

export default function RobotsClient({ catalog, activeRobotIds }: Props) {
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set(activeRobotIds));
  const [selectedRobot, setSelectedRobot] = useState<RobotDef | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAdd = (robotId: RobotId) => {
    setLoadingId(robotId);
    startTransition(async () => {
      await addRobot(robotId);
      setOwnedIds((prev) => new Set([...prev, robotId]));
      setLoadingId(null);
    });
  };

  const handleRemove = (robotId: RobotId) => {
    setLoadingId(robotId);
    startTransition(async () => {
      await removeRobot(robotId);
      setOwnedIds((prev) => {
        const next = new Set(prev);
        next.delete(robotId);
        return next;
      });
      setLoadingId(null);
      if (selectedRobot?.id === robotId) setSelectedRobot(null);
    });
  };

  return (
    <div className={styles.container}>
      {/* Başlık Banner */}
      <div className={styles.featuredCard}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          Robot Marketi
        </div>
        <h2 className={styles.featuredTitle}>Robotunu Seç, Kazancını Optimize Et</h2>
        <p className={styles.featuredSubtitle}>
          Sahip olduğun planla uyumlu robotları dashboard'una ekle veya kaldır.
        </p>
        <div className={styles.featuredIcon}>
          <BrainCircuit size={140} color="var(--accent-primary)" />
        </div>
      </div>

      {/* Robot Grid */}
      <div className={styles.robotGrid}>
        {catalog.map((robot) => {
          const Icon = ICON_MAP[robot.id] ?? Activity;
          const isOwned = ownedIds.has(robot.id);
          const isLoading = loadingId === robot.id && isPending;

          return (
            <div
              key={robot.id}
              className={styles.robotCard}
              style={{
                borderColor: isOwned ? robot.color + "44" : undefined,
                background: isOwned
                  ? `linear-gradient(135deg, var(--bg-card) 0%, ${robot.color}08 100%)`
                  : undefined,
                cursor: "pointer",
              }}
              onClick={() => setSelectedRobot(robot)}
            >
              {/* Üst kısım */}
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
                {isOwned && (
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
                )}
              </div>

              {/* Bilgiler */}
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.25rem" }}>{robot.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.5 }}>
                {robot.tagline}
              </div>

              {/* İstatistikler */}
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Aylık Getiri</div>
                  <div style={{ fontWeight: 700, color: robot.color, fontSize: "0.95rem" }}>{robot.monthlyReturn}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Başarı Oranı</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{robot.winRate}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Risk</div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{robot.riskLevel}</div>
                </div>
              </div>

              {/* Aksiyon butonları */}
              <div style={{ display: "flex", gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                {isOwned ? (
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
                    {isLoading ? "Kaldırılıyor..." : "Kaldır"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleAdd(robot.id as RobotId)}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      padding: "0.65rem",
                      borderRadius: 10,
                      border: "none",
                      background: robot.color,
                      color: "#022c22",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    <Plus size={15} />
                    {isLoading ? "Ekleniyor..." : "Ekle"}
                  </button>
                )}
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

      {/* Robot Detay Modal */}
      {selectedRobot && (
        <div className={styles.modalOverlay} onClick={() => setSelectedRobot(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedRobot(null)}>
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div
                className={styles.modalIcon}
                style={{ background: selectedRobot.color + "22", color: selectedRobot.color }}
              >
                {(() => {
                  const Icon = ICON_MAP[selectedRobot.id] ?? Activity;
                  return <Icon size={28} />;
                })()}
              </div>
              <div className={styles.modalHeaderInfo}>
                <h2>{selectedRobot.name}</h2>
                <p>{selectedRobot.riskLevel} Risk · {selectedRobot.tags.join(" · ")}</p>
              </div>
            </div>

            {/* İstatistikler */}
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <div className={styles.statBoxTitle}>Aylık Getiri</div>
                <div className={`${styles.statBoxValue} ${styles.statGreen}`}>{selectedRobot.monthlyReturn}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxTitle}>İşlem Sayısı</div>
                <div className={styles.statBoxValue}>{selectedRobot.totalTrades}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxTitle}>Başarı Oranı</div>
                <div className={styles.statBoxValue}>{selectedRobot.winRate}</div>
              </div>
            </div>

            {/* Açıklama */}
            <div className={styles.modalBody}>
              <p className={styles.modalDesc}>{selectedRobot.description}</p>
            </div>

            {/* Aksiyon */}
            <div className={styles.bottomAction}>
              {ownedIds.has(selectedRobot.id) ? (
                <button
                  className={styles.activateButton}
                  onClick={() => handleRemove(selectedRobot.id as RobotId)}
                  disabled={loadingId === selectedRobot.id && isPending}
                  style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  {loadingId === selectedRobot.id && isPending ? "Kaldırılıyor..." : "Robotu Kaldır"}
                </button>
              ) : (
                <button
                  className={styles.activateButton}
                  onClick={() => handleAdd(selectedRobot.id as RobotId)}
                  disabled={loadingId === selectedRobot.id && isPending}
                  style={{ background: selectedRobot.color, color: "#022c22", border: "none" }}
                >
                  {loadingId === selectedRobot.id && isPending ? "Ekleniyor..." : "Robotu Ekle"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
