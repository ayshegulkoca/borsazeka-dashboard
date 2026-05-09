"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, Globe, MapPin,
  Users, Lock, Bot, CheckCircle2, Send, ExternalLink,
  Shield, TrendingUp, Target, Activity, Zap, Coins, Route,
} from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { useSession, signIn } from "next-auth/react";
import { getPrefilledStripeLink } from "@/lib/stripe";
import {
  ROBOTS,
  getBudgetOptionsForRobot,
  calcPriceForRobot,
  type Market,
  type ManagementType,
  type RobotId,
  type RobotDefinition,
  type BudgetOption,
  type PricingResult,
} from "@/src/data/products";
import { assignRobotAfterPurchase, markSubscriptionPending } from "@/app/actions/robots";

import s from "./wizard.module.css";

// --- Types --------------------------------------------------------------------
interface WState {
  step: number;
  market: Market | null;
  subMarket: Market | null;
  managementType: ManagementType | null;
  robotId: RobotId | null;
  budgetValue: number | null;
  budgetLabel: string | null;
  budgetCurrency: "TRY" | "USD";
  selectedBudgetComingSoon: boolean;
  /** Güvenlik: localStorage kaydedilirken hangi kullanıcıya ait olduğu */
  userId?: string | null;
}

const TOTAL = 6;

// --- localStorage helpers ----------------------------------------------------
const STORAGE_KEY = "borsazeka_wizard_state";

const DEFAULT_STATE: WState = {
  step: 1, market: null, subMarket: null, managementType: null,
  robotId: null, budgetValue: null, budgetLabel: null,
  budgetCurrency: "TRY", selectedBudgetComingSoon: false, userId: null,
};

/** localStorage'dan state yükler. Parse hatası veya veri yoksa default döner. */
function loadFromStorage(): WState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as WState;
    // Temel alan kontrolü — bozuk veriyi reddet
    if (typeof parsed.step !== "number" || parsed.step < 1 || parsed.step > TOTAL) {
      return DEFAULT_STATE;
    }
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
}

/** Mevcut state'i localStorage'a yazar. */
function saveToStorage(state: WState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Depolama dolu veya private mod — sessizce geç
  }
}

/** Wizard tamamlandığında geçici veriyi sil. */
function clearStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

