import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Server, Activity, ArrowRight, ServerCog, Zap, ShieldCheck, Star, Cpu } from "lucide-react";
import Link from "next/link";
import { SERVER_PACKAGES } from "@/src/data/products";
import { getPrefilledStripeLink } from "@/lib/stripe";
import styles from "./page.module.css";

// Icon mapping for server packages
const PACKAGE_ICONS = {
  power:        Zap,
  professional: Server,
  expert:       Cpu,
  elite:        ShieldCheck,
  ultimate:     Star,
} as const;

// Accent colors per tier
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

  // Kullanıcının sunucularını DB'den çek
  const userServers = await prisma.server.findMany({
    where: { 
      userId: session.user.id,
      isActive: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const hasServers = userServers.length > 0;

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Sunucu Durumu</h1>
        <p className={styles.subtitle}>İşlem ve analiz sunucularınızın durumunu anlık olarak takip edin.</p>
      </div>

      {!hasServers ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ServerCog size={48} />
          </div>
          <h2 className={styles.emptyTitle}>Aktif çalışan sunucunuz bulunmamaktadır</h2>
          <p className={styles.emptyDesc}>
            Bir robot kurulumu tamamladığınızda, o robotun bağlı olduğu teknik sunucu bilgileri otomatik olarak burada görünecektir.
          </p>
          <Link href="/dashboard" className={styles.emptyCta}>
            Kuruluma Git <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className={styles.serverList}>
          {userServers.map(server => (
            <div key={server.id} className={styles.serverCard}>
              <div className={styles.serverInfo}>
                <div className={styles.serverIcon}>
                  <Server size={24} />
                </div>
                <div className={styles.serverDetails}>
                  <span className={styles.serverName}>{server.name}</span>
                  <span className={styles.serverIp}>IP: {server.ip}</span>
                </div>
              </div>

              <div className={styles.serverStatus}>
                <div className={`${styles.statusBadge} ${server.status === 'online' ? styles.statusOnline : styles.statusOffline}`}>
                  <span className={styles.statusDot}></span>
                  {server.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                </div>
                {server.status === 'online' && (
                  <div className={styles.loadMetric}>
                    <Activity size={12} /> Yük: {server.load} | Gecikme: {server.latency}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Sunucu Paketi Seç ─────────────────────────────────────────────────── */}
      <div className={styles.packagesSection}>
        <div className={styles.packagesSectionHeader}>
          <h2 className={styles.packagesSectionTitle}>Sunucu Paketi Seç</h2>
          <p className={styles.packagesSectionDesc}>
            Robotlarınızı çalıştırmak için ihtiyacınıza uygun sunucu paketini seçin.
            Tüm paketler yüksek erişilebilirlik ve 7/24 izleme ile gelir.
          </p>
        </div>

        <div className={styles.packagesGrid}>
          {SERVER_PACKAGES.map((pkg) => {
            const Icon = PACKAGE_ICONS[pkg.id as keyof typeof PACKAGE_ICONS] ?? Server;
            const color = PACKAGE_COLORS[pkg.id] ?? "#10b981";
            const stripeUrl = getPrefilledStripeLink(pkg.stripeBaseUrl, userEmail);

            return (
              <div
                key={pkg.id}
                className={`${styles.packageCard} ${pkg.highlight ? styles.packageCardHighlight : ""}`}
                style={{
                  borderColor: pkg.highlight ? color + "66" : undefined,
                  background: pkg.highlight
                    ? `linear-gradient(135deg, var(--bg-card) 0%, ${color}0d 100%)`
                    : undefined,
                }}
              >
                {pkg.highlight && (
                  <div className={styles.packageBadge} style={{ color, background: color + "1a", border: `1px solid ${color}33` }}>
                    <Star size={11} /> Önerilen
                  </div>
                )}

                {/* Icon + Fiyat */}
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

                {/* Paket adı */}
                <h3 className={styles.packageName}>{pkg.name}</h3>

                {/* Tek satır genel açıklama (teknik detaylar Semih Bey onayına kadar) */}
                <p className={styles.packageDesc}>{pkg.description}</p>

                {/* Satın Al → Stripe */}
                <a
                  href={stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.packageCta}
                  style={{
                    background: pkg.highlight ? color : "transparent",
                    color: pkg.highlight ? "#022c22" : color,
                    border: `1.5px solid ${color}`,
                  }}
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
    </div>
  );
}
