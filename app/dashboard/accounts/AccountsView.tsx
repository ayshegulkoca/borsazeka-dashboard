"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Wallet, Globe, Shield, TrendingUp, ExternalLink } from "lucide-react";
import styles from "./accounts.module.css";
import Modal from "../../components/ui/Modal";
import AccountIntegrationForm from "../../components/dashboard/AccountIntegrationForm";
import AccountList from "../../components/dashboard/AccountList";

interface BrokerAccount {
  id: string;
  accountType: string;
  institution: string;
  accountNo: string;
  robotName: string;
  isActive: boolean;
  createdAt: Date;
}

interface Props {
  userEmail?: string;
  initialAccounts: BrokerAccount[];
  ownedRobotIds: string[];  // e.g. ["darkroom", "highway", "kripttozeka_self"]
}

export default function AccountsView({ userEmail, initialAccounts, ownedRobotIds }: Props) {
  const { t } = useTranslation("common");
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
          <h1 className={styles.title}>{t("dashboard.accounts.title")}</h1>
          <p className={styles.subtitle}>
            {t("dashboard.accounts.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Actions */}
      <div className={styles.actionsGrid}>
        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <Wallet size={32} />
          </div>
          <div className={styles.cardContent}>
            <h3>{t("dashboard.accounts.bistCardTitle")}</h3>
            <p>
              {t("dashboard.accounts.bistCardDesc")}
            </p>
          </div>
          <button 
            className={styles.addButton}
            onClick={() => openAddModal("BIST")}
          >
            <Plus size={18} />
            {t("dashboard.accounts.bistBtn")}
          </button>
        </div>

        <div className={styles.actionCard}>
          <div className={`${styles.actionIcon} ${styles.cryptoIcon}`}>
            <Globe size={32} />
          </div>
          <div className={styles.cardContent}>
            <h3>{t("dashboard.accounts.cryptoCardTitle")}</h3>
            <p>
              {t("dashboard.accounts.cryptoCardDesc")}
            </p>
          </div>
          <button 
            className={`${styles.addButton} ${styles.cryptoButton}`}
            onClick={() => openAddModal("BINANCE")}
          >
            <Plus size={18} />
            {t("dashboard.accounts.cryptoBtn")}
          </button>
        </div>

        <div className={styles.actionCard}>
          <div className={`${styles.actionIcon} ${styles.forexIcon}`}>
            <TrendingUp size={32} />
          </div>
          <div className={styles.cardContent}>
            <h3>{t("dashboard.accounts.forexCardTitle")}</h3>
            <p>
              {t("dashboard.accounts.forexCardDesc")}
            </p>
          </div>
          <div className={styles.buttonStack} style={{ paddingTop: "0.5rem" }}>
            <a
              href="https://t.co/kUUMsLhRJZ?amp=1"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.addButton} ${styles.forexPrimaryButton}`}
              style={{ textDecoration: "none" }}
            >
              <ExternalLink size={16} />
              {t("dashboard.accounts.forexOpenBtn")}
            </a>
            <button 
              className={`${styles.addButton} ${styles.forexSecondaryButton}`}
              disabled
            >
              <Plus size={18} />
              {t("dashboard.accounts.forexAddBtn")}
            </button>
          </div>
        </div>
      </div>

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
          {t("dashboard.accounts.securityNote")}
        </span>
      </div>

      {/* Accounts List */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <h3>{t("dashboard.accounts.listTitle")}</h3>
          <span className={styles.count}>{initialAccounts.length}</span>
        </div>
        <AccountList initialAccounts={initialAccounts} />
      </div>

      {/* Integration Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={selectedMarket === "BIST" ? t("dashboard.accounts.modalBistTitle") : t("dashboard.accounts.modalCryptoTitle")}
      >
        <AccountIntegrationForm 
          initialEmail={userEmail}
          initialMarket={selectedMarket || undefined}
          ownedRobotIds={ownedRobotIds}
          onSuccess={() => {
            // Local state update or fetch could be handled if needed, 
            // but revalidatePath handling redirect back or refresh is usually enough in Next.js
          }}
        />
      </Modal>
    </div>
  );
}
