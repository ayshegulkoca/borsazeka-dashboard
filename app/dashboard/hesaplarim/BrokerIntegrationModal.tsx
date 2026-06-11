"use client";

import { useState, useEffect } from "react";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./hesaplarim.module.css";
import Modal from "../../components/ui/Modal";
import { getBrokersAction, setBrokerAccountAction } from "@/app/actions/broker";

interface ActiveRobot {
  subscriptionCode: string;
  robotName: string;
}

interface Broker {
  name: string;
  imkbBackOffice: string;
  viopBackOffice: string;
  loginType: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  activeBistRobots: ActiveRobot[];
  onSuccess: (message: string) => void;
}

export default function BrokerIntegrationModal({
  isOpen,
  onClose,
  activeBistRobots,
  onSuccess,
}: Props) {
  const { t } = useTranslation("common");

  // State fields
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loadingBrokers, setLoadingBrokers] = useState(false);
  const [brokersError, setBrokersError] = useState(false);

  const [brokerName, setBrokerName] = useState("");
  const [subscriptionCode, setSubscriptionCode] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [subAccountNo, setSubAccountNo] = useState("");
  const [viopEnabled, setViopEnabled] = useState(false);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch brokers on open
  useEffect(() => {
    if (isOpen) {
      setLoadingBrokers(true);
      setBrokersError(false);
      getBrokersAction()
        .then((res) => {
          if (res?.success && res.data?.brokers) {
            setBrokers(res.data.brokers);
          } else {
            setBrokersError(true);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch brokers:", err);
          setBrokersError(true);
        })
        .finally(() => {
          setLoadingBrokers(false);
        });

      // Default pre-selection for robot
      if (activeBistRobots.length === 1) {
        setSubscriptionCode(activeBistRobots[0].subscriptionCode);
      } else {
        setSubscriptionCode("");
      }

      // Reset form fields
      setBrokerName("");
      setAccountNo("");
      setSubAccountNo("");
      setViopEnabled(false);
      setValidationErrors({});
      setSubmitError(null);
    }
  }, [isOpen, activeBistRobots]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!brokerName) {
      errors.brokerName = "Lütfen bir aracı kurum seçiniz.";
    }
    if (!subscriptionCode) {
      errors.subscriptionCode = "Lütfen ilişkilendirilecek robotu seçiniz.";
    }
    if (!accountNo.trim()) {
      errors.accountNo = "Hesap numarası zorunludur.";
    } else if (!/^\d+$/.test(accountNo)) {
      errors.accountNo = "Hesap numarası sadece rakamlardan oluşmalıdır.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await setBrokerAccountAction({
        subscriptionCode,
        brokerName,
        accountNo,
        subAccountNo: subAccountNo || undefined,
        viopEnabled,
      });

      if (result?.success && result?.data?.status === "success") {
        onSuccess("Aracı kurum hesabınız başarıyla bağlandı!");
        onClose();
      } else {
        const errMsg = result?.error || "Hesap bağlama işlemi başarısız oldu. Lütfen bilgileri kontrol edip tekrar deneyin.";
        setSubmitError(errMsg);
      }
    } catch (err) {
      console.error("Error linking broker account:", err);
      setSubmitError("Sunucu bağlantısı sırasında bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user has no active robots, they are blocked
  const hasNoRobots = activeBistRobots.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aracı Kurum Bağlantısı"
    >
      {hasNoRobots ? (
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            marginBottom: "1rem"
          }}>
            <AlertCircle size={28} />
          </div>
          <h4 style={{ color: "#ffffff", fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Aktif Robot Aboneliği Bulunamadı
          </h4>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
            Aracı kurum hesabı bağlamak için öncelikle aktif bir Borsa İstanbul (BIST) robot aboneliğinizin bulunması gerekmektedir.
          </p>
          <div className={styles.formActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Kapat
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {submitError && (
            <div style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
              color: "#f87171",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1.25rem"
            }}>
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}

          {/* 1. Robot Selection (Conditional) */}
          {activeBistRobots.length > 1 ? (
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bağlanacak Robot / Abonelik</label>
              <select
                className={`${styles.formSelect} ${validationErrors.subscriptionCode ? styles.inputError : ""}`}
                value={subscriptionCode}
                onChange={(e) => setSubscriptionCode(e.target.value)}
              >
                <option value="">Robot Seçiniz...</option>
                {activeBistRobots.map((robot) => (
                  <option key={robot.subscriptionCode} value={robot.subscriptionCode}>
                    {robot.robotName} ({robot.subscriptionCode})
                  </option>
                ))}
              </select>
              {validationErrors.subscriptionCode && (
                <span className={styles.errorMsg}>{validationErrors.subscriptionCode}</span>
              )}
            </div>
          ) : (
            // Hidden/Read-only value if only 1 robot exists
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bağlanacak Robot / Abonelik</label>
              <input
                type="text"
                className={styles.formInput}
                value={`${activeBistRobots[0].robotName} (${activeBistRobots[0].subscriptionCode})`}
                disabled
                style={{ opacity: 0.7, background: "rgba(255,255,255,0.02)", cursor: "not-allowed" }}
              />
            </div>
          )}

          {/* 2. Broker Choice */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Aracı Kurum</label>
            <select
              className={`${styles.formSelect} ${validationErrors.brokerName ? styles.inputError : ""}`}
              value={brokerName}
              onChange={(e) => setBrokerName(e.target.value)}
              disabled={loadingBrokers || brokersError}
            >
              {loadingBrokers ? (
                <option value="">Aracı kurumlar yükleniyor...</option>
              ) : brokersError ? (
                <option value="">Kurumlar yüklenemedi. Lütfen sayfayı yenileyin.</option>
              ) : (
                <>
                  <option value="">Kurum Seçiniz...</option>
                  {brokers.map((broker) => (
                    <option key={broker.name} value={broker.name}>
                      {broker.name}
                    </option>
                  ))}
                </>
              )}
            </select>
            {validationErrors.brokerName && (
              <span className={styles.errorMsg}>{validationErrors.brokerName}</span>
            )}
          </div>

          {/* 3. Account Number */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Hesap Numarası</label>
            <input
              type="text"
              className={`${styles.formInput} ${validationErrors.accountNo ? styles.inputError : ""}`}
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              placeholder="Örn: 12345"
            />
            {validationErrors.accountNo && (
              <span className={styles.errorMsg}>{validationErrors.accountNo}</span>
            )}
          </div>

          {/* 4. Sub Account Number (Optional) */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Alt Hesap Numarası (İsteğe bağlı)</label>
            <input
              type="text"
              className={styles.formInput}
              value={subAccountNo}
              onChange={(e) => setSubAccountNo(e.target.value)}
              placeholder="Örn: 01"
            />
          </div>

          {/* 5. VIOP transactions enabled (Optional Checkbox) */}
          <div className={styles.checkboxContainer} onClick={() => setViopEnabled(!viopEnabled)}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={viopEnabled}
              onChange={() => {}} // Controlled via container click
            />
            <span className={styles.checkboxLabel}>VIOP İşlemleri Açık mı?</span>
          </div>

          {/* 6. Security bar at the bottom of the form */}
          <div className={styles.warningBanner}>
            <Shield size={18} style={{ flexShrink: 0 }} />
            <span className={styles.warningText}>
              Hassas verileriniz (API Key, Şifre, TC No) tarayıcı tarafında AES-256 ile şifrelenir ve asla ham metin olarak iletilmez.
            </span>
          </div>

          {/* Action buttons */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={isSubmitting || loadingBrokers || brokersError}
            >
              {isSubmitting && <Loader2 size={16} className={styles.spinner} />}
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
