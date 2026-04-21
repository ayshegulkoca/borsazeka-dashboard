"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  TrendingUp,
  Shield,
  Bot
} from "lucide-react";
import s from "../../../components/landing/kurulum.module.css";
import { motion, AnimatePresence } from "framer-motion";

const forexSchema = z.object({
  broker: z.string().min(1, "Broker seçimi zorunludur"),
  login: z.string().min(1, "Hesap numarası zorunludur"),
  password: z.string().min(1, "Şifre zorunludur"),
  server: z.string().min(1, "Sunucu bilgisi zorunludur"),
  robot: z.string().min(1, "Robot seçimi zorunludur"),
});

type ForexFormData = z.infer<typeof forexSchema>;

export default function ForexAccountForm() {
  const { t } = useTranslation("common");
  const [form, setForm] = useState<ForexFormData>({
    broker: "Tickmill",
    login: "",
    password: "",
    server: "",
    robot: "ForexZeka",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ForexFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const update = (patch: Partial<ForexFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    if (errors[Object.keys(patch)[0] as keyof ForexFormData]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[Object.keys(patch)[0] as keyof ForexFormData];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = forexSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    console.log("Forex Account Data:", form);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsDone(true);
  };

  if (isDone) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={s.successState}
      >
        <div className={s.successRing}>
          <CheckCircle2 size={44} />
        </div>
        <h2 className={s.successTitle}>{t("dashboard.accounts.fields.success")}</h2>
        <p className={s.successDesc}>
          {t("dashboard.accounts.addForexSubtitle")}
        </p>
        <button 
          onClick={() => window.location.href = "/dashboard/accounts"}
          className={s.btnNext}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          {t("dashboard.nav.accounts")}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={s.questionBlock}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <div style={{ 
          background: "rgba(16, 185, 129, 0.1)", 
          padding: "0.5rem", 
          borderRadius: "10px",
          color: "var(--accent-primary)"
        }}>
          <TrendingUp size={24} />
        </div>
        <div>
          <h2 className={s.questionTitle} style={{ margin: 0 }}>{t("dashboard.accounts.addForexTitle")}</h2>
          <p className={s.questionDesc} style={{ margin: 0, marginTop: "0.25rem" }}>
            {t("dashboard.accounts.addForexSubtitle")}
          </p>
        </div>
      </div>

      <div className={s.divider} />

      <div className={s.fieldGroup}>
        <label className={s.label}>{t("dashboard.accounts.fields.broker")}</label>
        <select 
          className={s.select}
          value={form.broker}
          onChange={(e) => update({ broker: e.target.value })}
        >
          <option value="Tickmill">Tickmill</option>
        </select>
        {errors.broker && <p className={s.errorMsg}><AlertCircle size={12} /> {errors.broker}</p>}
      </div>

      <div className={s.fieldGroup}>
        <label className={s.label}>{t("dashboard.accounts.fields.login")}</label>
        <input 
          className={`${s.input} ${errors.login ? s.inputError : ""}`}
          type="text"
          placeholder="1234567"
          value={form.login}
          onChange={(e) => update({ login: e.target.value })}
        />
        {errors.login && <p className={s.errorMsg}><AlertCircle size={12} /> {errors.login}</p>}
      </div>

      <div className={s.fieldGroup}>
        <label className={s.label}>{t("dashboard.accounts.fields.password")}</label>
        <div className={s.inputWrapper}>
          <input 
            className={`${s.input} ${errors.password ? s.inputError : ""}`}
            type={showPassword ? "text" : "password"}
            placeholder="******"
            value={form.password}
            onChange={(e) => update({ password: e.target.value })}
          />
          <button 
            type="button"
            className={s.inputIcon}
            onClick={() => setShowPassword(!showPassword)}
            style={{ background: "none", border: "none" }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className={s.errorMsg}><AlertCircle size={12} /> {errors.password}</p>}
      </div>

      <div className={s.fieldGroup}>
        <label className={s.label}>{t("dashboard.accounts.fields.server")}</label>
        <input 
          className={`${s.input} ${errors.server ? s.inputError : ""}`}
          type="text"
          placeholder="Tickmill-Live02"
          value={form.server}
          onChange={(e) => update({ server: e.target.value })}
        />
        {errors.server && <p className={s.errorMsg}><AlertCircle size={12} /> {errors.server}</p>}
      </div>

      <div className={s.fieldGroup}>
        <label className={s.label}>{t("dashboard.accounts.fields.robot")}</label>
        <div style={{ position: "relative" }}>
          <select 
            className={s.select}
            value={form.robot}
            onChange={(e) => update({ robot: e.target.value })}
          >
            <option value="ForexZeka">ForexZeka</option>
          </select>
          <Bot size={16} style={{ position: "absolute", right: "2.5rem", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
        </div>
        {errors.robot && <p className={s.errorMsg}><AlertCircle size={12} /> {errors.robot}</p>}
      </div>

      <div style={{
        marginTop: "1rem",
        padding: "1rem",
        background: "rgba(16, 185, 129, 0.05)",
        border: "1px solid rgba(16, 185, 129, 0.15)",
        borderRadius: "12px",
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start"
      }}>
        <Shield size={18} style={{ color: "var(--accent-primary)", flexShrink: 0, marginTop: "2px" }} />
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
          {t("dashboard.accounts.securityNote")}
        </p>
      </div>

      <div className={s.nav} style={{ borderTop: "none", marginTop: "1rem" }}>
        <button 
          type="button" 
          className={s.btnBack}
          onClick={() => window.history.back()}
        >
          {t("wizard.back")}
        </button>
        <button 
          type="submit" 
          className={s.btnNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("wizard.submitting") : t("dashboard.accounts.fields.save")}
          {!isSubmitting && <ArrowRight size={16} />}
        </button>
      </div>
    </form>
  );
}
