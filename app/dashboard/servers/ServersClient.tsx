"use client";

import { useTranslation } from "react-i18next";
import { Server, ArrowRight, Zap, ShieldCheck, Star, Cpu, Activity } from "lucide-react";
import styles from "./page.module.css";

const PACKAGE_ICONS = {
  power:        Zap,
  professional: Server,
  expert:       Cpu,
  elite:        ShieldCheck,
  ultimate:     Star,
} as const;

const PACKAGE_COLORS: Record<string, string> = {
  power:        "#94a3b8", /* Slate-400 */
  professional: "#64748b", /* Slate-500 */
  expert:       "#1d314a", /* Deep Space Blue */
  elite:        "#334155", /* Slate-700 */
  ultimate:     "#475569", /* Slate-600 */
};

interface ServerPackage {
  id: string;
  name: string;
  description: string;
  priceEUR: number;
  stripeBaseUrl: string;
  stripeUrl: string; // pre-built URL with email
}

interface ActiveServer {
  id: string;
  name: string;
  ip: string;
  latency: string;
  status: string;
  load: string;
  robotDisplayName?: string;
  brokerName?: string;
  accountNo?: string;
}

interface Props {
  myServers: ActiveServer[];
  packages: ServerPackage[];
}

export default function ServersClient({ myServers, packages }: Props) {
  const { t } = useTranslation("common");

  return (
    <div className={styles.container}>

      {/* Aktif Sunucularım */}
      {myServers.length > 0 && (
        <div style={{ marginBottom: "3rem" }}>
          <h2
            className={styles.sectionTitle}
            style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Activity size={20} color="#64748b" />
            {t("dashboard.servers.myServersTitle")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {myServers.map((srv) => {
              const isOnline = srv.status === "online";
              return (
                <div key={srv.id} className={styles.activeServerCard}>
                  {/* Column 1: Server Icon & Name Tag */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: "1 1 0%", minWidth: "300px" }}>
                    <div className={`${styles.serverIconContainer} ${isOnline ? styles.serverIconOnline : styles.serverIconOffline}`}>
                      <Server size={20} color={isOnline ? "#10b981" : "#ef4444"} />
                    </div>
                    <div className={styles.serverNameTag}>
                      {srv.name}
                    </div>
                  </div>

                  {/* Column 2: Connected Robot & Broker Account Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: "2 1 0%", minWidth: "280px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                      {t("dashboard.servers.connectedRobotAndAccount")}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      {/* Robot Name Badge */}
                      <span style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#ffffff",
                        background: "rgba(255,255,255,0.06)",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.08)"
                      }}>
                        {srv.robotDisplayName || srv.latency}
                      </span>
                      
                      <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.85rem" }}>•</span>

                      {/* Account Info Badge */}
                      <span style={{
                        fontSize: "0.85rem",
                        fontWeight: srv.brokerName ? 600 : 400,
                        color: srv.brokerName ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.35)",
                        background: srv.brokerName ? "rgba(16, 185, 129, 0.05)" : "transparent",
                        border: srv.brokerName ? "1px solid rgba(16, 185, 129, 0.15)" : "none",
                        padding: srv.brokerName ? "0.2rem 0.6rem" : "0",
                        borderRadius: srv.brokerName ? "6px" : "0"
                      }}>
                        {srv.brokerName ? `${srv.brokerName} · ${srv.accountNo}` : t("dashboard.servers.noConnectedAccount")}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Server Status */}
                  <div style={{ textAlign: "right", flex: "0 0 auto", minWidth: "120px" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, marginBottom: "0.35rem" }}>
                      {t("dashboard.servers.status")}
                    </div>
                    <div className={`${styles.statusBadgeContainer} ${isOnline ? styles.statusBadgeOnline : styles.statusBadgeOffline}`}>
                      <div className={`${styles.pulsingDot} ${isOnline ? styles.pulsingDotOnline : styles.pulsingDotOffline}`} />
                      {isOnline
                        ? t("dashboard.servers.online")
                        : t("dashboard.servers.offline")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h2
        className={styles.sectionTitle}
        style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1.25rem" }}
      >
        {t("dashboard.servers.packagesTitle")}
      </h2>

      <div className={styles.packagesGrid}>
        {packages.map((pkg) => {
          const Icon = PACKAGE_ICONS[pkg.id as keyof typeof PACKAGE_ICONS] ?? Server;
          const color = PACKAGE_COLORS[pkg.id] ?? "#10b981";

          return (
            <div key={pkg.id} className={styles.packageCard}>
              <div className={styles.packageTop}>
                <div
                  className={styles.packageIcon}
                  style={{ background: color + "18", border: `1px solid ${color}30` }}
                >
                  <Icon size={22} color={color} />
                </div>
                <div className={styles.packagePriceWrap}>
                  <span className={styles.packagePrice} style={{ color }}>€{pkg.priceEUR}</span>
                  <span className={styles.packagePricePer}>{t("dashboard.servers.perMonth")}</span>
                </div>
              </div>

              <h3 className={styles.packageName}>
                {t(`dashboard.servers.packageNames.${pkg.id}`)}
              </h3>
              <p className={styles.packageDesc}>
                {t(`dashboard.servers.packageDescriptions.${pkg.id}`)}
              </p>

              <a
                href={pkg.stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.packageCta}
                style={{ background: "transparent", color, border: `1.5px solid ${color}` }}
                id={`server-pkg-${pkg.id}-btn`}
              >
                {t("dashboard.servers.buyBtn")} <ArrowRight size={15} />
              </a>
            </div>
          );
        })}
      </div>

      <p className={styles.packagesNote}>
        {t("dashboard.servers.packagesNote")}
      </p>
    </div>
  );
}
