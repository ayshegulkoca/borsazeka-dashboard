"use client";

import { useState } from "react";
import { Search, BrainCircuit, X, Shield, Activity, SearchIcon, Heart } from "lucide-react";
import styles from "./page.module.css";
import RobotCard from "../../../components/RobotCard";

const MOCK_ROBOTS = [
  {
    id: "darkroom",
    name: "DarkRoom",
    rating: 4.9,
    followers: "1.2k",
    monthlyReturn: "+%18.4",
    description: "Volatilite dostu, trend avcısı.",
    tags: ["AI Tabanlı", "Orta Risk", "Momentum"],
    iconType: "shield" as const
  },
  {
    id: "trademate",
    name: "TradeMate",
    rating: 4.5,
    followers: "540",
    monthlyReturn: "+%24.7",
    description: "Gece alır, sabah satar.",
    tags: ["Kısa Vade", "Yüksek Risk", "Day Trading"],
    iconType: "zap" as const
  }
];

export default function RobotsPage() {
  const [activeTab, setActiveTab] = useState("bist");
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Find selected robot data
  const robotData = MOCK_ROBOTS.find(r => r.id === selectedRobot);

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'bist' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('bist')}
        >
          BIST Robotları
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'crypto' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('crypto')}
        >
          Kripto Robotları
        </button>
      </div>

      {/* Featured Header Card */}
      <div className={styles.featuredCard}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          Trend Olan
        </div>
        <h2 className={styles.featuredTitle}>Yapay Zeka ile Kazancını Katla</h2>
        <p className={styles.featuredSubtitle}>Son 30 günde en çok kazandıran robotları şimdi keşfet.</p>
        <div className={styles.featuredIcon}>
          <BrainCircuit size={150} color="var(--accent-primary)" />
        </div>
      </div>

      {/* Robot List */}
      <div className={styles.robotGrid}>
        {MOCK_ROBOTS.map(robot => (
          <RobotCard 
            key={robot.id}
            {...robot}
            onDetailClick={setSelectedRobot}
          />
        ))}
      </div>

      {/* Robot Detail Modal */}
      {selectedRobot && robotData && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setSelectedRobot(null)}>
              <X size={20} />
            </button>
            
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>
                <Shield size={28} />
              </div>
              <div className={styles.modalHeaderInfo}>
                <h2>{robotData.name}</h2>
                <p>BIST 100 • Orta Risk</p>
              </div>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <div className={styles.statBoxTitle}>Toplam Kar</div>
                <div className={`${styles.statBoxValue} ${styles.statGreen}`}>+%124</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxTitle}>İşlem Sayısı</div>
                <div className={styles.statBoxValue}>482</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBoxTitle}>Başarı</div>
                <div className={styles.statBoxValue}>%68</div>
              </div>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalDesc}>
                {robotData.name}, BorsaZeka'nın en popüler ve güvenilir robotlarından biridir. Klasik teknik analiz yöntemlerini tamamen geride bırakan bu algoritma, günlük açılış gap'lerinden kazanç elde etmeyi hedefleyen bir sistemdir.
              </p>

              <h3 className={styles.sectionTitle}>
                <span>🧠</span> Stratejinin Temeli
              </h3>
              <p className={styles.sectionText}>
                {robotData.name}, herhangi bir RSI, MACD veya Bollinger Bands gibi göstergeleri kesinlikle kullanmaz. Bunun yerine, geçmiş binlerce işlem gününe ait veri setlerini analiz ederek yarın yüksek ihtimalle yukarı yönlü açılış yapacak hisseleri belirleyen özel bir istatistiksel model motoru ile çalışır.
              </p>

              <h3 className={styles.sectionTitle}>
                <SearchIcon size={20} color="var(--accent-primary)" /> Çalışma Mantığı
              </h3>
              <p className={styles.sectionText}>
                İşlem Zamanı: Robot yalnızca günün sonunda (akşam) pozisyon alır.
              </p>
            </div>

            <div className={styles.bottomAction}>
              <button 
                className={styles.activateButton}
                onClick={() => setIsActive(!isActive)}
                style={{ 
                  background: isActive ? 'var(--bg-card)' : 'var(--accent-primary)',
                  color: isActive ? 'var(--text-primary)' : 'var(--bg-dark)',
                  border: isActive ? '1px solid var(--border-subtle)' : 'none'
                }}
              >
                {isActive ? 'Robotu Durdur' : 'Robotu Aktif Et'}
              </button>
              <button className={styles.favButton}>
                <Heart size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
