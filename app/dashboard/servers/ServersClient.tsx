"use client";

import { useTranslation } from "react-i18next";
import { Server, ArrowRight, Zap, ShieldCheck, Star, Cpu, Activity, Settings, AlertCircle } from "lucide-react";
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
                <div 
                  key={srv.id} 
                  className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950/70 p-6 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-emerald-500/20 hover:shadow-emerald-500/5 hover:-translate-y-0.5 grid grid-cols-1 lg:grid-cols-12 items-center gap-6"
                >
                  {/* Column 1: Server Icon & Name Tag */}
                  <div className="lg:col-span-4 flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${isOnline ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]'}`}>
                      <Server size={22} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        {t("dashboard.servers.serverLabel")}
                      </span>
                      <span className="text-base font-bold text-white tracking-wide font-mono">
                        {srv.name}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Connected Robot & Broker Account Details */}
                  <div className="lg:col-span-5 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      {t("dashboard.servers.connectedRobotAndAccount")}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Robot Name Badge */}
                      <span className="inline-flex items-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
                        {srv.robotDisplayName || srv.latency}
                      </span>
                      
                      <span className="text-slate-700 text-xs font-bold">•</span>

                      {/* Account Info Badge */}
                      {srv.brokerName ? (
                        <span className="inline-flex items-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-300/90">
                          {srv.brokerName} · {srv.accountNo}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-medium text-amber-400/80">
                          <AlertCircle size={13} className="text-amber-400/80 shrink-0" />
                          {t("dashboard.servers.noConnectedAccount")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Server Status & Settings */}
                  <div className="lg:col-span-3 flex items-center gap-4 lg:justify-self-end justify-between w-full lg:w-auto">
                    {/* Status Column */}
                    <div className="flex flex-col items-start lg:items-end gap-1.5">
                      <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        {t("dashboard.servers.status")}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${isOnline ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/20 bg-rose-500/10 text-rose-400'}`}>
                        <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-rose-400'}`} />
                        {isOnline ? t("dashboard.servers.online") : t("dashboard.servers.offline")}
                      </span>
                    </div>

                    {/* Settings Button */}
                    <button 
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-slate-400 transition-all duration-300 hover:border-white/15 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer"
                      title={t("navbar.setup") || "Sunucu Ayarları"}
                    >
                      <Settings size={18} />
                    </button>
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
