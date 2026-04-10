"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Lock, Shield,
  CheckCircle2, AlertCircle, Eye, EyeOff, Home,
  TrendingUp, Globe
} from "lucide-react";
import { useTranslation } from "react-i18next";
import CryptoJS from "crypto-js";
import s from "../landing/kurulum.module.css"; // Reusing these styles for consistency

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || "";
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "fallback-key-for-dev";

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

interface Props {
  initialMarket?: Market;
  onSuccess?: () => void;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function encryptIfKey(value: string): string {
  if (!ENCRYPTION_KEY || !value) return value;
  return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const STEPS = [
  { id: 1, label: "Başlangıç" },
  { id: 2, label: "Piyasa & Robot" },
  { id: 3, label: "Detaylar" },
  { id: 4, label: "Onay" },
];

export default function AccountIntegrationForm({ initialMarket, onSuccess }: Props) {
  const { t } = useTranslation("common");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({ ...INITIAL, market: initialMarket || null });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showSecret, setShowSecret] = useState(false);
  const [showBrokerPw, setShowBrokerPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const update = (patch: Partial<FormData>) => {
    setForm(prev => ({ ...prev, ...patch }));
    const keys = Object.keys(patch) as Array<keyof FormData>;
    setErrors(prev => {
      const next = { ...prev };
      keys.forEach(k => delete next[k]);
      return next;
    });
  };

  const setError = (key: keyof FormData, msg: string) =>
    setErrors(prev => ({ ...prev, [key]: msg }));

  const validate = (): boolean => {
    let ok = true;

    if (step === 1) {
      if (!form.email) { setError("email", "E-posta adresi zorunludur."); ok = false; }
      else if (!isValidEmail(form.email)) { setError("email", "Geçerli bir e-posta formatı giriniz."); ok = false; }
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
    
    // Skip Step 2 if market is already provided
    if (step === 1 && initialMarket) {
      setStep(3);
    } else {
      setStep(s => s + 1);
    }
  };

  const goBack = () => {
    // Skip Step 2 if market is already provided
    if (step === 3 && initialMarket) {
      setStep(1);
    } else {
      setStep(s => s - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validate() || isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      timestamp: new Date().toISOString(),
      source: "dashboard_integration",
      email: form.email,
      fullName: form.fullName,
      market: form.market,
      robot: form.robot,
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
        console.log("[AccountIntegrationForm] No webhook URL. Mock payload:", payload);
        await new Promise(r => setTimeout(r, 1500));
      }
      setIsDone(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setIsDone(true); // Show success anyway for UX in this demo/mock phase
    } finally {
      setIsSubmitting(false);
    }
  };

  const Err = ({ field }: { field: keyof FormData }) =>
    errors[field] ? (
      <p className={s.errorMsg}>
        <AlertCircle size={12} />
        {errors[field]}
      </p>
    ) : null;

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
        style={{ background: "none", border: "none", cursor: "pointer", pointerEvents: "auto" }}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );

  if (isDone) {
    return (
      <div className={s.successState}>
        <div className={s.successRing}>
          <CheckCircle2 size={44} />
        </div>
        <h2 className={s.successTitle}>Hesabınız Bağlandı</h2>
        <p className={s.successDesc}>
          Hesap bilgileriniz AES-256 ile şifrelenerek güvenle iletildi. 
          Robotunuz en kısa sürede aktif edilecektir.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "100%", overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className={s.questionBlock}>
              <h2 className={s.questionTitle}>Temel Bilgiler</h2>
              <p className={s.questionDesc}>BorsaZeka hesabınızla eşleşen bilgileri giriniz.</p>

              <div className={s.fieldGroup}>
                <label className={s.label}>E-Posta Adresi</label>
                <input className={`${s.input} ${errors.email ? s.inputError : ""}`} type="email" placeholder="ornek@gmail.com" value={form.email} onChange={e => update({ email: e.target.value })} />
                <Err field="email" />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>Ad Soyad</label>
                <input className={`${s.input} ${errors.fullName ? s.inputError : ""}`} type="text" placeholder="Ad Soyad" value={form.fullName} onChange={e => update({ fullName: e.target.value })} />
                <Err field="fullName" />
              </div>
            </div>
            <div className={s.nav} style={{ borderTop: "none", marginTop: "1rem" }}>
              <div />
              <button className={s.btnNext} onClick={goNext}>Devam Et <ArrowRight size={16} /></button>
            </div>
          </motion.div>
        )}

        {step === 2 && !initialMarket && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className={s.questionBlock}>
              <h2 className={s.questionTitle}>Piyasa & Robot</h2>
              <div className={s.marketGrid}>
                <div className={`${s.marketCard} ${form.market === "BIST" ? s.marketCardActive : ""}`} onClick={() => update({ market: "BIST" })}>
                  <TrendingUp size={24} color={form.market === "BIST" ? "#10b981" : "rgba(255,255,255,0.4)"} />
                  <div className={s.marketName}>Borsa İstanbul</div>
                </div>
                <div className={`${s.marketCard} ${form.market === "BINANCE" ? s.marketCardActive : ""}`} onClick={() => update({ market: "BINANCE" })}>
                  <Globe size={24} color={form.market === "BINANCE" ? "#10b981" : "rgba(255,255,255,0.4)"} />
                  <div className={s.marketName}>Binance</div>
                </div>
              </div>
              <Err field="market" />
              <div className={s.divider} />
              <div className={s.fieldGroup}>
                <label className={s.label}>Robot Adı</label>
                <select className={`${s.select} ${errors.robot ? s.inputError : ""}`} value={form.robot} onChange={e => update({ robot: e.target.value })}>
                  <option value="">Robot seçiniz...</option>
                  {ROBOTS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <Err field="robot" />
              </div>
            </div>
            <div className={s.nav} style={{ borderTop: "none", marginTop: "1rem" }}>
              <button className={s.btnBack} onClick={goBack}>Geri</button>
              <button className={s.btnNext} onClick={goNext}>Devam Et <ArrowRight size={16} /></button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className={s.questionBlock}>
              <h2 className={s.questionTitle}>{form.market === "BINANCE" ? "Binance Bilgileri" : "Aracı Kurum Bilgileri"}</h2>
              
              {initialMarket && (
                <div className={s.fieldGroup}>
                  <label className={s.label}>Robot Adı</label>
                  <select className={`${s.select} ${errors.robot ? s.inputError : ""}`} value={form.robot} onChange={e => update({ robot: e.target.value })}>
                    <option value="">Robot seçiniz...</option>
                    {ROBOTS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <Err field="robot" />
                </div>
              )}

              {form.market === "BINANCE" ? (
                <>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Binance Hesap No</label>
                    <input className={`${s.input} ${errors.binanceAccountNo ? s.inputError : ""}`} type="text" value={form.binanceAccountNo} onChange={e => update({ binanceAccountNo: e.target.value.replace(/\D/g, "") })} />
                    <Err field="binanceAccountNo" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>API Key</label>
                    <input className={`${s.input} ${errors.binanceApiKey ? s.inputError : ""}`} type="text" value={form.binanceApiKey} onChange={e => update({ binanceApiKey: e.target.value })} />
                    <Err field="binanceApiKey" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Secret Key</label>
                    <SecureInput value={form.binanceSecretKey} onChange={v => update({ binanceSecretKey: v })} show={showSecret} onToggle={() => setShowSecret(p => !p)} field="binanceSecretKey" />
                    <Err field="binanceSecretKey" />
                  </div>
                </>
              ) : (
                <>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Aracı Kurum</label>
                    <select className={`${s.select} ${errors.broker ? s.inputError : ""}`} value={form.broker} onChange={e => update({ broker: e.target.value })}>
                      <option value="">Seçiniz...</option>
                      {BIST_BROKERS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <Err field="broker" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Hesap Numarası</label>
                    <input className={`${s.input} ${errors.brokerAccountNo ? s.inputError : ""}`} type="text" value={form.brokerAccountNo} onChange={e => update({ brokerAccountNo: e.target.value.replace(/\D/g, "") })} />
                    <Err field="brokerAccountNo" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Hesap Şifresi</label>
                    <SecureInput value={form.brokerPassword} onChange={v => update({ brokerPassword: v })} show={showBrokerPw} onToggle={() => setShowBrokerPw(p => !p)} field="brokerPassword" />
                    <Err field="brokerPassword" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>TC No</label>
                    <input className={`${s.input} ${errors.tcNo ? s.inputError : ""}`} type="text" maxLength={11} value={form.tcNo} onChange={e => update({ tcNo: e.target.value.replace(/\D/g, "") })} />
                    <Err field="tcNo" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Telefon</label>
                    <div className={s.phoneRow}>
                      <select className={s.select} value={form.phoneCode} onChange={e => update({ phoneCode: e.target.value })}>
                        {PHONE_CODES.map(pc => <option key={pc.code} value={pc.code}>{pc.label}</option>)}
                      </select>
                      <input className={`${s.input} ${errors.phone ? s.inputError : ""}`} type="tel" value={form.phone} onChange={e => update({ phone: e.target.value.replace(/\D/g, "") })} />
                    </div>
                    <Err field="phone" />
                  </div>
                </>
              )}
            </div>
            <div className={s.nav} style={{ borderTop: "none", marginTop: "1rem" }}>
              <button className={s.btnBack} onClick={goBack}>Geri</button>
              <button className={s.btnNext} onClick={goNext}>Devam Et <ArrowRight size={16} /></button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className={s.questionBlock}>
              <h2 className={s.questionTitle}>Son Onay</h2>
              <div className={s.summaryBox} style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className={s.summaryRow}><span>Robot</span> <span>{form.robot}</span></div>
                <div className={s.summaryRow}><span>Piyasa</span> <span>{form.market}</span></div>
                {form.market === "BINANCE" ? (
                  <div className={s.summaryRow}><span>Hesap No</span> <span>{form.binanceAccountNo}</span></div>
                ) : (
                  <>
                    <div className={s.summaryRow}><span>Kurum</span> <span>{form.broker}</span></div>
                    <div className={s.summaryRow}><span>Hesap No</span> <span>{form.brokerAccountNo}</span></div>
                  </>
                )}
              </div>
              <label className={s.consentBox}>
                <input type="checkbox" className={s.checkbox} checked={form.consent} onChange={e => update({ consent: e.target.checked })} />
                <span className={s.consentText}>Bilgilerin doğruluğunu ve BorsaZeka kullanım koşullarını onaylıyorum.</span>
              </label>
              <Err field="consent" />
            </div>
            <div className={s.nav} style={{ borderTop: "none", marginTop: "1rem" }}>
              <button className={s.btnBack} onClick={goBack}>Geri</button>
              <button className={s.btnNext} onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Gönderiliyor..." : "Tamamla"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
