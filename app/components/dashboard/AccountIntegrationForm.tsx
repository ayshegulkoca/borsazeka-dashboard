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
import { syncBrokerAccount } from "@/app/actions/broker";
import s from "../landing/kurulum.module.css"; // Reusing these styles for consistency

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || "";
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "fallback-key-for-dev";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
// robotId: matches UserRobot.robotId (lowercase) stored in DB via broker.ts
// name: display label shown in dropdown
// market: "BIST" | "BINANCE"
const ROBOT_CATALOG: { robotId: string; name: string; market: "BIST" | "BINANCE" }[] = [
  // BIST robots
  { robotId: "darkroom",       name: "DarkRoom Premium",   market: "BIST" },
  { robotId: "highway",        name: "Highway Premium",    market: "BIST" },
  { robotId: "trademate",      name: "TradeMate Premium",  market: "BIST" },
  { robotId: "fabrika",        name: "Fabrika Premium",    market: "BIST" },
  { robotId: "darkroom_self",  name: "DarkRoom Self-Service",  market: "BIST" },
  { robotId: "highway_self",   name: "Highway Self-Service",   market: "BIST" },
  { robotId: "trademate_self", name: "TradeMate Self-Service", market: "BIST" },
  { robotId: "fabrika_self",   name: "Fabrika Self-Service",   market: "BIST" },
  { robotId: "classic",        name: "BorsaZeka Classic",  market: "BIST" },
  // Binance / Kripto + Forex robots
  { robotId: "kripttozeka",      name: "KriptoZeka",            market: "BINANCE" },
  { robotId: "kripttozeka_self", name: "KriptoZeka Ascent Premium", market: "BINANCE" },
  { robotId: "kripttozeka_ascent", name: "KriptoZeka Self-Service",   market: "BINANCE" },
  { robotId: "forexzeka",        name: "ForexZeka",             market: "BINANCE" },
];

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
  initialEmail?: string;
  initialMarket?: Market;
  ownedRobotIds: string[];   // From DB: UserRobot.robotId values where isActive=true
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

function maskAccountNo(no: string): string {
  if (!no) return "";
  if (no.length <= 4) return "****";
  return no.slice(0, 4) + "****";
}

const STEPS = [
  { id: 1, label: "Başlangıç" },
  { id: 2, label: "Piyasa & Robot" },
  { id: 3, label: "Detaylar" },
  { id: 4, label: "Onay" },
];

