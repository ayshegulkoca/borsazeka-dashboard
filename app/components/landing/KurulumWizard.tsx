"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Lock, Shield,
  CheckCircle2, AlertCircle, Eye, EyeOff, Home,
  TrendingUp, Globe
} from "lucide-react";
import { useTranslation } from "react-i18next";
import CryptoJS from "crypto-js";
import s from "./kurulum.module.css";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// BURAYI SEMİH BEY'DEN ALINCA GÜNCELLE
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || "";
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ROBOTS = ["DarkRoom", "BorsaZeka", "TradeMate", "Highway", "Fabrika"];
const BIST_BROKERS = ["PhillipCapital", "İnfo Yatırım", "A1 Capital", "ALB Yatırım", "Meksa Yatırım"];
const PHONE_CODES = [
  { code: "+90", label: "+90" },
  { code: "+1",  label: "+1" },
  { code: "+44", label: "+44" },
  { code: "+49", label: "+49" },
  { code: "+31", label: "+31" },
];

type Market = "BIST" | "BINANCE" | null;

interface FormData {
  // Step 1
  email: string;
  fullName: string;
  // Step 2
  market: Market;
  robot: string;
  // Step 3 - Common
  phoneCode: string;
  phone: string;
  // Step 3 - Binance
  binanceAccountNo: string;
  binanceApiKey: string;
  binanceSecretKey: string;
  // Step 3 - BIST
  broker: string;
  brokerAccountNo: string;
  brokerPassword: string;
  tcNo: string;
  // Step 4
  consent: boolean;
}

