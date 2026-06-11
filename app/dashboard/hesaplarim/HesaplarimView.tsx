"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Plus, Wallet, Globe, Shield, TrendingUp, ExternalLink, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./hesaplarim.module.css";
import Link from "next/link";
import AccountList from "../../components/dashboard/AccountList";
import BrokerIntegrationModal from "./BrokerIntegrationModal";

interface BrokerAccount {
  id: string;
  accountType: string;
  institution: string;
  accountNo: string;
  robotName: string;
  isActive: boolean;
  createdAt: Date;
}

interface ActiveRobot {
  subscriptionCode: string;
  robotName: string;
}

interface Props {
  userEmail?: string;
  initialAccounts: BrokerAccount[];
  activeBistRobots: ActiveRobot[];
}

export default function HesaplarimView({ userEmail, initialAccounts, activeBistRobots }: Props) {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [isBistModalOpen, setIsBistModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleBistSuccess = (message: string) => {
    setToast({ message, type: "success" });
    // Trigger Server Components refresh to fetch updated broker accounts
    router.refresh();
  };

  return (
    <div className={styles.container}>
      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              top: "2.5rem",
              right: "2.5rem",
              backgroundColor: "rgba(16, 185, 129, 0.95)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "1rem 1.5rem",
              borderRadius: "14px",
              color: "#ffffff",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(16, 185, 129, 0.2)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontWeight: 500,
            }}
          >
            <CheckCircle2 size={20} style={{ color: "#ffffff" }} />
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255, 255, 255, 0.7)",
                cursor: "pointer",
                padding: "0.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "0.5rem"
              }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Actions Cards */}
      <div className={styles.actionsGrid}>
        {/* Card 1: BIST Broker Integration */}
        <div className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <Wallet size={32} />
          </div>
          <div className={styles.cardContent}>
            <h3>{t("dashboard.accounts.bistCardTitle")}</h3>
            <p>{t("dashboard.accounts.bistCardDesc")}</p>
          </div>
          <button
            className={`${styles.addButton} ${styles.bistButton}`}
            onClick={() => setIsBistModalOpen(true)}
          >
            <Plus size={18} />
            {t("dashboard.accounts.bistBtn")}
          </button>
        </div>

        {/* Card 2: Crypto Exchange Integration */}
        <div className={styles.actionCard}>
          <div className={`${styles.actionIcon} ${styles.cryptoIcon}`}>
            <Globe size={32} />
          </div>
          <div className={styles.cardContent}>
            <h3>{t("dashboard.accounts.cryptoCardTitle")}</h3>
            <p>{t("dashboard.accounts.cryptoCardDesc")}</p>
          </div>
          {/* Note: In the design, this opens the setup wizard or similar, for now it matches original */}
          <button
            className={`${styles.addButton} ${styles.cryptoButton}`}
            style={{ cursor: "not-allowed", opacity: 0.6 }}
            disabled
          >
            <Plus size={18} />
            {t("dashboard.accounts.cryptoBtn")}
          </button>
        </div>

        {/* Card 3: Forex Integration */}
        <div className={styles.actionCard}>
          <div className={`${styles.actionIcon} ${styles.forexIcon}`}>
            <TrendingUp size={32} />
          </div>
          <div className={styles.cardContent}>
            <h3>{t("dashboard.accounts.forexCardTitle")}</h3>
            <p>{t("dashboard.accounts.forexCardDesc")}</p>
          </div>
          <div className={styles.buttonStack} style={{ paddingTop: "0.5rem" }}>
            <Link
              href="/forex"
              className={`${styles.addButton} ${styles.forexPrimaryButton}`}
              style={{ textDecoration: "none" }}
            >
              <ExternalLink size={16} />
              {t("dashboard.accounts.get_info_and_open")}
            </Link>
            <Link href="/dashboard/accounts/add-forex" style={{ textDecoration: "none" }}>
              <button className={`${styles.addButton} ${styles.forexSecondaryButton}`}>
                <Plus size={18} />
                {t("dashboard.accounts.forexAddBtn")}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Security Warning Bar */}
      <div className={styles.securityAlert}>
        <Shield size={20} />
        <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
          {t("dashboard.accounts.securityNote")}
        </span>
      </div>

      {/* Connected Accounts List */}
      <div className={styles.listSection}>
        <div className={styles.listHeader}>
          <h3>{t("dashboard.accounts.listTitle")}</h3>
          <span className={styles.count}>{initialAccounts.length}</span>
        </div>
        <AccountList initialAccounts={initialAccounts} />
      </div>

      {/* Broker Integration Form Modal */}
      <BrokerIntegrationModal
        isOpen={isBistModalOpen}
        onClose={() => setIsBistModalOpen(false)}
        userEmail={userEmail}
        activeBistRobots={activeBistRobots}
        onSuccess={handleBistSuccess}
      />
    </div>
  );
}
