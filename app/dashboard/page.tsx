"use client";

import { useState } from "react";
import { Eye, EyeOff, Bot, ClipboardList, TrendingUp, TrendingDown, ArrowRight, Plus } from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";

export default function DashboardHome() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className={styles.container}>
      <div>
        <p className={styles.welcomeText}>Hoşgeldin,</p>
        <h1 className={styles.title}>Ayşegül Koca</h1>
      </div>

      {/* Main Balance Card */}
      <div className={styles.balanceCard}>
        <div className={styles.balanceHeader}>
          Toplam Tahmini Bakiye
          <button 
            onClick={() => setShowBalance(!showBalance)} 
            className={styles.eyeIcon}
            aria-label="Bakiyeyi Gizle/Göster"
          >
            {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
        <div className={styles.balanceValue}>
          {showBalance ? "₺100.000,00" : "*********"}
        </div>
        
        <div className={styles.pnlPill}>
          <div className={styles.pnlIconWrapper}>
            <TrendingUp size={18} />
          </div>
          <div>
            <span className={styles.pnlLabel}>Günlük Kar/Zarar</span>
            <span className={styles.pnlValue}>+₺1.250 (%0.85)</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.robotIcon}`}>
            <Bot size={20} />
          </div>
          <span className={styles.statValue}>3</span>
          <span className={styles.statLabel}>Aktif Robot</span>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIconWrapper} ${styles.orderIcon}`}>
            <ClipboardList size={20} />
          </div>
          <span className={styles.statValue}>2</span>
          <span className={styles.statLabel}>Bekleyen Emir</span>
        </div>
      </div>

      {/* Market Ticker */}
      <div className={styles.tickerCard}>
        <div className={styles.tickerInfo}>
          <div className={styles.tickerIcon}>
            <TrendingDown size={20} />
          </div>
          <div>
            <div className={styles.tickerName}>BIST 100</div>
            <div className={styles.tickerPrice}>
              8.100 <span className={styles.tickerChange}>-0.4%</span>
            </div>
          </div>
        </div>
        <div className={styles.tickerBadge}>
          KAPALI
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className={styles.actionsHeader}>Hızlı İşlemler</h3>
      <Link href="/dashboard/robots">
        <button className={styles.actionButton}>
          <div className={styles.actionIcon}>
            <Plus size={20} />
            Yeni Robot Bul/Ekle
          </div>
          <ArrowRight size={20} />
        </button>
      </Link>
    </div>
  );
}
