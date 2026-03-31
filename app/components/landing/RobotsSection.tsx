import { Bot, TrendingUp, BarChart2 } from "lucide-react";
import styles from "./landing.module.css";

const robots = [
  {
    icon: TrendingUp,
    name: "DarkRoom Self-Service",
    desc: "Düşük volatilite ortamlarında sessiz ama güçlü momentum stratejisi",
    badge: "Aktif",
    coming: false,
  },
  {
    icon: BarChart2,
    name: "Highway Self-Service",
    desc: "Yüksek hacimli piyasalarda trend yakalamayla hızlı pozisyon yönetimi",
    badge: "Aktif",
    coming: false,
  },
  {
    icon: Bot,
    name: "TradeMate Self-Service",
    desc: "Kullanıcı dostu arayüz ile kendi stratejinizi uygulayan esnek robot",
    badge: "Aktif",
    coming: false,
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

        <div className={styles.robotGrid} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {robots.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.name}
                className={styles.robotCard}
              >
                <div className={styles.robotIconWrap}>
                  <Icon size={26} color="var(--accent-primary)" />
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
