import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Server, ArrowRight, Zap, ShieldCheck, Star, Cpu } from "lucide-react";
import { SERVER_PACKAGES } from "@/src/data/products";
import { getPrefilledStripeLink } from "@/lib/stripe";
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

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Sunucular</h1>
        <p className={styles.subtitle}>
          Robotlarınızı çalıştırmak için ihtiyacınıza uygun sunucu paketini seçin.
        </p>
      </div>

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
