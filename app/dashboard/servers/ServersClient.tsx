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
            {myServers.map((srv) => (
              <div
                key={srv.id}
                className={styles.activeServerCard}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "1.25rem",
                  borderRadius: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                }}
              >
                {/* Column 1: Server Icon & Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: "1 1 0%", minWidth: "220px" }}>
                  <div style={{ padding: "0.75rem", background: "rgba(16,185,129,0.1)", borderRadius: "12px", display: "inline-flex" }}>
                    <Server size={22} color="#64748b" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "1rem" }}>{srv.name}</div>
                  </div>
                </div>

                {/* Column 2: Connected Robot & Broker Account Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: "2 1 0%", minWidth: "260px" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("dashboard.servers.connectedRobotAndAccount")}
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span>{srv.robotDisplayName || srv.latency}</span>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <span style={{ color: srv.brokerName ? "inherit" : "var(--text-muted)", fontWeight: srv.brokerName ? 500 : 400 }}>
                      {srv.brokerName ? `${srv.brokerName}, ${srv.accountNo}` : t("dashboard.servers.noConnectedAccount")}
                    </span>
                  </div>
                </div>

                {/* Column 3: Server Status */}
                <div style={{ textAlign: "right", flex: "0 0 auto", minWidth: "100px" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("dashboard.servers.status")}
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      color: srv.status === "online" ? "#10b981" : "#ef4444",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      marginTop: "0.25rem",
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: srv.status === "online" ? "#10b981" : "#ef4444" }} />
                    {srv.status === "online"
                      ? t("dashboard.servers.online")
                      : t("dashboard.servers.offline")}
                  </div>
                </div>
              </div>
            ))}
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
