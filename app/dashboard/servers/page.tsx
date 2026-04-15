import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Server, ArrowRight, Zap, ShieldCheck, Star, Cpu, Activity } from "lucide-react";
import { SERVER_PACKAGES } from "@/src/data/products";
import { getPrefilledStripeLink } from "@/lib/stripe";
import { apiGet } from "@/lib/api";
import styles from "./page.module.css";

const PACKAGE_ICONS = {
  power:        Zap,
  professional: Server,
  expert:       Cpu,
  elite:        ShieldCheck,
  ultimate:     Star,
} as const;

const PACKAGE_COLORS: Record<string, string> = {
  power:        "#10b981",
  professional: "#3b82f6",
  expert:       "#f59e0b",
  elite:        "#8b5cf6",
  ultimate:     "#ec4899",
};

export default async function ServersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userEmail = session.user.email ?? "";

  // Aktif sunucuları API'den çek (Prisma yerine)
  const apiServers = await apiGet<any[]>("/user/servers");
  const myServers = apiServers ?? [];

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Sunucular</h1>
        <p className={styles.subtitle}>
          Robotlarınızı çalıştırmak için ihtiyacınıza uygun sunucu paketini seçin veya aktif sunucularınızı yönetin.
        </p>
      </div>

      {/* Aktif Sunucularım Bölümü */}
      {myServers.length > 0 && (
        <div style={{ marginBottom: "3rem" }}>
          <h2 className={styles.sectionTitle} style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={20} color="var(--accent-primary)" />
            Aktif Sunucularım
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {myServers.map((srv: any) => (
              <div key={srv.id} className={styles.activeServerCard} style={{ 
                background: "rgba(255,255,255,0.03)", 
                border: "1px solid rgba(255,255,255,0.08)", 
                padding: "1.25rem", 
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ padding: "0.75rem", background: "rgba(16,185,129,0.1)", borderRadius: "12px" }}>
                    <Server size={22} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "1rem" }}>{srv.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>IP: {srv.ip} • Gecikme: {srv.latency}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                   <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Durum</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: srv.status === "online" ? "#10b981" : "#ef4444", fontSize: "0.9rem", fontWeight: 600 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: srv.status === "online" ? "#10b981" : "#ef4444" }} />
                        {srv.status === "online" ? "Çevrimiçi" : "Çevrimdışı"}
                      </div>
                   </div>
                   <div style={{ textAlign: "right", minWidth: "80px" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Yük</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{srv.load}</div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className={styles.sectionTitle} style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "1.25rem" }}>
        Sunucu Paketleri
      </h2>

      <div className={styles.packagesGrid}>
        {SERVER_PACKAGES.map((pkg) => {
          const Icon = PACKAGE_ICONS[pkg.id as keyof typeof PACKAGE_ICONS] ?? Server;
          const color = PACKAGE_COLORS[pkg.id] ?? "#10b981";
          const stripeUrl = getPrefilledStripeLink(pkg.stripeBaseUrl, userEmail);

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
                  <span className={styles.packagePricePer}>/ay</span>
                </div>
              </div>

              <h3 className={styles.packageName}>{pkg.name}</h3>

              <p className={styles.packageDesc}>{pkg.description}</p>

              <a
                href={stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.packageCta}
                style={{ background: "transparent", color, border: `1.5px solid ${color}` }}
                id={`server-pkg-${pkg.id}-btn`}
              >
                Satın Al <ArrowRight size={15} />
              </a>
            </div>
          );
        })}
      </div>

      <p className={styles.packagesNote}>
        Sunucu paketleri aylık fatura edilir. İptal için en az 3 gün öncesinden bildirim yapılmalıdır.
        Tüm ücretler Euro (€) cinsindendir.
      </p>
    </div>
  );
}