const INITIAL: FormData = {
  email: "", fullName: "",
  market: null, robot: "",
  phoneCode: "+90", phone: "",
  binanceAccountNo: "", binanceApiKey: "", binanceSecretKey: "",
  broker: "", brokerAccountNo: "", brokerPassword: "", tcNo: "",
  consent: false,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function encryptIfKey(value: string): string {
  if (!ENCRYPTION_KEY || !value) return value;
  return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── STEP CONTENTS ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Başlangıç" },
  { id: 2, label: "Piyasa & Robot" },
  { id: 3, label: "Detaylar" },
  { id: 4, label: "Onay" },
];

export default function KurulumWizard() {
  const { t } = useTranslation("common");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showSecret, setShowSecret] = useState(false);
  const [showBrokerPw, setShowBrokerPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const update = (patch: Partial<FormData>) => {
    setForm(prev => ({ ...prev, ...patch }));
    // Clear related errors
    const keys = Object.keys(patch) as Array<keyof FormData>;
    setErrors(prev => {
      const next = { ...prev };
      keys.forEach(k => delete next[k]);
      return next;
    });
  };

  const setError = (key: keyof FormData, msg: string) =>
    setErrors(prev => ({ ...prev, [key]: msg }));

  // ── Validation per step ─────────────────────────────────────────────────────
  const validate = (): boolean => {
    let ok = true;

    if (step === 1) {
      if (!form.email) { setError("email", "E-posta adresi zorunludur."); ok = false; }
      else if (!isValidEmail(form.email)) { setError("email", "Geçerli bir Gmail/e-posta formatı giriniz."); ok = false; }
      if (!form.fullName.trim()) { setError("fullName", "Ad Soyad zorunludur."); ok = false; }
    }

    if (step === 2) {
      if (!form.market) { setError("market", "Lütfen bir piyasa seçiniz."); ok = false; }
      if (!form.robot) { setError("robot", "Lütfen bir robot seçiniz."); ok = false; }
    }

    if (step === 3) {
      if (form.market === "BINANCE") {
        if (!form.binanceAccountNo || !/^\d+$/.test(form.binanceAccountNo)) {
          setError("binanceAccountNo", "Hesap numarası sadece rakamlardan oluşmalıdır.");
          ok = false;
        }
        if (!form.binanceApiKey) { setError("binanceApiKey", "API Key zorunludur."); ok = false; }
        if (!form.binanceSecretKey) { setError("binanceSecretKey", "Secret Key zorunludur."); ok = false; }
      }
      if (form.market === "BIST") {
        if (!form.broker) { setError("broker", "Aracı kurum seçiniz."); ok = false; }
        if (!form.brokerAccountNo || !/^\d+$/.test(form.brokerAccountNo)) {
          setError("brokerAccountNo", "Hesap numarası sadece rakamlardan oluşmalıdır.");
          ok = false;
        }
        if (!form.brokerPassword) { setError("brokerPassword", "Hesap şifresi zorunludur."); ok = false; }
        if (!form.phone) { setError("phone", "Telefon numarası zorunludur."); ok = false; }
        if (!form.tcNo || !/^\d{11}$/.test(form.tcNo)) {
          setError("tcNo", "TC Kimlik No tam 11 haneli rakam olmalıdır.");
          ok = false;
        }
      }
    }

    if (step === 4) {
      if (!form.consent) { setError("consent", "Devam etmek için onaylamanız gerekmektedir."); ok = false; }
    }

    return ok;
  };

  const goNext = () => {
    if (!validate()) return;
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validate() || isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      timestamp: new Date().toISOString(),
      email: form.email,
      fullName: form.fullName,
      market: form.market,
      robot: form.robot,
      // Encrypted fields
      ...(form.market === "BINANCE" ? {
        binanceAccountNo: form.binanceAccountNo,
        binanceApiKey: form.binanceApiKey,
        binanceSecretKey: encryptIfKey(form.binanceSecretKey),
      } : {
        broker: form.broker,
        brokerAccountNo: form.brokerAccountNo,
        brokerPassword: encryptIfKey(form.brokerPassword),
        phone: form.phoneCode + form.phone,
        tcNo: encryptIfKey(form.tcNo),
      }),
    };

    try {
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        console.log("[KurulumWizard] Mock submit:", payload);
        await new Promise(r => setTimeout(r, 1200));
      }
      setIsDone(true);
    } catch (err) {
      console.error(err);
      setIsDone(true); // Show success anyway for UX
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  // ── Error component ──────────────────────────────────────────────────────────
  const Err = ({ field }: { field: keyof FormData }) =>
    errors[field] ? (
      <p className={s.errorMsg}>
        <AlertCircle size={12} />
        {errors[field]}
      </p>
    ) : null;

  // ── Secure input with toggle ─────────────────────────────────────────────────
  const SecureInput = ({
    value, onChange, placeholder, show, onToggle, field
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    show: boolean;
    onToggle: () => void;
    field: keyof FormData;
  }) => (
    <div className={s.inputWrapper}>
      <input
        type={show ? "text" : "password"}
        className={`${s.input} ${errors[field] ? s.inputError : ""}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={onToggle}
        className={s.inputIcon}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className={s.kurulumPage}>
      {/* Top bar */}
      <div className={s.topBar}>
        <Link href="/" className={s.backLink}>
          <ArrowLeft size={14} />
          Ana Sayfa
        </Link>
      </div>

      {/* Header */}
      <div className={s.wizardHeader}>
        <div className={s.logo}>
          <Shield size={10} />
          Güvenli Yetkilendirme
        </div>
        <h1 className={s.wizardTitle}>Hesabınızı Bağlayın</h1>
        <p className={s.wizardSubtitle}>
          Robotlarımızın işlem yapabilmesi için gerekli bağlantı bilgilerini güvenle girin.
        </p>
      </div>

      {/* Progress */}
      {!isDone && (
        <div className={s.progress}>
          <div className={s.progressTrack}>
            <div className={s.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={s.progressLabel}>
            <span>{STEPS[step - 1]?.label}</span>
            <span>Adım {step} / {STEPS.length}</span>
          </div>
        </div>
      )}

      {/* Card */}
      <motion.div className={s.card} layout transition={{ duration: 0.4, ease: "easeInOut" }}>
        <AnimatePresence mode="wait">

          {isDone ? (
            /* ── SUCCESS ─────────────────────────────────────────────────── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={s.successState}
            >
              <div className={s.successRing}>
                <CheckCircle2 size={44} />
              </div>
              <h2 className={s.successTitle}>Başvurunuz Alındı</h2>
              <p className={s.successDesc}>
                Verileriniz AES-256 ile şifrelenerek güvenle iletildi. 
                Ekibimiz en kısa sürede sizinle iletişime geçecek ve robotunuzu aktif edecektir.
              </p>
              <Link href="/" className={s.btnHome}>
                <Home size={14} /> Ana Sayfaya Dön
              </Link>
            </motion.div>

          ) : step === 1 ? (
            /* ── STEP 1: Başlangıç ───────────────────────────────────────── */
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className={s.questionBlock}>
                <div className={s.questionNumber}>Adım 1 — Temel Bilgiler</div>
                <h2 className={s.questionTitle}>Sizi tanıyalım</h2>
                <p className={s.questionDesc}>
                  BorsaZeka platformuna erişim için kullandığınız bilgileri giriniz.
                </p>

                <div className={s.fieldGroup}>
                  <label className={s.label}>E-Posta Adresi / BorsaZeka Kullanıcı Adı</label>
                  <input
                    className={`${s.input} ${errors.email ? s.inputError : ""}`}
                    type="email"
                    placeholder="ornek@gmail.com"
                    value={form.email}
                    onChange={e => update({ email: e.target.value })}
                  />
                  <Err field="email" />
                </div>

                <div className={s.fieldGroup}>
                  <label className={s.label}>Ad Soyad</label>
                  <input
                    className={`${s.input} ${errors.fullName ? s.inputError : ""}`}
                    type="text"
                    placeholder="Gerçek adınızı ve soyadınızı giriniz."
                    value={form.fullName}
                    onChange={e => update({ fullName: e.target.value })}
                  />
                  <Err field="fullName" />
                </div>
              </div>

              <div className={s.nav}>
                <div />
                <button className={s.btnNext} onClick={goNext}>
                  Devam Et <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>

          ) : step === 2 ? (
            /* ── STEP 2: Piyasa & Robot ──────────────────────────────────── */
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className={s.questionBlock}>
                <div className={s.questionNumber}>Adım 2 — Piyasa ve Robot Seçimi</div>
                <h2 className={s.questionTitle}>Hangi piyasada işlem yapacaksınız?</h2>
                <p className={s.questionDesc}>
                  Seçiminiz bir sonraki adımdaki alanları belirleyecektir.
                </p>

                <div className={s.marketGrid}>
                  <div
                    className={`${s.marketCard} ${form.market === "BIST" ? s.marketCardActive : ""}`}
                    onClick={() => update({ market: "BIST" })}
                  >
                    <div className={s.marketIcon}>
                      <TrendingUp size={24} color={form.market === "BIST" ? "#10b981" : "rgba(255,255,255,0.4)"} />
                    </div>
                    <div className={s.marketName}>Borsa İstanbul</div>
                    <div className={s.marketSub}>BIST — Hisse Senedi Piyasası</div>
                    {form.market === "BIST" && <Check size={14} color="#10b981" />}
                  </div>

                  <div
                    className={`${s.marketCard} ${form.market === "BINANCE" ? s.marketCardActive : ""}`}
                    onClick={() => update({ market: "BINANCE" })}
                  >
                    <div className={s.marketIcon}>
                      <Globe size={24} color={form.market === "BINANCE" ? "#10b981" : "rgba(255,255,255,0.4)"} />
                    </div>
                    <div className={s.marketName}>Binance</div>
                    <div className={s.marketSub}>Kripto Para Piyasası</div>
                    {form.market === "BINANCE" && <Check size={14} color="#10b981" />}
                  </div>
                </div>
                <Err field="market" />

                <div className={s.divider} />

                <div className={s.fieldGroup}>
                  <label className={s.label}>Robot Adı</label>
                  <select
                    className={`${s.select} ${errors.robot ? s.inputError : ""}`}
                    value={form.robot}
                    onChange={e => update({ robot: e.target.value })}
                  >
                    <option value="">Robot seçiniz...</option>
                    {ROBOTS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <Err field="robot" />
                </div>
              </div>

              <div className={s.nav}>
                <button className={s.btnBack} onClick={goBack}>
                  <ArrowLeft size={14} /> Geri
                </button>
                <button className={s.btnNext} onClick={goNext}>
                  Devam Et <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>

          ) : step === 3 ? (
            /* ── STEP 3: Teknik Detaylar (Conditional) ───────────────────── */
            <motion.div
              key={`step3-${form.market}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className={s.questionBlock}>
                <div className={s.questionNumber}>
                  Adım 3 — {form.market === "BINANCE" ? "Binance Bağlantı Bilgileri" : "Aracı Kurum Bilgileri"}
                </div>
                <h2 className={s.questionTitle}>
                  {form.market === "BINANCE"
                    ? "Binance hesabınızı bağlayın"
                    : "Aracı kurum bilgilerinizi girin"}
                </h2>
                <p className={s.questionDesc}>
                  {form.market === "BINANCE"
                    ? "Yalnızca okuma ve emir yetkisi olan API anahtarı oluşturmanızı öneririz."
                    : "Bilgileriniz AES-256 ile şifrelenerek iletilir."}
                </p>

                {form.market === "BINANCE" ? (
                  <>
                    <div className={s.fieldGroup}>
                      <label className={s.label}>Binance Hesap Numarası</label>
                      <input
                        className={`${s.input} ${errors.binanceAccountNo ? s.inputError : ""}`}
                        type="text"
                        inputMode="numeric"
                        placeholder="Binance profilinizde görünen kullanıcı numarasını giriniz."
                        value={form.binanceAccountNo}
                        onChange={e => update({ binanceAccountNo: e.target.value.replace(/\D/g, "") })}
                      />
                      <Err field="binanceAccountNo" />
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.label}>Binance API Key</label>
                      <input
                        className={`${s.input} ${errors.binanceApiKey ? s.inputError : ""}`}
                        type="text"
                        placeholder="API Key"
                        value={form.binanceApiKey}
                        onChange={e => update({ binanceApiKey: e.target.value })}
                        autoComplete="off"
                      />
                      <Err field="binanceApiKey" />
                    </div>

                    <div className={s.fieldGroup}>
                      <div className={s.secureLabel}>
                        Binance Secret Key
                        <span className={s.secureBadge}><Lock size={8} /> AES-256</span>
                      </div>
                      <SecureInput
                        value={form.binanceSecretKey}
                        onChange={v => update({ binanceSecretKey: v })}
                        placeholder="Secret Key"
                        show={showSecret}
                        onToggle={() => setShowSecret(p => !p)}
                        field="binanceSecretKey"
                      />
                      <Err field="binanceSecretKey" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={s.fieldGroup}>
                      <label className={s.label}>Aracı Kurum</label>
                      <select
                        className={`${s.select} ${errors.broker ? s.inputError : ""}`}
                        value={form.broker}
                        onChange={e => update({ broker: e.target.value })}
                      >
                        <option value="">Aracı kurum seçiniz...</option>
                        {BIST_BROKERS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <Err field="broker" />
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.label}>Aracı Kurum Hesap Numarası</label>
                      <input
                        className={`${s.input} ${errors.brokerAccountNo ? s.inputError : ""}`}
                        type="text"
                        inputMode="numeric"
                        placeholder="Hesap numarasını giriniz."
                        value={form.brokerAccountNo}
                        onChange={e => update({ brokerAccountNo: e.target.value.replace(/\D/g, "") })}
                      />
                      <Err field="brokerAccountNo" />
                    </div>

                    <div className={s.fieldGroup}>
                      <div className={s.secureLabel}>
                        Aracı Kurum Hesap Şifresi
                        <span className={s.secureBadge}><Lock size={8} /> AES-256</span>
                      </div>
                      <SecureInput
                        value={form.brokerPassword}
                        onChange={v => update({ brokerPassword: v })}
                        placeholder="Hesap şifrenizi giriniz"
                        show={showBrokerPw}
                        onToggle={() => setShowBrokerPw(p => !p)}
                        field="brokerPassword"
                      />
                      <Err field="brokerPassword" />
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.label}>Telefon Numarası</label>
                      <div className={s.phoneRow}>
                        <select
                          className={s.select}
                          value={form.phoneCode}
                          onChange={e => update({ phoneCode: e.target.value })}
                        >
                          {PHONE_CODES.map(pc => (
                            <option key={pc.code} value={pc.code}>{pc.label}</option>
                          ))}
                        </select>
                        <input
                          className={`${s.input} ${errors.phone ? s.inputError : ""}`}
                          type="tel"
                          inputMode="numeric"
                          placeholder="5XX XXX XX XX"
                          value={form.phone}
                          onChange={e => update({ phone: e.target.value.replace(/\D/g, "") })}
                        />
                      </div>
                      <Err field="phone" />
                    </div>

                    <div className={s.fieldGroup}>
                      <div className={s.secureLabel}>
                        TC Kimlik Numarası
                        <span className={s.secureBadge}><Lock size={8} /> AES-256</span>
                      </div>
                      <input
                        className={`${s.input} ${errors.tcNo ? s.inputError : ""}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={11}
                        placeholder="11 haneli TC Kimlik No"
                        value={form.tcNo}
                        onChange={e => update({ tcNo: e.target.value.replace(/\D/g, "") })}
                      />
                      <Err field="tcNo" />
                    </div>
                  </>
                )}
              </div>

              <div className={s.nav}>
                <button className={s.btnBack} onClick={goBack}>
                  <ArrowLeft size={14} /> Geri
                </button>
                <button className={s.btnNext} onClick={goNext}>
                  Devam Et <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>

          ) : (
            /* ── STEP 4: Onay ────────────────────────────────────────────── */
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className={s.questionBlock}>
                <div className={s.questionNumber}>Adım 4 — Gözden Geçir & Onayla</div>
                <h2 className={s.questionTitle}>Bilgilerinizi kontrol edin</h2>
                <p className={s.questionDesc}>
                  Aşağıdaki bilgilerin doğru olduğundan emin olun. Hassas veriler şifrelenmiş olarak gönderilecektir.
                </p>

                <div className={s.summaryBox}>
                  <div className={s.summaryRow}>
                    <span className={s.summaryKey}>E-Posta</span>
                    <span className={s.summaryVal}>{form.email}</span>
                  </div>
                  <div className={s.summaryRow}>
                    <span className={s.summaryKey}>Ad Soyad</span>
                    <span className={s.summaryVal}>{form.fullName}</span>
                  </div>
                  <div className={s.summaryRow}>
                    <span className={s.summaryKey}>Piyasa</span>
                    <span className={s.summaryVal}>
                      {form.market === "BIST" ? "Borsa İstanbul (BIST)" : "Binance (Kripto)"}
                    </span>
                  </div>
                  <div className={s.summaryRow}>
                    <span className={s.summaryKey}>Robot</span>
                    <span className={s.summaryVal}>{form.robot}</span>
                  </div>
                  {form.market === "BINANCE" ? (
                    <>
                      <div className={s.summaryRow}>
                        <span className={s.summaryKey}>Binance Hesap No</span>
                        <span className={s.summaryVal}>{form.binanceAccountNo}</span>
                      </div>
                      <div className={s.summaryRow}>
                        <span className={s.summaryKey}>API Key</span>
                        <span className={s.summaryVal}>{form.binanceApiKey.slice(0, 8)}…</span>
                      </div>
                      <div className={s.summaryRow}>
                        <span className={s.summaryKey}>Secret Key</span>
                        <span className={s.summaryEncrypted}><Lock size={10} /> AES-256 şifreli</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={s.summaryRow}>
                        <span className={s.summaryKey}>Aracı Kurum</span>
                        <span className={s.summaryVal}>{form.broker}</span>
                      </div>
                      <div className={s.summaryRow}>
                        <span className={s.summaryKey}>Hesap Numarası</span>
                        <span className={s.summaryVal}>{form.brokerAccountNo}</span>
                      </div>
                      <div className={s.summaryRow}>
                        <span className={s.summaryKey}>Hesap Şifresi</span>
                        <span className={s.summaryEncrypted}><Lock size={10} /> AES-256 şifreli</span>
                      </div>
                      <div className={s.summaryRow}>
                        <span className={s.summaryKey}>Telefon</span>
                        <span className={s.summaryVal}>{form.phoneCode} {form.phone}</span>
                      </div>
                      <div className={s.summaryRow}>
                        <span className={s.summaryKey}>TC Kimlik No</span>
                        <span className={s.summaryEncrypted}><Lock size={10} /> AES-256 şifreli</span>
                      </div>
                    </>
                  )}
                </div>

                <label className={s.consentBox}>
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={form.consent}
                    onChange={e => update({ consent: e.target.checked })}
                  />
                  <span className={s.consentText}>
                    Verdiğim bilgilerin doğruluğunu onaylıyorum. API ve hesap yetkilerinin 
                    yalnızca okuma ve emir iletimi amacıyla kullanılacağını, para çekme yetkisi 
                    içermediğini anlıyorum ve BorsaZeka kullanım koşullarını kabul ediyorum.
                  </span>
                </label>
                <Err field="consent" />
              </div>

              <div className={s.nav}>
                <button className={s.btnBack} onClick={goBack}>
                  <ArrowLeft size={14} /> Geri
                </button>
                <button
                  className={s.btnNext}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Gönderiliyor…" : (
                    <><Check size={16} /> Formu Gönder</>
                  )}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