export default function AccountIntegrationForm({ initialEmail, initialMarket, ownedRobotIds, onSuccess }: Props) {
  const { t } = useTranslation("common");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({ 
    ...INITIAL, 
    email: initialEmail || "",
    market: initialMarket || null 
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showSecret, setShowSecret] = useState(false);
  const [showBrokerPw, setShowBrokerPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Robots filtered by selected market AND user ownership
  const getRobotsForMarket = (market: Market): { robotId: string; name: string }[] => {
    if (!market) return [];
    return ROBOT_CATALOG
      .filter(r => r.market === market && ownedRobotIds.includes(r.robotId));
  };

  const availableRobots = getRobotsForMarket(form.market);
  const hasRobots = availableRobots.length > 0;

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
      if (!form.email) { setError("email", t("dashboard.accounts.valEmailRequired")); ok = false; }
      else if (!isValidEmail(form.email)) { setError("email", t("dashboard.accounts.valEmailInvalid")); ok = false; }
      if (!form.fullName.trim()) { setError("fullName", t("dashboard.accounts.valFullNameRequired")); ok = false; }
    }

    if (step === 2) {
      if (!form.market) { setError("market", t("dashboard.accounts.valMarketRequired")); ok = false; }
      if (!form.robot) { setError("robot", t("dashboard.accounts.valRobotRequired")); ok = false; }
    }

    if (step === 3) {
      if (form.market === "BINANCE") {
        if (!form.binanceAccountNo || !/^\d+$/.test(form.binanceAccountNo)) {
          setError("binanceAccountNo", t("dashboard.accounts.valAccountNoNumeric"));
          ok = false;
        }
        if (!form.binanceApiKey) { setError("binanceApiKey", t("dashboard.accounts.valApiKeyRequired")); ok = false; }
        if (!form.binanceSecretKey) { setError("binanceSecretKey", t("dashboard.accounts.valSecretKeyRequired")); ok = false; }
      }
      if (form.market === "BIST") {
        if (!form.broker) { setError("broker", t("dashboard.accounts.valBrokerRequired")); ok = false; }
        if (!form.brokerAccountNo || !/^\d+$/.test(form.brokerAccountNo)) {
          setError("brokerAccountNo", t("dashboard.accounts.valAccountNoNumeric"));
          ok = false;
        }
        if (!form.brokerPassword) { setError("brokerPassword", t("dashboard.accounts.valBrokerPasswordRequired")); ok = false; }
        if (!form.phone) { setError("phone", t("dashboard.accounts.valPhoneRequired")); ok = false; }
        if (!form.tcNo || !/^\d{11}$/.test(form.tcNo)) {
          setError("tcNo", t("dashboard.accounts.valTcNoLength"));
          ok = false;
        }
      }
    }

    if (step === 4) {
      if (!form.consent) { setError("consent", t("dashboard.accounts.valConsentRequired")); ok = false; }
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

    const isBinance = form.market === "BINANCE";
    const accountNo = isBinance ? form.binanceAccountNo : form.brokerAccountNo;
    const institution = isBinance ? "Binance" : form.broker;

    const payload = {
      timestamp: new Date().toISOString(),
      source: "dashboard_integration",
      email: form.email,
      fullName: form.fullName,
      market: form.market,
      robot: form.robot,
      ...(isBinance ? {
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
      // 1. Send Webhook
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      // 2. Sync with Database
      await syncBrokerAccount({
        accountType: form.market as "BIST" | "BINANCE",
        institution,
        accountNo: maskAccountNo(accountNo),
        robotName: form.robot,
      });

      setIsDone(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("[AccountIntegrationForm Error]:", err);
      setIsDone(true); // UX
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
        <h2 className={s.successTitle}>{t("dashboard.accounts.integrationSuccessTitle")}</h2>
        <p className={s.successDesc}>
          {t("dashboard.accounts.integrationSuccessDesc")}
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
              <h2 className={s.questionTitle}>{t("dashboard.accounts.basicInfo")}</h2>
              <p className={s.questionDesc}>{t("dashboard.accounts.basicInfoDesc")}</p>

              <div className={s.fieldGroup}>
                <label className={s.label}>
                  {t("dashboard.accounts.fields.email")}
                  {initialEmail && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Lock size={10} /> {t('dashboard.settings.emailLocked')}
                    </span>
                  )}
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  {initialEmail && <Lock size={14} style={{ position: 'absolute', left: '0.75rem', opacity: 0.5, color: 'var(--text-muted)' }} />}
                  <input 
                    className={`${s.input} ${errors.email ? s.inputError : ""}`} 
                    type="email" 
                    placeholder="ornek@gmail.com" 
                    value={form.email} 
                    onChange={e => !initialEmail && update({ email: e.target.value })}
                    readOnly={!!initialEmail}
                    disabled={!!initialEmail}
                    style={initialEmail ? { paddingLeft: '2.25rem', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'not-allowed', color: 'var(--text-muted)', opacity: 1 } : {}}
                  />
                </div>
                <Err field="email" />
              </div>
              <div className={s.fieldGroup}>
                <label className={s.label}>{t("dashboard.accounts.fields.fullName")}</label>
                <input className={`${s.input} ${errors.fullName ? s.inputError : ""}`} type="text" placeholder={t("dashboard.accounts.fields.fullName")} value={form.fullName} onChange={e => update({ fullName: e.target.value })} />
                <Err field="fullName" />
              </div>
            </div>
            <div className={s.nav} style={{ borderTop: "none", marginTop: "1rem" }}>
              <div />
              <button className={s.btnNext} onClick={goNext}>{t("kurulum.next")} <ArrowRight size={16} /></button>
            </div>
          </motion.div>
        )}

        {step === 2 && !initialMarket && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className={s.questionBlock}>
              <h2 className={s.questionTitle}>{t("dashboard.accounts.marketAndRobot")}</h2>
              <div className={s.marketGrid}>
                <div className={`${s.marketCard} ${form.market === "BIST" ? s.marketCardActive : ""}`} onClick={() => update({ market: "BIST" })}>
                  <TrendingUp size={24} color={form.market === "BIST" ? "#10b981" : "rgba(255,255,255,0.4)"} />
                  <div className={s.marketName}>{t("dashboard.accounts.bistExchange")}</div>
                </div>
                <div className={`${s.marketCard} ${form.market === "BINANCE" ? s.marketCardActive : ""}`} onClick={() => update({ market: "BINANCE" })}>
                  <Globe size={24} color={form.market === "BINANCE" ? "#10b981" : "rgba(255,255,255,0.4)"} />
                  <div className={s.marketName}>Binance</div>
                </div>
              </div>
              <Err field="market" />
              <div className={s.divider} />
              <div className={s.fieldGroup}>
                <label className={s.label}>{t("dashboard.accounts.fields.robotName")}</label>
                <select
                  className={`${s.select} ${errors.robot ? s.inputError : ""}`}
                  value={form.robot}
                  onChange={e => update({ robot: e.target.value })}
                  disabled={!form.market || !hasRobots}
                >
                  {!form.market ? (
                    <option value="">{t("dashboard.accounts.selectMarketFirst")}</option>
                  ) : !hasRobots ? (
                    <option value="">{t("dashboard.accounts.noActiveRobotFound")}</option>
                  ) : (
                    <>
                      <option value="">{t("dashboard.accounts.selectRobot")}</option>
                      {availableRobots.map(r => (
                        <option key={r.robotId} value={r.name}>{r.name}</option>
                      ))}
                    </>
                  )}
                </select>
                {!hasRobots && form.market && (
                  <p style={{ fontSize: "0.78rem", color: "#f59e0b", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.35rem" }}>
                    <AlertCircle size={13} />
                    {t("dashboard.accounts.noActiveRobotWarning")}
                  </p>
                )}
                <Err field="robot" />
              </div>
            </div>
            <div className={s.nav} style={{ borderTop: "none", marginTop: "1rem" }}>
              <button className={s.btnBack} onClick={goBack}>{t("kurulum.back")}</button>
              <button className={s.btnNext} onClick={goNext}>{t("kurulum.next")} <ArrowRight size={16} /></button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className={s.questionBlock}>
              <h2 className={s.questionTitle}>
                {form.market === "BINANCE" ? t("dashboard.accounts.binanceInfo") : t("dashboard.accounts.brokerInfo")}
              </h2>
              
              {initialMarket && (
                <div className={s.fieldGroup}>
                  <label className={s.label}>{t("dashboard.accounts.fields.robotName")}</label>
                  <select
                    className={`${s.select} ${errors.robot ? s.inputError : ""}`}
                    value={form.robot}
                    onChange={e => update({ robot: e.target.value })}
                    disabled={!hasRobots}
                  >
                    {!hasRobots ? (
                      <option value="">{t("dashboard.accounts.noActiveRobotFound")}</option>
                    ) : (
                      <>
                        <option value="">{t("dashboard.accounts.selectRobot")}</option>
                        {availableRobots.map(r => (
                          <option key={r.robotId} value={r.name}>{r.name}</option>
                        ))}
                      </>
                    )}
                  </select>
                  {!hasRobots && (
                    <p style={{ fontSize: "0.78rem", color: "#f59e0b", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.35rem" }}>
                      <AlertCircle size={13} />
                      {t("dashboard.accounts.noActiveRobotWarning")}
                    </p>
                  )}
                  <Err field="robot" />
                </div>
              )}

              {form.market === "BINANCE" ? (
                <>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>{t("dashboard.accounts.binanceAccountNo")}</label>
                    <input className={`${s.input} ${errors.binanceAccountNo ? s.inputError : ""}`} type="text" value={form.binanceAccountNo} onChange={e => update({ binanceAccountNo: e.target.value.replace(/\D/g, "") })} />
                    <Err field="binanceAccountNo" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>{t("kurulum.fields.apiKey")}</label>
                    <input className={`${s.input} ${errors.binanceApiKey ? s.inputError : ""}`} type="text" value={form.binanceApiKey} onChange={e => update({ binanceApiKey: e.target.value })} />
                    <Err field="binanceApiKey" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>{t("kurulum.fields.apiSecret")}</label>
                    <SecureInput value={form.binanceSecretKey} onChange={v => update({ binanceSecretKey: v })} show={showSecret} onToggle={() => setShowSecret(p => !p)} field="binanceSecretKey" />
                    <Err field="binanceSecretKey" />
                  </div>
                </>
              ) : (
                <>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>{t("dashboard.accounts.fields.broker")}</label>
                    <select className={`${s.select} ${errors.broker ? s.inputError : ""}`} value={form.broker} onChange={e => update({ broker: e.target.value })}>
                      <option value="">{t("dashboard.accounts.select")}</option>
                      {BIST_BROKERS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <Err field="broker" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>{t("dashboard.accounts.accountNumber")}</label>
                    <input className={`${s.input} ${errors.brokerAccountNo ? s.inputError : ""}`} type="text" value={form.brokerAccountNo} onChange={e => update({ brokerAccountNo: e.target.value.replace(/\D/g, "") })} />
                    <Err field="brokerAccountNo" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>{t("dashboard.accounts.fields.password")}</label>
                    <SecureInput value={form.brokerPassword} onChange={v => update({ brokerPassword: v })} show={showBrokerPw} onToggle={() => setShowBrokerPw(p => !p)} field="brokerPassword" />
                    <Err field="brokerPassword" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>{t("kurulum.fields.tcNo")}</label>
                    <input className={`${s.input} ${errors.tcNo ? s.inputError : ""}`} type="text" maxLength={11} value={form.tcNo} onChange={e => update({ tcNo: e.target.value.replace(/\D/g, "") })} />
                    <Err field="tcNo" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>{t("dashboard.settings.phone")}</label>
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
              <button className={s.btnBack} onClick={goBack}>{t("kurulum.back")}</button>
              <button className={s.btnNext} onClick={goNext}>{t("kurulum.next")} <ArrowRight size={16} /></button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className={s.questionBlock}>
              <h2 className={s.questionTitle}>{t("dashboard.accounts.finalConfirmation")}</h2>
              <div className={s.summaryBox} style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className={s.summaryRow}><span>{t("dashboard.accounts.robot")}</span> <span>{form.robot}</span></div>
                <div className={s.summaryRow}><span>{t("dashboard.accounts.market")}</span> <span>{form.market}</span></div>
                {form.market === "BINANCE" ? (
                  <div className={s.summaryRow}><span>{t("dashboard.accounts.accountNo")}</span> <span>{form.binanceAccountNo}</span></div>
                ) : (
                  <>
                    <div className={s.summaryRow}><span>{t("dashboard.accounts.institution")}</span> <span>{form.broker}</span></div>
                    <div className={s.summaryRow}><span>{t("dashboard.accounts.accountNo")}</span> <span>{form.brokerAccountNo}</span></div>
                  </>
                )}
              </div>
              <label className={s.consentBox}>
                <input type="checkbox" className={s.checkbox} checked={form.consent} onChange={e => update({ consent: e.target.checked })} />
                <span className={s.consentText}>{t("dashboard.accounts.consentText")}</span>
              </label>
              <Err field="consent" />
            </div>
            <div className={s.nav} style={{ borderTop: "none", marginTop: "1rem" }}>
              <button className={s.btnBack} onClick={goBack}>{t("kurulum.back")}</button>
              <button className={s.btnNext} onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? t("kurulum.submitting") : t("kurulum.submit")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
