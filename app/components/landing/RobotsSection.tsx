import { Bot, TrendingUp, BarChart2, Cpu } from "lucide-react";
import styles from "./landing.module.css";

const robots = [
  {
    icon: TrendingUp,
    name: "Trend Takipçi",
    desc: "Uzun vadeli momentum stratejisi",
    badge: "Aktif",
    coming: false,
  },
  {
    icon: BarChart2,
    name: "Scalper Pro",
    desc: "Kısa vadeli fiyat hareketleri",
    badge: "Aktif",
    coming: false,
  },
  {
    icon: Bot,
    name: "Arbitraj Botu",
    desc: "Borsa fiyat farkı stratejisi",
    badge: "Yakında",
    coming: true,
  },
  {
    icon: Cpu,
    name: "Haberdar",
    desc: "Haber akışı tabanlı işlem",
    badge: "Yakında",
    coming: true,
  },
];

export default function RobotsSection() {
  return (
    <section id="robots" className={`${styles.section} ${styles.robotsSection}`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Robot Vitrini</span>
          <h2 className={styles.sectionTitle}>Sizin İçin Çalışan Robotlar</h2>
          <p className={styles.sectionSubtitle}>
            Her biri farklı piyasa koşullarına göre optimize edilmiş, kanıtlanmış stratejileri otomatik olarak uygulayan yapay zeka robotları.
          </p>
        </div>

        <div className={styles.robotGrid}>
          {robots.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.name}
                className={`${styles.robotCard} ${r.coming ? styles.robotComingSoon : ""}`}
              >
                <div className={styles.robotIconWrap}>
                  <Icon
                    size={26}
                    color={r.coming ? "var(--text-muted)" : "var(--accent-primary)"}
                  />
                </div>
                <div className={styles.robotName}>{r.name}</div>
                <div className={styles.robotDesc}>{r.desc}</div>
                <span className={styles.robotBadge}>{r.badge}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