// --- Main --------------------------------------------------------------------
export default function WizardPage() {
  const { t } = useTranslation("common");
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  // --- State - lazy initializer localStorage'dan hidrate eder -----------------
  const [state, setState] = useState<WState>(() => loadFromStorage());
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyDone, setNotifyDone] = useState(false);
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const STEP_LABELS = [
    t("wizard.market"),
    t("wizard.subMarket"),
    t("wizard.management"),
    t("wizard.robot"),
    t("wizard.budget"),
    t("wizard.summary")
  ];
  const [submitDone, setSubmitDone] = useState(false);

  // ── Güvenlik: session yüklendiğinde userId eşleşmesini kontrol et ───────────
  useEffect(() => {
    if (!session?.user) return;
    const userId = session.user.id ?? session.user.email ?? null;
    const saved = loadFromStorage();
    if (!saved.userId || saved.userId === userId) {
      // Aynı kullanıcı veya misafir kayıt → userId'yi güncelle, state'i koru
      setState(prev => ({ ...prev, userId }));
    } else {
      // Farklı kullanıcı → önceki veriyi temizle ve sıfırla
      clearStorage();
      setState({ ...DEFAULT_STATE, userId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, session?.user?.email]);

  // ── Otomatik kayıt: her state değişiminde localStorage'a yaz ────────────────
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const patch = useCallback((p: Partial<WState>) => setState(prev => ({ ...prev, ...p })), []);

  // ── Pre-select robot from URL query param (?robot=DARKROOM) ─────────────────
  useEffect(() => {
    const robotParam = searchParams.get("robot") as RobotId | null;
    if (!robotParam) return;
    const found = ROBOTS.find(r => r.id === robotParam);
    if (!found) return;

    // Determine market and management from robot definition
    const market = found.market;
    const subMarket = found.market;
    const managementType = found.managementType;
    const budgetCurrency: "TRY" | "USD" = (market === "BIST") ? "TRY" : "USD";

    // Jump to budget step (5) with pre-fills
    patch({
      market,
      subMarket,
      managementType,
      robotId: robotParam,
      budgetCurrency,
      budgetValue: null,
      budgetLabel: null,
      step: 5,
    });
  }, [searchParams, patch]);

  // ── can proceed? ────────────────────────────────────────────────────────────
  const canNext = () => {
    if (state.step === 1) return state.market !== null;
    if (state.step === 2) return state.subMarket !== null;
    if (state.step === 3) return state.managementType !== null;
    if (state.step === 4) return state.robotId !== null;
    if (state.step === 5) return state.robotId === "CLASSIC" || state.budgetValue !== null;
    return true;
  };

  const goNext = useCallback(() => {
    if (!canNext()) return;
    // BIST → skip sub-market, go to management
    if (state.step === 1 && state.market === "BIST") { patch({ subMarket: "BIST", step: 3 }); return; }
    // FOREX → skip management step (always Premium), go to robot selection
    if (state.step === 2 && state.subMarket === "FOREX") { patch({ managementType: "PREMIUM", step: 4 }); return; }
    patch({ step: state.step + 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const goBack = () => {
    if (state.step === 3 && state.market === "BIST") { patch({ step: 1 }); return; }
    // Forex: step 4 → back to step 2 (skip management model step)
    if (state.step === 4 && state.subMarket === "FOREX") { patch({ step: 2 }); return; }
    // If at summary step and robot is comingSoon, go back to robot selection (skip budget step)
    if (state.step === 6 && selectedRobot?.comingSoon) { patch({ step: 4 }); return; }
    if (state.step === 6 && state.robotId === "CLASSIC") { patch({ step: 4 }); return; }
    patch({ step: state.step - 1 });
  };

  // ── Auto-advance helper ─────────────────────────────────────────────────────
  const autoAdvance = (updates: Partial<WState>) => {
    setState(prev => ({ ...prev, ...updates }));
    setTimeout(() => {
      setState(prev => {
        const next = prev.step + 1;
        // Special shortcuts
        const isBIST = updates.market === "BIST" && prev.step === 1;
        const isForex = updates.subMarket === "FOREX" && prev.step === 2;
        const nextStep = isBIST ? 3 : isForex ? 4 : next;
        const extraForex = isForex ? { managementType: "PREMIUM" as ManagementType } : {};
        return { ...prev, ...updates, ...extraForex, step: nextStep };
      });
    }, 220);
  };

  // ── derived ─────────────────────────────────────────────────────────────────
  const mkt = state.subMarket ?? state.market;
  const availableRobots = ROBOTS.filter(r =>
    r.market === mkt && r.managementType === state.managementType
  );
  const budgetOptions: BudgetOption[] = getBudgetOptionsForRobot(state.robotId);
  const selectedRobot = ROBOTS.find(r => r.id === state.robotId);

  const pricing: PricingResult | null =
    state.robotId === "CLASSIC" ? calcPriceForRobot("CLASSIC", 0)
    : state.robotId && state.budgetValue !== null ? calcPriceForRobot(state.robotId, state.budgetValue)
    : null;

  const isPaymentBlocked =
    (selectedRobot?.paymentBlocked ?? false) ||
    state.selectedBudgetComingSoon ||
    (pricing?.isComingSoon ?? false);

  // ── submit (Stripe ödeme / iletişim yönlendirmesi) ────────────────────────
  const handleSubmit = async () => {
    if (submitting || isPaymentBlocked) return;
    setSubmitting(true);

    const payload = {
      event: "wizard_payment_intent",
      market: state.market,
      subMarket: state.subMarket,
      managementType: state.managementType,
      robotId: state.robotId,
      robotName: selectedRobot ? t(selectedRobot.nameKey) : state.robotId,
      budgetValue: state.budgetValue ?? 0,
      budgetCurrency: state.budgetCurrency,
      budgetLabel: state.budgetLabel,
      pricing: pricing
        ? {
            serverCostEUR: pricing.serverCostEUR,
            profitSharePercent: pricing.profitSharePercent,
            totalMonthlyCostEUR: pricing.totalMonthlyCostEUR,
            stripeLink: pricing.stripeLink,
          }
        : null,
      timestamp: new Date().toISOString(),
    };

    try {
      // 1. n8n webhook'una önce gönder
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch {
          console.warn("n8n webhook failed, proceeding to Stripe");
        }
      }

      // 2. Dahili lead kaydı (non-blocking)
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});

      // 3. Stripe yönlendirmesi
      if (pricing?.stripeLink && !isPaymentBlocked) {
        // Oturum açılmamışsa giriş sayfasına yönlendir, sonra buraya geri dön
        if (!session?.user?.email) {
          signIn("google", { callbackUrl: window.location.href });
          return;
        }

        // Oturum açılmışsa e-posta bilgisini Stripe linkine ekle
        const finalLink = getPrefilledStripeLink(pricing.stripeLink, session.user.email);
        
        // --- SYNC START ---
        // Mark as PENDING so dashboard can show "checking payment" state
        if (state.robotId) {
          try {
            setRedirecting(true); // Show redirecting state
            const res = await markSubscriptionPending(state.robotId);
            if (!res.success) throw new Error("Server action failed");
          } catch (e) {
            console.warn("DB assignment error:", e);
          }
        }
        // --- SYNC END ---

        // Stripe'a geçmeden önce wizard state'ini temizle (ödeme sonrası sıfır başlangıç)
        clearStorage();
        // Give a tiny moment for DB state to propagate before browser leaves the page
        setTimeout(() => {
          window.location.href = finalLink;
        }, 300);
        return;

      }

      // Stripe linki yoksa (İletişim/Manual flow)
      clearStorage(); // Tamamlandı → temizle
      setSubmitDone(true);
    } catch (err) {
      console.error("Submit error:", err);
      clearStorage(); // Hata da olsa wizard bitti sayılır
      setSubmitDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Ön Kayıt — coming soon ürünler için n8n lead toplama ──────────────────
  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || notifySubmitting) return;
    setNotifySubmitting(true);

    const leadPayload = {
      event: "wizard_pre_registration",
      email: notifyEmail,
      market: state.market,
      subMarket: state.subMarket,
      managementType: state.managementType,
      robotId: state.robotId,
      robotName: selectedRobot ? t(selectedRobot.nameKey) : state.robotId,
      budgetLabel: state.budgetLabel,
      timestamp: new Date().toISOString(),
    };

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadPayload),
        }).catch(() => {});
      }
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      }).catch(() => {});
    } finally {
      setNotifySubmitting(false);
      setNotifyDone(true);
    }
  };

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className={s.wizardPage}>
      {/* Top bar */}
      <div className={s.wizardTopBar}>
        <Link href="/" className={s.wizardBackLink}>
          <ArrowLeft size={16} /> {t("wizard.backHome")}
        </Link>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {t("wizard.stepOf", { current: state.step, total: TOTAL })}
        </span>
      </div>

      {/* Header & Stepper (Steps 1-5) */}
      {state.step < 6 && (
        <>
          <div className={s.wizardHeader}>
            <h1 className={s.wizardTitle}>{t("wizard.title")}</h1>
            <p className={s.wizardSubtitle}>{t("wizard.subtitle")}</p>
          </div>

          <div className={s.stepper}>
            <div className={s.stepperTrack}>
              {STEP_LABELS.map((label, idx) => {
                const n = idx + 1;
                const active = n === state.step;
                const done = n < state.step;
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", flex: n < TOTAL ? "none" : "0" }}>
                    <div className={s.stepperItem}>
                      <div className={`${s.stepperCircle} ${active ? s.stepperCircleActive : ""} ${done ? s.stepperCircleDone : ""}`}>
                        {done ? <Check size={14} /> : n}
                      </div>
                      <span className={s.stepperLabel}>{label}</span>
                    </div>
                    {n < TOTAL && (
                      <div className={`${s.stepperConnector} ${done ? s.stepperConnectorFilled : ""}`}
                        style={{ width: "100%", minWidth: "2rem", flex: 1 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Content */}
      {state.step === 6 && !submitDone ? (
        <div className={s.step6Layout}>
          {/* --- Triple-Color Glow Orbs (Moved here to stay behind panels) --- */}
          <span className={s.glowOrbBlue}   aria-hidden="true" />
          <span className={s.glowOrbPurple} aria-hidden="true" />
          <span className={s.glowOrbPink}   aria-hidden="true" />

          <div className={s.step6Header}>
            <div>
              <span className={s.stepTag}>{t("wizard.stepOf", { current: state.step, total: TOTAL })}</span>
              <h2 className={s.stepTitle}>{t("wizard.step6.title")}</h2>
            </div>
            <button className={s.btnWizardBack} onClick={goBack} id="wizard-back-btn">
              <ArrowLeft size={15} /> {t("wizard.back")}
            </button>
          </div>

          <div className={s.step6Content}>
            {/* Left: Robot Details Box (Glass Theme) */}
            <RobotInfoBox robot={selectedRobot} t={t} variant="glass" />

            {/* Right: Pricing or Coming-soon */}
            <div className={s.priceDetailsPanel}>
              {isPaymentBlocked ? (
                <ComingSoonPanel
                  robot={selectedRobot}
                  notifyEmail={notifyEmail}
                  notifyDone={notifyDone}
                  notifySubmitting={notifySubmitting}
                  onEmailChange={setNotifyEmail}
                  onNotify={handleNotify}
                  t={t}
                />
              ) : pricing ? (
                <>
                  <div className={s.summaryTitle}>{t("wizard.step6.title")}</div>

                  <div className={s.summaryInfoList}>
                    <div className={s.summaryInfoItem}>
                      <span className={s.summaryInfoLabel}>{t("wizard.step6.summaryRobot")}</span>
                      <span className={s.summaryInfoValue}>{selectedRobot ? t(selectedRobot.nameKey) : ""}</span>
                    </div>
                    <div className={s.summaryInfoItem}>
                      <span className={s.summaryInfoLabel}>{t("wizard.step6.summaryBudget")}</span>
                      <span className={s.summaryInfoValue}>{state.budgetLabel ?? ""}</span>
                    </div>
                    <div className={s.summaryInfoItem}>
                      <span className={s.summaryInfoLabel}>{t("wizard.step6.summaryServer")}</span>
                      <span className={s.summaryInfoValue} style={{ color: "var(--wiz-primary-light)", fontWeight: "bold" }}>
                        €{pricing.serverCostEUR}
                      </span>
                    </div>
                    <div className={s.summaryInfoItem}>
                      <span className={s.summaryInfoLabel}>{t("wizard.step6.paymentDetail")}</span>
                      <span className={s.summaryInfoValue} style={{ color: "var(--wiz-primary-light)", fontWeight: 700 }}>
                        €{pricing.serverCostDisplay} {t("wizard.step6.perMonth")}
                      </span>
                    </div>
                    <div className={s.summaryInfoItem}>
                      <span className={s.summaryInfoLabel}>{t("wizard.step6.summaryProfit")}</span>
                      <span className={s.summaryInfoValue}>
                        {pricing.profitSharePercent > 0 ? `%${pricing.profitSharePercent}` : t("wizard.step6.profitShareNA")}
                      </span>
                    </div>
                  </div>

                  {state.robotId === "KRIPTTOZEKA_SELF" && pricing.annualCostEUR && pricing.annualStripeLink && (
                    <AnnualPlanBox
                      annualCostEUR={pricing.annualCostEUR}
                      annualStripeLink={pricing.annualStripeLink}
                      userEmail={session?.user?.email ?? ""}
                    />
                  )}

                  <div className={s.summaryDivider} style={{ margin: "1.5rem 0" }} />

                  <div className={s.summaryTotalRow}>
                    <span className={s.summaryTotalLabel}>{t("wizard.step6.totalMonthly")}</span>
                    <span className={s.summaryTotalValue}>€{pricing.serverCostDisplay} {t("wizard.step6.perMonth")}</span>
                  </div>

                  <p className={s.summaryTerms}>{t("wizard.step6.terms")}</p>

                  <button className={s.btnWizardSubmit}
                    style={{ width: "100%", marginTop: "1rem", justifyContent: "center" }}
                    onClick={handleSubmit} disabled={submitting || redirecting}>
                    {redirecting ? "Stripe'a Yönlendiriliyor..." : submitting ? t("wizard.submitting") : (
                      pricing.stripeLink ? t("wizard.step6.subscribeBtn") : t("wizard.step6.contactBtn")
                    )}
                    {(!submitting && !redirecting) && <ArrowRight size={16} />}
                  </button>

                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", marginTop: "1rem" }}>
                    <Trans
                      i18nKey="wizard.step6.agreementNote"
                      t={t}
                      components={{
                        linkTerms: <Link href="/kullanim-kosullari" style={{ color: "var(--wiz-primary-light)", textDecoration: "underline" }} />,
                        linkPrivacy: <Link href="/gizlilik-politikasi" style={{ color: "var(--wiz-primary-light)", textDecoration: "underline" }} />,
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className={s.outOfRangeWarn}>{t("wizard.step6.outOfRange")}</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={s.stepCard}>
          {/* --- Triple-Color Glow Orbs (z-1, arkada sabit) --- */}
          <span className={s.glowOrbBlue}   aria-hidden="true" />
          <span className={s.glowOrbPurple} aria-hidden="true" />
          <span className={s.glowOrbPink}   aria-hidden="true" />

          <div className={s.stepCardInner}>
            {/* --- Shared top bar: step indicator (left) + back button (right) --- */}
            <div className={s.stepTopBar}>
              <span className={s.stepTag}>
                {t("wizard.stepOf", { current: state.step, total: TOTAL })}
              </span>
              {!submitDone && state.step > 1 && (
                <button className={s.btnWizardBack} onClick={goBack} id="wizard-back-btn">
                  <ArrowLeft size={15} /> {t("wizard.back")}
                </button>
              )}
            </div>

            {/* Success state (Moved inside stepCardInner) */}
            {submitDone && (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                  Talebiniz Alındı!
                </h3>
                <p className={s.wizardSubtitle} style={{ marginBottom: "1.5rem" }}>
                  En kısa sürede Telegram veya e-posta ile size ulaşacağız.
                </p>
                <Link href="/iletisim" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--wiz-primary-light)", fontWeight: 600 }}>
                  İletişim sayfasına git <ArrowRight size={15} />
                </Link>
              </div>
            )}

            {!submitDone && (
              <>
                {/* --- STEP 1 --- */}
                {state.step === 1 && (
                  <>
                    <h2 className={s.stepTitle}>{t("wizard.step1.title")}</h2>
                    <div className={s.optionGrid}>
                      <OptionCard selected={state.market === "BIST"}
                        icon={<MapPin size={22} color="var(--wiz-primary-light)" />}
                        label={t("wizard.step1.domestic")} desc={t("wizard.step1.domesticDesc")}
                        onClick={() => autoAdvance({ market: "BIST", subMarket: "BIST", robotId: null, budgetValue: null, managementType: null })} />
                      <OptionCard selected={state.market === "CRYPTO" || state.market === "FOREX"}
                        icon={<Globe size={22} color="var(--wiz-primary-light)" />}
                        label={t("wizard.step1.international")} desc={t("wizard.step1.internationalDesc")}
                        onClick={() => autoAdvance({ market: "CRYPTO", subMarket: null, robotId: null, budgetValue: null, managementType: null })} />
                    </div>
                  </>
                )}

                {/* --- STEP 2 --- Kripto / Forex 50/50 --- */}
                {state.step === 2 && (
                  <>
                    <h2 className={s.stepTitle}>{t("wizard.step2.title")}</h2>
                    <div className={s.optionGrid50}>
                      <OptionCard selected={state.subMarket === "CRYPTO"}
                        icon={<Bot size={22} color="var(--wiz-primary-light)" />}
                        label={t("wizard.step2.crypto")} desc={t("wizard.step2.cryptoDesc")}
                        onClick={() => autoAdvance({ subMarket: "CRYPTO", market: "CRYPTO", robotId: null, budgetValue: null, budgetCurrency: "USD", managementType: null })} />
                      <OptionCard selected={state.subMarket === "FOREX"}
                        icon={<Globe size={22} color="var(--wiz-primary-light)" />}
                        label={t("wizard.step2.forex")} desc={t("wizard.step2.forexDesc")}
                        onClick={() => autoAdvance({ subMarket: "FOREX", market: "FOREX", robotId: null, budgetValue: null, budgetCurrency: "USD", managementType: null })} />
                    </div>
                  </>
                )}

                {/* --- STEP 3 --- */}
                {state.step === 3 && (
                  <>
                    <h2 className={s.stepTitle}>{t("wizard.step3.title")}</h2>
                    <div className={s.optionGrid}>
                      <OptionCard selected={state.managementType === "PREMIUM"}
                        icon={<Users size={22} color="var(--wiz-primary-light)" />}
                        label={t("wizard.step3.premium")} desc={t("wizard.step3.premiumDesc")}
                        onClick={() => autoAdvance({ managementType: "PREMIUM", robotId: null })} />
                      <OptionCard selected={state.managementType === "SELF_SERVICE"}
                        icon={<Lock size={22} color="var(--wiz-primary-light)" />}
                        label={t("wizard.step3.selfService")} desc={t("wizard.step3.selfServiceDesc")}
                        onClick={() => autoAdvance({ managementType: "SELF_SERVICE", robotId: null })} />
                    </div>
                  </>
                )}

                {/* --- STEP 4 --- */}
                {state.step === 4 && (
                  <>
                    <h2 className={s.stepTitle}>{t("wizard.step4.title")}</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                      {availableRobots.map((robot: RobotDefinition) => (
                        <RobotCard key={robot.id} robot={robot}
                          selected={state.robotId === robot.id} t={t}
                          onClick={() => {
                            const budgetCurrency = robot.market === "BIST" ? "TRY" : "USD";
                            if (robot.comingSoon) {
                              setState(prev => ({
                                ...prev,
                                robotId: robot.id,
                                budgetValue: null,
                                budgetLabel: null,
                                selectedBudgetComingSoon: false,
                                budgetCurrency,
                              }));
                              setTimeout(() => setState(prev => ({ ...prev, step: 6 })), 220);
                              return;
                            }
                            setState(prev => ({
                              ...prev,
                              robotId: robot.id,
                              budgetValue: null,
                              budgetLabel: null,
                              selectedBudgetComingSoon: false,
                              budgetCurrency,
                            }));
                            setTimeout(() => setState(prev => ({ ...prev, step: 5 })), 220);
                          }} />
                      ))}
                    </div>
                  </>
                )}

                {/* --- STEP 5 --- */}
                {state.step === 5 && (
                  <>
                    <h2 className={s.stepTitle}>{t("wizard.step5.title")}</h2>
                    {state.robotId === "CLASSIC" ? (
                      <div style={{ padding: "2rem", textAlign: "center", background: "rgba(29, 49, 74, 0.1)", borderRadius: 16, border: "1px dashed rgba(29, 49, 74, 0.4)" }}>
                        <p style={{ color: "#60a5fa", fontWeight: 600, marginBottom: "0.5rem" }}>
                          Ücretler Yakında Belirlenecek
                        </p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                          BorsaZeka Classic için bütçe aralıkları ve fiyatlandırma modeli lansman öncesi duyurulacaktır.
                        </p>
                      </div>
                    ) : budgetOptions.length === 0 ? (
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                        Bu ürün için bütçe bilgisi gerekmiyor.
                      </p>
                    ) : (
                      <>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
                          {t(state.subMarket === "CRYPTO" ? "wizard.step5.cryptoLabel"
                            : state.subMarket === "FOREX" ? "wizard.step5.forexLabel"
                            : "wizard.step5.bistLabel")}
                        </p>
                        <div className={s.budgetGrid}>
                          {budgetOptions.map((opt: BudgetOption) => (
                            <button key={opt.value}
                              className={`${s.budgetOption}
                                ${state.budgetValue === opt.value ? s.budgetOptionSelected : ""}
                                ${opt.comingSoon ? s.budgetOptionComingSoon : ""}`}
                              disabled={opt.comingSoon}
                              onClick={() => {
                                if (opt.comingSoon) return;
                                setState(prev => ({
                                  ...prev,
                                  budgetValue: opt.value,
                                  budgetLabel: opt.label,
                                  selectedBudgetComingSoon: opt.comingSoon ?? false,
                                }));
                                setTimeout(() => setState(prev => ({ ...prev, step: 6 })), 220);
                              }}>
                              {opt.label}
                              {opt.comingSoon && <span className={s.budgetComingSoonTag}>Yakında</span>}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {!submitDone && state.step === 5 && state.robotId === "CLASSIC" && (
              <div className={s.wizardNav}>
                <div />
                <button className={s.btnWizardNext} onClick={goNext}>
                  {t("wizard.next")} <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- TradeMate Premium Info Panel (Step 6 Left) --------------------------------
function TradematePremiumPanel({ t }: { t: (k: string) => string }) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordion(prev => (prev === key ? null : key));
  };

  // Renders a translated string that may contain <green>, <b>, and <badge> tags
  const renderDesc = (raw: string) => {
    const parts = raw.split(/(<green>|<\/green>|<b>|<\/b>|<badge>|<\/badge>)/);
    const nodes: React.ReactNode[] = [];
    let inGreen = false;
    let inBold = false;
    let inBadge = false;
    parts.forEach((part, i) => {
      if (part === "<green>") { inGreen = true; return; }
      if (part === "</green>") { inGreen = false; return; }
      if (part === "<b>") { inBold = true; return; }
      if (part === "</b>") { inBold = false; return; }
      if (part === "<badge>") { inBadge = true; return; }
      if (part === "</badge>") { inBadge = false; return; }

      if (inGreen) nodes.push(<span key={i} className={s.tmGreen}>{part}</span>);
      else if (inBold) nodes.push(<strong key={i}>{part}</strong>);
      else if (inBadge) nodes.push(<span key={i} className={s.tmBadge}>{part}</span>);
      else nodes.push(part);
    });
    return <>{nodes}</>;
  };

  return (
    <div className={s.robotDetailsBoxGlass + " " + s.tmPremiumPanel}>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className={s.tmHeader}>
        <div className={s.tmIconGlow}>
          <Target size={32} />
        </div>
        <div>
          <h2 className={s.tmTitle}>TradeMate Premium</h2>
          <p className={s.tmSlogan}>{t("wizard.step6.trademate.slogan")}</p>
        </div>
      </div>

      {/* ── Highlight Cards ────────────────────────────────────────── */}
      <div className={s.tmHighlights}>
        <div className={s.tmHighlightCard}>{t("wizard.step6.trademate.h1")}</div>
        <div className={s.tmHighlightCard}>{t("wizard.step6.trademate.h2")}</div>
        <div className={s.tmHighlightCard}>{t("wizard.step6.trademate.h3")}</div>
      </div>

      {/* ── Accordion System ───────────────────────────────────────── */}
      <div className={s.tmAccordionList}>

        {/* Accordion 1: Strategy */}
        <div className={s.tmAccordionItem}>
          <button
            className={s.tmAccordionTrigger}
            onClick={() => toggleAccordion("strategy")}
            aria-expanded={openAccordion === "strategy"}
          >
            <span>{t("wizard.step6.trademate.strategyTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "strategy" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "strategy" && (
            <div className={s.tmAccordionBody}>
              <p className={s.tmAccordionText}>{renderDesc(t("wizard.step6.trademate.strategyP1"))}</p>
              <p className={s.tmAccordionText}>{renderDesc(t("wizard.step6.trademate.strategyP2"))}</p>
              <ul className={s.tmFeatureList}>
                {(["s1","s2","s3","s4","s5"] as const).map(k => (
                  <li key={k}><CheckCircle2 size={14} className={s.tmCheck} /><span>{t(`wizard.step6.trademate.${k}`)}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Accordion 2: Risk Management */}
        <div className={s.tmAccordionItem}>
          <button
            className={s.tmAccordionTrigger}
            onClick={() => toggleAccordion("risk")}
            aria-expanded={openAccordion === "risk"}
          >
            <span>{t("wizard.step6.trademate.riskTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "risk" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "risk" && (
            <div className={s.tmAccordionBody}>
              <ul className={s.tmFeatureList}>
                {(["r1","r2","r3","r4","r5","r6","r7"] as const).map(k => (
                  <li key={k}><CheckCircle2 size={14} className={s.tmCheck} /><span>{t(`wizard.step6.trademate.${k}`)}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Accordion 3: Terms */}
        <div className={s.tmAccordionItem}>
          <button
            className={s.tmAccordionTrigger}
            onClick={() => toggleAccordion("terms")}
            aria-expanded={openAccordion === "terms"}
          >
            <span>{t("wizard.step6.trademate.termsTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "terms" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "terms" && (
            <div className={s.tmAccordionBody}>
              <p className={s.tmTermsNote}>{t("wizard.step6.trademate.termsNote")}</p>
              <ol className={s.tmTermsList}>
                {(["t1","t2","t3","t4","t5","t6","t7","t8","t9","t10","t11","t12","t13"] as const).map(k => (
                  <li key={k}>
                    <div>
                      <strong>{t(`wizard.step6.trademate.${k}Title`)}</strong>
                      <p>{renderDesc(t(`wizard.step6.trademate.${k}Desc`))}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// --- Highway Premium Info Panel (Step 6 Left) ---------------------------------
function HighwayPremiumPanel({ t }: { t: (k: string) => string }) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordion(prev => (prev === key ? null : key));
  };

  const renderDesc = (raw: string) => {
    const parts = raw.split(/(<green>|<\/green>|<b>|<\/b>|<badge>|<\/badge>)/);
    const nodes: React.ReactNode[] = [];
    let inGreen = false;
    let inBold = false;
    let inBadge = false;
    parts.forEach((part, i) => {
      if (part === "<green>") { inGreen = true; return; }
      if (part === "</green>") { inGreen = false; return; }
      if (part === "<b>") { inBold = true; return; }
      if (part === "</b>") { inBold = false; return; }
      if (part === "<badge>") { inBadge = true; return; }
      if (part === "</badge>") { inBadge = false; return; }

      if (inGreen) nodes.push(<span key={i} className={s.tmGreen}>{part}</span>);
      else if (inBold) nodes.push(<strong key={i}>{part}</strong>);
      else if (inBadge) nodes.push(<span key={i} className={s.tmBadge}>{part}</span>);
      else nodes.push(part);
    });
    return <>{nodes}</>;
  };

  return (
    <div className={s.robotDetailsBoxGlass + " " + s.tmPremiumPanel}>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className={s.tmHeader}>
        <div className={s.tmIconGlowBlue}>
          <TrendingUp size={32} />
        </div>
        <div>
          <h2 className={s.tmTitle} style={{ color: "#fff" }}>Highway Premium</h2>
          <p className={s.tmSlogan}>{t("wizard.step6.highway.slogan")}</p>
        </div>
      </div>

      {/* ── Highlight Cards ────────────────────────────────────────── */}
      <div className={s.tmHighlights}>
        <div className={s.tmHighlightCard}>{t("wizard.step6.highway.h1")}</div>
        <div className={s.tmHighlightCard}>{t("wizard.step6.highway.h2")}</div>
        <div className={s.tmHighlightCard}>{t("wizard.step6.highway.h3")}</div>
      </div>

      {/* ── Accordion System ───────────────────────────────────────── */}
      <div className={s.tmAccordionList}>

        {/* Accordion 1: Foundation */}
        <div className={s.tmAccordionItem}>
          <button
            className={s.tmAccordionTrigger}
            onClick={() => toggleAccordion("strategy")}
            aria-expanded={openAccordion === "strategy"}
          >
            <span>{t("wizard.step6.highway.strategyTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "strategy" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "strategy" && (
            <div className={s.tmAccordionBody}>
              <p className={s.tmAccordionText}>{renderDesc(t("wizard.step6.highway.strategyP1"))}</p>
              <p className={s.tmAccordionText}>{renderDesc(t("wizard.step6.highway.strategyP2"))}</p>
            </div>
          )}
        </div>

        {/* Accordion 2: Logic */}
        <div className={s.tmAccordionItem}>
          <button
            className={s.tmAccordionTrigger}
            onClick={() => toggleAccordion("logic")}
            aria-expanded={openAccordion === "logic"}
          >
            <span>{t("wizard.step6.highway.logicTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "logic" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "logic" && (
            <div className={s.tmAccordionBody}>
              <ul className={s.tmFeatureList}>
                {(["l1", "l2", "l3", "l4"] as const).map(k => (
                  <li key={k}><CheckCircle2 size={14} className={s.tmCheck} /><span>{t(`wizard.step6.highway.${k}`)}</span></li>
                ))}
              </ul>
              <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.5rem", color: "#3b82f6" }}>
                  {t("wizard.step6.highway.exitTitle")}
                </p>
                <ul className={s.tmFeatureList}>
                  {(["e1", "e2", "e3", "e4"] as const).map(k => (
                    <li key={k}><CheckCircle2 size={14} className={s.tmCheck} /><span>{t(`wizard.step6.highway.${k}`)}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Terms */}
        <div className={s.tmAccordionItem}>
          <button
            className={s.tmAccordionTrigger}
            onClick={() => toggleAccordion("terms")}
            aria-expanded={openAccordion === "terms"}
          >
            <span>{t("wizard.step6.highway.termsTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "terms" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "terms" && (
            <div className={s.tmAccordionBody}>
              <div className={s.tmRedLine}>
                {t("wizard.step6.highway.redLine")}
              </div>
              <p className={s.tmTermsNote}>{t("wizard.step6.highway.termsNote")}</p>
              <ol className={s.tmTermsList}>
                {(["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12", "t13", "t14", "t15"] as const).map(k => (
                  <li key={k}>
                    <div>
                      <strong>{t(`wizard.step6.highway.${k}Title`)}</strong>
                      <p>{renderDesc(t(`wizard.step6.highway.${k}Desc`))}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// --- KriptoZeka Premium Info Panel (Step 6 Left) ------------------------------
function KriptozekaPremiumPanel({ t }: { t: (k: string) => string }) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const toggleAccordion = (key: string) => setOpenAccordion(prev => (prev === key ? null : key));

  const renderDesc = (raw: string) => {
    const parts = raw.split(/(<green>|<\/green>|<b>|<\/b>|<badge>|<\/badge>)/);
    const nodes: React.ReactNode[] = [];
    let inGreen = false, inBold = false, inBadge = false;
    parts.forEach((part, i) => {
      if (part === "<green>") { inGreen = true; return; }
      if (part === "</green>") { inGreen = false; return; }
      if (part === "<b>") { inBold = true; return; }
      if (part === "</b>") { inBold = false; return; }
      if (part === "<badge>") { inBadge = true; return; }
      if (part === "</badge>") { inBadge = false; return; }

      if (inGreen) nodes.push(<span key={i} className={s.tmGreen}>{part}</span>);
      else if (inBold) nodes.push(<strong key={i}>{part}</strong>);
      else if (inBadge) nodes.push(<span key={i} className={s.tmBadge}>{part}</span>);
      else nodes.push(part);
    });
    return <>{nodes}</>;
  };

  return (
    <div className={s.robotDetailsBoxGlass + " " + s.tmPremiumPanel}>
      <div className={s.tmHeader}>
        <div className={s.tmIconGlowOrange}>
          <Coins size={32} />
        </div>
        <div>
          <h2 className={s.tmTitle} style={{ color: "#fff" }}>KriptoZeka Premium</h2>
          <p className={s.tmSlogan}>{t("wizard.step6.kriptozeka.slogan")}</p>
        </div>
      </div>

      <div className={s.tmHighlights}>
        <div className={s.tmHighlightCard}>{t("wizard.step6.kriptozeka.h1")}</div>
        <div className={s.tmHighlightCard}>{t("wizard.step6.kriptozeka.h2")}</div>
        <div className={s.tmHighlightCard}>{t("wizard.step6.kriptozeka.h3")}</div>
      </div>

      <div className={s.tmAccordionList}>
        {/* Accordion 1: Foundation */}
        <div className={s.tmAccordionItem}>
          <button className={s.tmAccordionTrigger} onClick={() => toggleAccordion("strategy")} aria-expanded={openAccordion === "strategy"}>
            <span>{t("wizard.step6.kriptozeka.strategyTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "strategy" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "strategy" && (
            <div className={s.tmAccordionBody}>
              <p className={s.tmAccordionText}>{renderDesc(t("wizard.step6.kriptozeka.strategyP1"))}</p>
              <p className={s.tmAccordionText}>{renderDesc(t("wizard.step6.kriptozeka.strategyP2"))}</p>
            </div>
          )}
        </div>

        {/* Accordion 2: Logic */}
        <div className={s.tmAccordionItem}>
          <button className={s.tmAccordionTrigger} onClick={() => toggleAccordion("logic")} aria-expanded={openAccordion === "logic"}>
            <span>{t("wizard.step6.kriptozeka.logicTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "logic" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "logic" && (
            <div className={s.tmAccordionBody}>
              <ul className={s.tmFeatureList}>
                {(["l1", "l2", "l3", "l4"] as const).map(k => (
                  <li key={k}><CheckCircle2 size={14} className={s.tmCheck} /><span>{t(`wizard.step6.kriptozeka.${k}`)}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Accordion 3: Security */}
        <div className={s.tmAccordionItem}>
          <button className={s.tmAccordionTrigger} onClick={() => toggleAccordion("security")} aria-expanded={openAccordion === "security"}>
            <span>{t("wizard.step6.kriptozeka.securityTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "security" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "security" && (
            <div className={s.tmAccordionBody}>
              <ul className={s.tmFeatureList}>
                {(["s1", "s2", "s3", "s4"] as const).map(k => (
                  <li key={k}><Shield size={14} className={s.tmCheck} style={{ color: "#f59e0b" }} /><span>{t(`wizard.step6.kriptozeka.${k}`)}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Accordion 4: Risk Control */}
        <div className={s.tmAccordionItem}>
          <button className={s.tmAccordionTrigger} onClick={() => toggleAccordion("risk")} aria-expanded={openAccordion === "risk"}>
            <span>{t("wizard.step6.kriptozeka.riskTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "risk" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "risk" && (
            <div className={s.tmAccordionBody}>
              <ul className={s.tmFeatureList}>
                {(["r1", "r2", "r3"] as const).map(k => (
                  <li key={k}><Activity size={14} className={s.tmCheck} /><span>{t(`wizard.step6.kriptozeka.${k}`)}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Accordion 5: Terms */}
        <div className={s.tmAccordionItem}>
          <button className={s.tmAccordionTrigger} onClick={() => toggleAccordion("terms")} aria-expanded={openAccordion === "terms"}>
            <span>{t("wizard.step6.kriptozeka.termsTitle")}</span>
            <span className={`${s.tmAccordionArrow} ${openAccordion === "terms" ? s.tmAccordionArrowOpen : ""}`}>▾</span>
          </button>
          {openAccordion === "terms" && (
            <div className={s.tmAccordionBody}>
              <p className={s.tmTermsNote}>{t("wizard.step6.kriptozeka.termsNote")}</p>
              <ol className={s.tmTermsList}>
                {(["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20"] as const).map(k => (
                  <li key={k}>
                    <div>
                      <strong>{t(`wizard.step6.kriptozeka.${k}Title`)}</strong>
                      <p>{renderDesc(t(`wizard.step6.kriptozeka.${k}Desc`))}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- RobotInfoBox -------------------------------------------------------------
function RobotInfoBox({ robot, t, variant = "default" }: { robot?: RobotDefinition; t: any; variant?: "default" | "glass" }) {
  if (!robot) return null;

  // Premium robotlar için özel panel göster
  if (robot.id === "TRADEMATE") {
    return <TradematePremiumPanel t={t} />;
  }
  if (robot.id === "HIGHWAY") {
    return <HighwayPremiumPanel t={t} />;
  }
  if (robot.id === "KRIPTTOZEKA") {
    return <KriptozekaPremiumPanel t={t} />;
  }

  const getIcon = () => {
    switch (robot.id) {
      case "DARKROOM":
      case "DARKROOM_SELF":
        return <Shield size={28} />;
      case "HIGHWAY":
      case "HIGHWAY_SELF":
        return <TrendingUp size={28} />;
      case "TRADEMATE":
      case "TRADEMATE_SELF":
        return <Target size={28} />;
      case "FABRIKA":
      case "FABRIKA_SELF":
        return <Activity size={28} />;
      case "KRIPTTOZEKA":
        return <Coins size={28} />;
      case "KRIPTTOZEKA_ASCENT":
      case "KRIPTTOZEKA_SELF":
        return <Bot size={28} />;
      case "FOREXZEKA":
        return <Globe size={28} />;
      default:
        return <Zap size={28} />;
    }
  };

  const containerClass = variant === "glass" ? s.robotDetailsBoxGlass : s.robotDetailsBox;

  return (
    <div className={containerClass}>
      <div className={s.robotInfoMain}>
        <div className={s.robotIconWrapper}>
          {getIcon()}
        </div>
        <div>
          <h3 className={s.robotNameLarge}>{t(robot.nameKey)}</h3>
          <p className={s.robotDescShort}>{t(robot.descKey)}</p>
        </div>
      </div>

      <div className={s.robotFeaturesList}>
        <h4 className={s.featuresTitle}>{t("wizard.step6.featuresTitle") || "Robot Özellikleri"}</h4>
        <ul>
          {robot.features.map((fKey: string) => (
            <li key={fKey}>
              <CheckCircle2 size={16} color="var(--wiz-primary-light)" style={{ flexShrink: 0 }} />
              <span>{t(fKey)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// --- ComingSoon Panel ---------------------------------------------------------
function ComingSoonPanel({ robot, notifyEmail, notifyDone, notifySubmitting, onEmailChange, onNotify, t }: {
  robot?: RobotDefinition;
  notifyEmail: string;
  notifyDone: boolean;
  notifySubmitting?: boolean;
  onEmailChange: (v: string) => void;
  onNotify: (e: React.FormEvent) => void;
  t: (k: string) => string;
}) {
  return (
    <div className={s.comingSoonBox}>
      <h3 className={s.comingSoonBoxTitle}>{t("wizard.step6.comingSoonTitle")}</h3>
      <p className={s.comingSoonBoxDesc}>{t("wizard.step6.comingSoonDesc")}</p>

      {robot && robot.features.length > 0 && (
        <ul style={{ listStyle: "none", textAlign: "left", marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {robot.features.map((fKey: string) => (
            <li key={fKey} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <Check size={13} color="var(--wiz-primary-light)" /> {t(fKey)}
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <a href="https://t.me/semiharslan" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 0.875rem", borderRadius: 8, background: "rgba(38,165,228,0.1)", border: "1px solid rgba(38,165,228,0.2)", color: "#26a5e4", fontSize: "0.8rem", fontWeight: 600 }}>
          <Send size={13} /> Telegram
        </a>
        <a href="https://www.x.com/DH_Altin" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 0.875rem", borderRadius: 8, background: "rgba(29,155,240,0.1)", border: "1px solid rgba(29,155,240,0.2)", color: "#1d9bf0", fontSize: "0.8rem", fontWeight: 600 }}>
          <ExternalLink size={13} /> Twitter / X
        </a>
      </div>

      {!notifyDone ? (
        <form onSubmit={onNotify} className={s.notifyForm}>
          <input type="email" className={s.notifyInput}
            placeholder={t("wizard.step6.notifyEmail")}
            value={notifyEmail} onChange={e => onEmailChange(e.target.value)} required />
          <button type="submit" className={s.notifyBtn} disabled={notifySubmitting}>
            {notifySubmitting ? t("wizard.submitting") : t("wizard.step6.preRegisterBtn")}
          </button>
        </form>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", color: "var(--wiz-primary-light)", fontWeight: 600, fontSize: "0.875rem" }}>
          <CheckCircle2 size={17} /> Kaydedildi, en kısa sürede haberdar edeceğiz!
        </div>
      )}
    </div>
  );
}

// --- OptionCard ---------------------------------------------------------------
function OptionCard({ selected, icon, label, desc, comingSoon, comingSoonLabel, onClick }: {
  selected: boolean; icon: React.ReactNode; label: string; desc: string;
  comingSoon?: boolean; comingSoonLabel?: string; onClick: () => void;
}) {
  return (
    <div
      className={`${s.optionCard} ${selected ? s.optionCardSelected : ""} ${comingSoon ? s.optionCardComingSoon : ""}`}
      onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}>
      {comingSoon && <span className={s.comingSoonBadge}>{comingSoonLabel}</span>}
      <div className={s.optionCheck}><Check size={12} color="#000000" /></div>
      <div className={s.optionIcon}>{icon}</div>
      <div className={s.optionLabel}>{label}</div>
      <div className={s.optionDesc}>{desc}</div>
    </div>
  );
}

// --- RobotCard ----------------------------------------------------------------
function RobotCard({ robot, selected, t, onClick }: {
  robot: RobotDefinition; selected: boolean;
  t: (k: string) => string; onClick: () => void;
}) {
  return (
    <div
      className={`${s.robotOptionCard} ${selected ? s.optionCardSelected : ""} ${robot.comingSoon ? s.robotCardComingSoon : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{ cursor: "pointer", opacity: 1 }}
      onKeyDown={e => e.key === "Enter" && onClick()}>
      
      <div className={s.robotHeader}>
        <div className={s.robotNameWrap}>
          <span className={s.robotName}>{t(robot.nameKey)}</span>
          <span className={s.robotDesc}>{t(robot.descKey)}</span>
        </div>
        
        {/* Right badges — stacked vertically to prevent overlap */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", flexShrink: 0 }}>
          {selected && !robot.comingSoon && (
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={13} color="#000000" />
            </div>
          )}
          {robot.comingSoon && (
             <span className={s.comingSoonBadge}>{t("wizard.comingSoonBadge")}</span>
          )}
          {robot.maxCapacity > 0 && (
            <span className={s.robotCapacity}>
              {t("wizard.step4.capacity")}: {robot.maxCapacity} {t("wizard.step4.capacityUnit")}
            </span>
          )}
        </div>
      </div>

      <ul className={s.robotFeatures}>
        {robot.features.map((fKey: string) => (
          <li key={fKey}>
            <Check size={13} color={robot.comingSoon ? "#a78bfa" : "var(--accent-primary)"} />
            {t(fKey)}
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- AnnualPlanBox ------------------------------------------------------------
function AnnualPlanBox({
  annualCostEUR,
  annualStripeLink,
  userEmail,
}: {
  annualCostEUR: number;
  annualStripeLink: string;
  userEmail: string;
}) {
  const finalUrl = getPrefilledStripeLink(annualStripeLink, userEmail);
  const monthlySaving = Math.round((annualCostEUR / 8) * 0.33); // ~4 ay bedava = %33 indirim

  return (
    <div
      style={{
        marginTop: "0.875rem",
        padding: "1rem 1.1rem",
        borderRadius: 12,
        background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(109,40,217,0.07) 100%)",
        border: "1px solid rgba(139,92,246,0.35)",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#a78bfa",
            boxShadow: "0 0 8px #a78bfa",
            display: "inline-block",
          }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#c4b5fd", letterSpacing: "0.01em" }}>
            Yıllık Plan — 4 Ay Robot Ücretsiz
          </span>
        </div>
        <span style={{
          fontSize: "0.65rem", fontWeight: 700, padding: "0.18rem 0.55rem",
          borderRadius: "2rem", background: "rgba(139,92,246,0.2)",
          color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)",
          letterSpacing: "0.03em",
        }}>
          EN AVANTAJLI
        </span>
      </div>

      {/* Price row */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
        <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#c4b5fd", lineHeight: 1 }}>
          €{annualCostEUR}
        </span>
        <span style={{ fontSize: "0.75rem", color: "rgba(196,181,253,0.7)", fontWeight: 500 }}>/yıl</span>
        <span style={{
          marginLeft: "0.4rem", fontSize: "0.72rem", color: "#86efac",
          background: "rgba(134,239,172,0.12)", border: "1px solid rgba(134,239,172,0.2)",
          borderRadius: "2rem", padding: "0.12rem 0.5rem", fontWeight: 700,
        }}>
          ~€{monthlySaving}/ay tasarruf
        </span>
      </div>

      <p style={{ margin: 0, fontSize: "0.76rem", color: "rgba(196,181,253,0.75)", lineHeight: 1.5 }}>
        Sunucu ücreti 12 ay · Robot ücreti 8 ay faturalanır. İptal istediğiniz zaman.
      </p>

      {/* CTA Button */}
      <a
        href={finalUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="annual-plan-btn"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.45rem",
          marginTop: "0.25rem",
          padding: "0.8rem 1.2rem",
          borderRadius: 10,
          background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.9rem",
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(139,92,246,0.4), 0 0 0 1px rgba(167,139,250,0.2)",
          transition: "all 0.2s ease",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 30px rgba(139,92,246,0.65), 0 0 0 1px rgba(167,139,250,0.4)";
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(139,92,246,0.4), 0 0 0 1px rgba(167,139,250,0.2)";
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        }}
      >
        ✦ Yıllık Avantajla Satın Al
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}
