import { TrendingUp, Shield, Zap, BarChart2, Clock, Brain } from "lucide-react";
import styles from "./landing.module.css";

const features = [
  {
    icon: Brain,
    title: "Yapay Zeka Destekli Analiz",
    desc: "GPT-4o tabanlı motorumuz haber akışlarını ve teknik verileri gerçek zamanlı olarak yorumlar; size en doğru giriş-çıkış sinyallerini sunar.",
  },
  {
    icon: TrendingUp,
    title: "Otomatik Pozisyon Yönetimi",
    desc: "Stop-loss, take-profit ve trailing stop kurallarını robotlarınıza tanımlayın; portföyünüz 7/24 korunsun.",
  },
  {
    icon: Shield,
    title: "Risk Yönetimi Katmanı",
    desc: "Hesap bakiyenizin maksimum %5'ini riske atmayı garanti eden dahili risk filtresi ile sermayenizi güvende tutun.",
  },
  {
    icon: Zap,
    title: "Milisaniye Hızında Emir",
    desc: "Borsa altyapımız emirleri doğrudan API üzerinden anında iletir. Gecikme sıfır, fırsat kayıpları sıfır.",
  },
  {
    icon: BarChart2,
    title: "Detaylı Performans Raporları",
    desc: "Her robotun günlük, haftalık ve aylık performansını interaktif grafiklerle inceleyin; strateji kararlarınızı veriye dayandırın.",
  },
  {
    icon: Clock,
    title: "7/24 İzleme & Bildirim",
    desc: "Uyku saatlerinizde bile robotlarınız çalışır. Kritik eşikler aşıldığında anında SMS, e-posta veya push bildirimi alırsınız.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className={`${styles.section} ${styles.featuresSection}`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Neden BorsaZeka?</span>
          <h2 className={styles.sectionTitle}>Kazanmanızı Sağlayan Teknoloji</h2>
          <p className={styles.sectionSubtitle}>
            Her bir özelliğimiz, kurumsal yatırımcıların kullandığı araçları bireysel yatırımcılar için erişilebilir kılmak amacıyla tasarlandı.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIconWrap}>
                  <Icon size={22} color="var(--accent-primary)" />
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
