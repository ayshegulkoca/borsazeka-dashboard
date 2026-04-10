"use client";

import { useState } from "react";
import { Plus, Wallet, Globe, Shield } from "lucide-react";
import styles from "./accounts.module.css";
import Modal from "../../components/ui/Modal";
import AccountIntegrationForm from "../../components/dashboard/AccountIntegrationForm";
import AccountList from "../../components/dashboard/AccountList";

export default function AccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<"BIST" | "BINANCE" | null>(null);

  const openAddModal = (market: "BIST" | "BINANCE") => {
    setSelectedMarket(market);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMarket(null);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Hesaplarım</h1>
          <p className={styles.subtitle}>
            Borsa ve kripto hesaplarınızı güvenle yönetin ve robotlarınızı saniyeler içinde yetkilendirin.
          </p>
        </div>
      </div>

      {/* Main Actions */}
      <div className={styles.actionsGrid}>
        {/* BIST Card */}
        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <Wallet size={32} />
          </div>
          <div className={styles.cardContent}>
            <h3>Aracı Kurum Ekle</h3>
            <p>
              Borsa İstanbul (BIST) işlemleriniz için PhillipCapital, İnfo Yatırım gibi kurumlardaki hesaplarınızı bağlayın.
            </p>
          </div>
          <button 
            className={styles.addButton}
            onClick={() => openAddModal("BIST")}
          >
            <Plus size={18} />
            Kurum Bağla
          </button>
        </div>

        {/* Crypto Card */}
        <div className={styles.actionCard}>
          <div className={`${styles.actionIcon} ${styles.cryptoIcon}`}>
            <Globe size={32} />
          </div>
          <div className={styles.cardContent}>
            <h3>Kripto Hesap Ekle</h3>
            <p>
              Binance ve diğer kripto para borsalarındaki hesaplarınızı API anahtarları ile güvenle entegre edin.
            </p>
          </div>
          <button 
            className={`${styles.addButton} ${styles.cryptoButton}`}
            onClick={() => openAddModal("BINANCE")}
          >
            <Plus size={18} />
            Borsa Bağla
          </button>
        </div>
      </div>

      {/* Security Banner */}
      <div style={{
        background: "rgba(16, 185, 129, 0.05)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: "var(--radius-md)",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        color: "#10b981"
      }}>
        <Shield size={20} />
        <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
          Hassas verileriniz (API Key, Şifre, TC No) tarayıcı tarafında <strong>AES-256</strong> ile şifrelenir ve asla ham metin olarak iletilmez.
        </span>
      </div>

      {/* Accounts List */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <h3>Bağlı Hesaplar</h3>
          <span className={styles.count}>2</span>
        </div>
        <AccountList />
      </div>

      {/* Integration Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={selectedMarket === "BIST" ? "Aracı Kurum Entegrasyonu" : "Kripto Borsa Entegrasyonu"}
      >
        <AccountIntegrationForm 
          initialMarket={selectedMarket || undefined}
          onSuccess={() => {
            // Success logic if needed (e.g., refresh list)
          }}
        />
      </Modal>
    </div>
  );
}
