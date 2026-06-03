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
            style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Activity size={20} color="#64748b" />
            {t("dashboard.servers.myServersTitle")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {myServers.map((srv) => {
              const isOnline = srv.status === "online";
              return (
                <div 
                  key={srv.id} 
                  className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950/70 p-6 lg:p-7 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-emerald-500/10 hover:shadow-emerald-500/2 grid grid-cols-1 lg:grid-cols-12 items-center gap-6"
                >
                  {/* Column 1: Server Icon & Name */}
                  <div className="lg:col-span-4 flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]'}`}>
                      <Server size={22} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                        {t("dashboard.servers.serverLabel")}
                      </span>
                      <span className="text-base font-bold text-white tracking-wide font-mono">
                        {srv.name}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Connected Robot & Broker Account Details */}
                  <div className="lg:col-span-5 flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                      {t("dashboard.servers.connectedRobotAndAccount")}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap min-h-[32px]">
                      <span className="text-sm font-semibold text-white">
                        {srv.robotDisplayName || srv.latency}
                      </span>
                      
                      <span className="text-slate-700 text-xs font-bold">•</span>

                      <span className="text-sm font-medium text-slate-400">
                        {srv.brokerName ? `${srv.brokerName} · ${srv.accountNo}` : t("dashboard.servers.noConnectedAccount")}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Server Status */}
                  <div className="lg:col-span-3 flex flex-col items-start lg:items-end gap-1.5 lg:justify-self-end w-full lg:w-auto">
                    <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                      {t("dashboard.servers.status")}
                    </span>
                    <div className="flex items-center gap-2 min-h-[32px]">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        {isOnline ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </>
                        ) : (
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                        )}
                      </span>
                      <span className={`text-sm font-bold tracking-wide ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isOnline ? t("dashboard.servers.online") : t("dashboard.servers.offline")}
                      </span>
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
