"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Database,
  Clock,
  Calendar,
  FileJson,
  RefreshCw,
  HardDrive,
  CheckCircle,
  Send,
  BarChart2,
  Cpu,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import styles from "./veri-setleri.module.css";
import { DATA_PACKAGES } from "./dataPackages";

// ── Icon Map ───────────────────────────────────────────────────
const CARD_ICONS: Record<string, React.ReactNode> = {
  "bist-1min": <BarChart2 size={20} />,
  "bist-daily": <Calendar size={20} />,
  "bist-custom": <Database size={20} />,
};

const USE_CASE_ICONS = [
  <TrendingUp size={14} />,
  <Cpu size={14} />,
  <BookOpen size={14} />,
];

// ── VeriSetleriDetay ───────────────────────────────────────────
export default function VeriSetleriDetay({ id }: { id: string }) {
  const { t, i18n } = useTranslation("common");
  const isTR = i18n.language?.startsWith("tr");

  const pkg = DATA_PACKAGES.find((p) => p.id === id);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    purpose: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!pkg) {
    return (
      <div className={styles.pageShell}>
        <div className={styles.notFound}>
          <Database size={48} style={{ color: "#94a3b8" }} />
          <div className={styles.notFoundTitle}>{t("dataSets.packageNotFound")}</div>
          <div className={styles.notFoundText}>
            {isTR ? "Aradığınız veri paketi mevcut değil." : "The requested data package does not exist."}
          </div>
          <Link href="/veri-setleri" className={styles.backLink}>
            {t("dataSets.backToList")}
          </Link>
        </div>
      </div>
    );
  }

  const techSpecs = isTR ? pkg.techSpecsTR : pkg.techSpecsEN;
  const useCases = isTR ? pkg.useCasesTR : pkg.useCasesEN;

  // ── Form Handlers ──────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = isTR ? "Ad soyad zorunludur" : "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = isTR ? "Geçerli e-posta giriniz" : "Please enter a valid email";
    if (!form.purpose) e.purpose = isTR ? "Kullanım amacı seçiniz" : "Please select a use case";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    // Mock submission — replace with real API endpoint later
    await new Promise((r) => setTimeout(r, 1200));
    console.log("[VeriSetleri] Talep Formu:", {
      package: pkg.id,
      ...form,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className={styles.pageShell}>
      {/* ── Detail Hero ── */}
      <section className={styles.detailHero}>
        <div className={styles.detailHeroInner}>
          <Link href="/veri-setleri" className={styles.backLink}>
            <ArrowLeft size={14} />
            {t("dataSets.backToList")}
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div className={styles.cardIconWrap} style={{ width: 44, height: 44 }}>
              {CARD_ICONS[pkg.id]}
            </div>
            <div className={styles.cardBadge}>
              <Database size={10} />
              {t("dataSets.packageBadge")}
            </div>
          </div>

          <h1 className={styles.detailHeroTitle}>
            {isTR ? pkg.titleTR : pkg.titleEN}
          </h1>
          <p className={styles.detailHeroSubtitle}>
            {isTR ? pkg.descriptionTR : pkg.descriptionEN}
          </p>
        </div>
      </section>

      {/* ── Detail Body ── */}
      <div className={styles.detailBody}>
        {/* ── Left: Specs + Use Cases ── */}
        <div className={styles.detailSpecs}>
          {/* Technical Specs */}
          <div className={styles.detailSection}>
            <div className={styles.detailSectionHead}>
              <FileJson size={16} />
              {t("dataSets.techSpecsTitle")}
            </div>
            <div className={styles.detailSpecTable}>
              {techSpecs.map((spec, i) => (
                <div key={i} className={styles.detailSpecRow}>
                  <span className={styles.detailSpecKey}>{spec.key}</span>
                  <span className={styles.detailSpecVal}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className={styles.detailSection}>
            <div className={styles.detailSectionHead}>
              <CheckCircle size={16} />
              {isTR ? "Paket Özellikleri" : "Package Features"}
            </div>
            <div className={styles.useCaseList}>
              {(isTR ? pkg.featuresTR : pkg.featuresEN).map((f, i) => (
                <div key={i} className={styles.useCaseItem}>
                  <div className={styles.useCaseIcon}>
                    <CheckCircle size={12} style={{ color: "#16a34a" }} />
                  </div>
                  <span className={styles.useCaseText}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className={styles.detailSection}>
            <div className={styles.detailSectionHead}>
              <TrendingUp size={16} />
              {t("dataSets.useCasesTitle")}
            </div>
            <div className={styles.useCaseList}>
              {useCases.map((uc, i) => (
                <div key={i} className={styles.useCaseItem}>
                  <div className={styles.useCaseIcon}>
                    {USE_CASE_ICONS[i % USE_CASE_ICONS.length]}
                  </div>
                  <div className={styles.useCaseText}>
                    <span className={styles.useCaseBold}>{uc.title}: </span>
                    {uc.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className={styles.formCard}>
          {submitted ? (
            /* Success State */
            <div className={styles.formSuccess}>
              <div className={styles.formSuccessIcon}>
                <CheckCircle size={28} />
              </div>
              <div className={styles.formSuccessTitle}>
                {isTR ? "Talebiniz Alındı!" : "Request Received!"}
              </div>
              <p className={styles.formSuccessText}>
                {t("dataSets.formSuccess")}
              </p>
              <Link href="/veri-setleri" className={styles.backLink}>
                {t("dataSets.backToList")}
              </Link>
            </div>
          ) : (
            /* Form */
            <>
              <div className={styles.formTitle}>{t("dataSets.formTitle")}</div>
              <p className={styles.formSubtitle}>{t("dataSets.formSubtitle")}</p>

              <form onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="ds-name">
                    {t("dataSets.formName")}
                    <span className={styles.formRequiredDot}>*</span>
                  </label>
                  <input
                    id="ds-name"
                    name="name"
                    type="text"
                    className={styles.formInput}
                    placeholder={t("dataSets.formNamePlaceholder")}
                    value={form.name}
                    onChange={handleChange}
                    style={errors.name ? { borderColor: "#ef4444" } : {}}
                  />
                  {errors.name && (
                    <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{errors.name}</span>
                  )}
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="ds-email">
                    {t("dataSets.formEmail")}
                    <span className={styles.formRequiredDot}>*</span>
                  </label>
                  <input
                    id="ds-email"
                    name="email"
                    type="email"
                    className={styles.formInput}
                    placeholder={t("dataSets.formEmailPlaceholder")}
                    value={form.email}
                    onChange={handleChange}
                    style={errors.email ? { borderColor: "#ef4444" } : {}}
                  />
                  {errors.email && (
                    <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{errors.email}</span>
                  )}
                </div>

                {/* Company */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="ds-company">
                    {t("dataSets.formCompany")}
                  </label>
                  <input
                    id="ds-company"
                    name="company"
                    type="text"
                    className={styles.formInput}
                    placeholder={t("dataSets.formCompanyPlaceholder")}
                    value={form.company}
                    onChange={handleChange}
                  />
                </div>

                {/* Purpose */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="ds-purpose">
                    {t("dataSets.formPurpose")}
                    <span className={styles.formRequiredDot}>*</span>
                  </label>
                  <select
                    id="ds-purpose"
                    name="purpose"
                    className={styles.formSelect}
                    value={form.purpose}
                    onChange={handleChange}
                    style={errors.purpose ? { borderColor: "#ef4444" } : {}}
                  >
                    <option value="">
                      {isTR ? "— Seçiniz —" : "— Select —"}
                    </option>
                    <option value="research">{t("dataSets.formPurposeResearch")}</option>
                    <option value="algo">{t("dataSets.formPurposeAlgo")}</option>
                    <option value="backtest">{t("dataSets.formPurposeBacktest")}</option>
                    <option value="other">{t("dataSets.formPurposeOther")}</option>
                  </select>
                  {errors.purpose && (
                    <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{errors.purpose}</span>
                  )}
                </div>

                {/* Message */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="ds-message">
                    {t("dataSets.formMessage")}
                  </label>
                  <textarea
                    id="ds-message"
                    name="message"
                    className={styles.formTextarea}
                    placeholder={t("dataSets.formMessagePlaceholder")}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.formSubmitBtn}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} />
                      {t("dataSets.formSubmitting")}
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      {t("dataSets.formSubmit")}
                    </>
                  )}
                </button>
              </form>

              {/* Reassurance */}
              <p style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "1rem", textAlign: "center", lineHeight: 1.5 }}>
                {isTR
                  ? "Bilgileriniz yalnızca size dönüş yapmak için kullanılır ve üçüncü taraflarla paylaşılmaz."
                  : "Your information is used only to follow up with you and is not shared with third parties."}
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
