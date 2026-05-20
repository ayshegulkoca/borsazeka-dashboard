"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, Globe, MapPin,
  Users, Lock, Bot, CheckCircle2, Send, ExternalLink,
  Shield, TrendingUp, Target, Activity, Zap, Coins, Route, Moon,
  Smartphone, Bell, Settings, BarChart3, Rocket, RotateCcw, Home,
  Bitcoin, ShieldAlert, Cpu, Info,
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
  billingCycle: "monthly" | "annual";
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
  billingCycle: "monthly",
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
    // Step 4+ için market & managementType zorunlu — eksikse sıfırla
    if (parsed.step >= 4 && (!parsed.market || !parsed.managementType)) {
      return DEFAULT_STATE;
    }
    // Step 6 için: comingSoon olmayan robot seçimlerinde budgetValue zorunlu
    // (Önceki setState({ budgetValue, budgetLabel }) bug'ı tarafından bozulmuş state'leri temizle)
    if (parsed.step === 6 && !parsed.robotId) {
      return DEFAULT_STATE;
    }
    return {
      ...DEFAULT_STATE,
      ...parsed,
      billingCycle: parsed.billingCycle || "monthly",
    };
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

// --- Shared Helper Components for Step 6 Panels ------------------------------

/** Bölüm başlığı ve içeriği için standart container */
function Section({ title, icon, children }: { title?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={s.contentSectionUnified}>
      {title && (
        <h3 className={s.contentSectionTitleUnified}>
          {icon && <span style={{ opacity: 0.8 }}>{icon}</span>}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

/** Standart check ikonlu liste */
function Bullets({ items }: { items: string[] }) {
  return (
    <ul className={s.unifiedCheckList}>
      {items.map((item, i) => (
        <li key={i} style={{ alignItems: "flex-start", gap: "0.75rem" }}>
          <CheckCircle2 size={16} style={{ color: "var(--panel-accent)", flexShrink: 0, marginTop: "2px" }} />
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.88rem" }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** i18n metinlerindeki <green>, <b>, <badge> taglerini React node'larına dönüştürür */
function renderDesc(raw: string) {
  if (!raw) return null;
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
    else if (inBold) nodes.push(<strong key={i} style={{ fontWeight: 800 }}>{part}</strong>);
    else if (inBadge) nodes.push(<span key={i} className={s.tmBadge}>{part}</span>);
    else nodes.push(part);
  });
  return <>{nodes}</>;
}

// --- Main --------------------------------------------------------------------
export default function WizardPage() {
  const { t, i18n } = useTranslation("common");
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  // --- State - lazy initializer localStorage'dan hidrate eder ama isLoading ile güvenceye alırız ---
  const [state, setState] = useState<WState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  // Client'da yüklendiğinde (veya back/forward cache'den döndüğünde)
  useEffect(() => {
    // 1. Pageshow Event Listener (BFCache Bypass)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    // 2. Navigation Type Check (Kullanıcı Geri Tuşuyla Gelmişse)
    let isBackNavigation = false;
    try {
      const perfEntries = performance.getEntriesByType("navigation");
      if (perfEntries.length > 0) {
        const navEntry = perfEntries[0] as PerformanceNavigationTiming;
        if (navEntry.type === "back_forward") {
          isBackNavigation = true;
        }
      } else if (performance.navigation && performance.navigation.type === 2) {
        isBackNavigation = true;
      }
    } catch (e) {
      // ignore
    }

    // 3. Persistent Storage Check
    const saved = loadFromStorage();
    if (saved && saved.step > 1) {
      setState(saved);
    }
    
    // Eğer back navigation ise ekranı zorla yenile (Next.js dynamic import hatasını çözer)
    if (isBackNavigation) {
      window.location.reload();
      return; // Reload bitene kadar component mount olmasın
    }

    // Normal yüklendiyse ekranı göster
    setIsLoading(false);

    // popstate yedek olarak
    const handlePopState = () => {
      const stored = loadFromStorage();
      if (stored) setState(stored);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyDone, setNotifyDone] = useState(false);
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  // --- Layout Sync (Step 6) ---------------------------------------------------
  const pricePanelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);

  useEffect(() => {
    if (state.step !== 6 || submitDone) return;
    
    const obs = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // offsetHeight use here if borderBoxSize is not enough, 
        // but entry.borderBoxSize[0].blockSize is standard for height.
        const height = entry.target.getBoundingClientRect().height;
        setPanelHeight(height);
      }
    });
    
    const currentPricePanel = pricePanelRef.current;
    if (currentPricePanel) {
      obs.observe(currentPricePanel);
    }
    
    return () => {
      if (currentPricePanel) obs.unobserve(currentPricePanel);
      obs.disconnect();
    };
  }, [state.step, submitDone]);

  const STEP_LABELS = [
    t("wizard.market"),
    t("wizard.subMarket"),
    t("wizard.management"),
    t("wizard.robot"),
    t("wizard.budget"),
    t("wizard.summary")
  ];

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

    // Jump to step 5 (or step 6 if coming soon) with pre-fills
    const targetStep = found.comingSoon ? 6 : 5;
    patch({
      market,
      subMarket,
      managementType,
      robotId: robotParam,
      budgetCurrency,
      budgetValue: null,
      budgetLabel: null,
      step: targetStep,
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

  const goToStart = useCallback(() => {
    setState(prev => ({
      ...DEFAULT_STATE,
      userId: prev.userId,
    }));
  }, []);

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
    : state.robotId && state.budgetValue !== null ? calcPriceForRobot(state.robotId, state.budgetValue, state.billingCycle)
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
            setupFeeEUR: pricing.setupFeeEUR,
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

        // Give a tiny moment for DB state to propagate before browser leaves the page
        // NOT: localStorage bilerek temizlenmiyor ki kullanıcı "Geri" dönerse 6. adımı görsün
        // Eğer gerekiyorsa manuel saveToStorage yapalım
        saveToStorage(state);
        
        setTimeout(() => {
          // target=_self yerine assign kullanarak redirect atıyoruz
          window.location.assign(finalLink);
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
  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-dark)" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--wiz-primary-light)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={s.wizardPage}>
      {/* Top bar */}
      <div className={s.wizardTopBar}>
        <div className={s.wizardTopBarLeft}>
          <Link href="/" className={s.wizardBackLink}>
            <Home size={15} /> {t("wizard.backHome")}
          </Link>
          {state.step > 1 && !submitDone && (
            <button className={s.btnWizardReset} onClick={goToStart} id="wizard-reset-top">
              <RotateCcw size={15} /> {t("wizard.goToStart")}
            </button>
          )}
        </div>
        <span style={{ 
          fontSize: "0.82rem", 
          fontWeight: 700, 
          color: "var(--wiz-primary-light)", 
          letterSpacing: "0.02em",
          height: "40px",
          display: "flex",
          alignItems: "center"
        }}>
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
              <span className={s.stepTag}>
                {t("wizard.stepOf", {
                  current: selectedRobot?.comingSoon ? 5 : state.step,
                  total: selectedRobot?.comingSoon ? 5 : TOTAL
                })}
              </span>
              <h2 className={s.stepTitle}>
                {selectedRobot?.comingSoon
                  ? (i18n.language === "tr" ? "Geliştirme Aşamasında" : "Under Development")
                  : t("wizard.step6.title")}
              </h2>
            </div>
            <div className={s.navButtonGroup}>
              <button className={s.btnWizardBack} onClick={goBack} id="wizard-back-btn">
                <ArrowLeft size={15} /> {t("wizard.back")}
              </button>
            </div>
          </div>

          <div className={`${s.step6Content} ${selectedRobot?.comingSoon ? s.step6ContentComingSoon : "!items-start"}`}>
            {/* Left: Robot Details Box (Glass Theme) with Internal Scroll */}
            <div className={`flex-[2] max-h-[calc(100vh-250px)] overflow-y-auto pr-4 ${s.customScrollbar}`}>
              <RobotInfoBox robot={selectedRobot} t={t} variant="glass" />
            </div>

            {/* Right Side: Dedicated column that is now static and persistent */}
            <div className={`${s.stickySidebarColumn} !static`}>
              <div className={`${s.priceDetailsPanel} !static !top-auto !mt-0`} ref={pricePanelRef}>
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
                    {(() => {
                      const isTr = i18n.language === "tr";
                      const isAnnual = state.billingCycle === "annual" && !!pricing.annualCostEUR;
                      return (
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
                              <span className={s.summaryInfoLabel}>
                                {isAnnual ? (isTr ? "Yıllık Ücret:" : "Annual Fee:") : t("wizard.step6.summaryServer")}
                              </span>
                              <span className={s.summaryInfoValue} style={{ color: "var(--wiz-primary-light)", fontWeight: "bold" }}>
                                €{pricing.serverCostEUR}
                              </span>
                            </div>
                            <div className={s.summaryInfoItem}>
                              <span className={s.summaryInfoLabel}>{t("wizard.step6.paymentDetail")}</span>
                              <span className={s.summaryInfoValue} style={{ color: "var(--wiz-primary-light)", fontWeight: 700 }}>
                                €{pricing.serverCostDisplay} {isAnnual ? (isTr ? "/ yıllık" : "/ year") : t("wizard.step6.perMonth")}
                              </span>
                            </div>
                            <div className={s.summaryInfoItem}>
                              <span className={s.summaryInfoLabel}>{t("wizard.step6.summaryProfit")}</span>
                              <span className={s.summaryInfoValue}>
                                {pricing.profitSharePercent > 0 ? `%${pricing.profitSharePercent}` : t("wizard.step6.profitShareNA")}
                              </span>
                            </div>

                            {selectedRobot?.managementType !== "SELF_SERVICE" && (
                              <div className={s.summaryInfoItemColumn}>
                                <div className={s.summaryInfoRow}>
                                  <span className={s.summaryInfoLabel}>{t("wizard.step6.setupFee")}</span>
                                  <span className={s.summaryInfoValue} style={{ color: "var(--wiz-primary-light)" }}>€50</span>
                                </div>
                                <div className={s.summaryInfoNote}>
                                  <Info size={12} />
                                  <span>{t("wizard.step6.setupFeeDisclaimer")}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {!isAnnual && state.robotId === "KRIPTTOZEKA_SELF" && pricing.annualCostEUR && pricing.annualStripeLink && (
                            <AnnualPlanBox
                              annualCostEUR={pricing.annualCostEUR}
                              annualStripeLink={pricing.annualStripeLink}
                              userEmail={session?.user?.email ?? ""}
                            />
                          )}

                          <div className={s.summaryDivider} style={{ margin: "1.5rem 0" }} />

                          <div className={s.summaryTotalRow}>
                            <span className={s.summaryTotalLabel}>
                              {isAnnual ? (isTr ? "Yıllık Sabit Maliyet" : "Annual Fixed Cost") : t("wizard.step6.totalMonthly")}
                            </span>
                            <span className={s.summaryTotalValue}>€{pricing.serverCostDisplay} {isAnnual ? (isTr ? "/ yıllık" : "/ year") : t("wizard.step6.perMonth")}</span>
                          </div>
                        </>
                      );
                    })()}

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
                <div className={s.navButtonGroup}>
                  <button className={s.btnWizardBack} onClick={goBack} id="wizard-back-btn">
                    <ArrowLeft size={15} /> {t("wizard.back")}
                  </button>
                </div>
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
                    {availableRobots.length === 0 ? (
                      // Safety fallback: state bozulmuşsa kullanıcıyı bilgilendir
                      <div style={{
                        padding: "2rem",
                        textAlign: "center",
                        background: "rgba(239, 68, 68, 0.07)",
                        borderRadius: 16,
                        border: "1px dashed rgba(239, 68, 68, 0.3)"
                      }}>
                        <p style={{ color: "#f87171", fontWeight: 600, marginBottom: "0.5rem" }}>
                          {t("wizard.step4.noRobots") || "Bu kategori için uygun robot bulunamadı."}
                        </p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: "1rem" }}>
                          {t("wizard.step4.noRobotsHint") || "Lütfen geri dönüp pazar ve yönetim modelini tekrar seçin."}
                        </p>
                        <button
                          className={s.btnWizardBack}
                          onClick={goBack}
                          style={{ margin: "0 auto" }}
                        >
                          ← {t("wizard.back") || "Geri"}
                        </button>
                      </div>
                    ) : (
                      <div className={s.robotGridList} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
                    )}
                  </>
                )}

                {/* --- STEP 5 --- */}
                {state.step === 5 && (
                  <>
                    <h2 className={s.stepTitle}>{t("wizard.step5.title")}</h2>

                    {state.robotId === "KRIPTTOZEKA_SELF" && (
                      <div className={s.billingToggleContainer}>
                        <button
                          type="button"
                          className={`${s.billingToggleButton} ${state.billingCycle === "monthly" ? s.billingToggleButtonActive : ""}`}
                          onClick={() => patch({ billingCycle: "monthly" })}
                        >
                          {t("wizard.step5.monthly")}
                        </button>
                        <button
                          type="button"
                          className={`${s.billingToggleButton} ${state.billingCycle === "annual" ? s.billingToggleButtonActive : ""}`}
                          onClick={() => patch({ billingCycle: "annual" })}
                        >
                          {t("wizard.step5.yearly")}
                          <span className={s.toggleBadge}>{t("wizard.step5.fourMonthsFree")}</span>
                        </button>
                      </div>
                    )}

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
                        <div 
                          className={
                            budgetOptions.length === 2 ? s.optionGrid50 :
                            budgetOptions.length % 3 === 0 ? `${s.optionGrid} ${s.optionGrid3}` :
                            s.optionGrid
                          } 
                          style={{ gap: "1rem", marginBottom: "1.5rem" }}
                        >
                          {budgetOptions.map((opt: BudgetOption) => {
                            const pricing = state.robotId ? calcPriceForRobot(state.robotId, opt.value, state.billingCycle) : null;
                            const isSelected = state.budgetValue === opt.value;
                            const isTr = i18n.language === "tr";
                            
                            const isAnnual = state.billingCycle === "annual" && pricing?.annualCostEUR;
                            const periodText = isAnnual 
                              ? (isTr ? "yıl" : "year") 
                              : (isTr ? "ay" : "month");
                            const costLabel = isAnnual
                              ? (isTr ? "Yıllık Maliyet: " : "Yearly Cost: ")
                              : (isTr ? "Aylık Maliyet: " : "Monthly Cost: ");
                            const serverCost = pricing ? `${pricing.serverCostDisplay}€ / ${periodText}` : "—";
                            const profitShare = pricing && pricing.profitSharePercent > 0 
                              ? (isTr ? `%${pricing.profitSharePercent} kâr paylaşımı` : `%${pricing.profitSharePercent} profit share`)
                              : (isTr ? "Kâr paylaşımı yok" : "No profit share");

                            return (
                              <div
                                key={opt.value}
                                className={`${s.optionCard} ${isSelected ? s.optionCardSelected : ""} ${opt.comingSoon ? s.optionCardDisabled : ""}`}
                                onClick={() => {
                                  if (opt.comingSoon) return;
                                  
                                  setState(prev => ({
                                    ...prev,
                                    budgetValue: opt.value,
                                    budgetLabel: opt.label,
                                    selectedBudgetComingSoon: opt.comingSoon ?? false,
                                  }));

                                  // Auto-advance helper can be used
                                  setTimeout(() => {
                                    setState(prev => ({ ...prev, step: 6 }));
                                  }, 220);
                                }}
                                style={{ 
                                  padding: "1.25rem", 
                                  minHeight: "110px", 
                                  display: "flex", 
                                  flexDirection: "column", 
                                  justifyContent: "center",
                                  alignItems: "flex-start",
                                  textAlign: "left"
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "0.4rem" }}>
                                  <div className={s.optionLabel} style={{ fontWeight: "bold", fontSize: "1.05rem", margin: 0 }}>
                                    {opt.label}
                                  </div>
                                  {pricing?.annualCostEUR && (
                                    <span className={s.discountBadge}>
                                      {t("wizard.step5.fourMonthsFree")}
                                    </span>
                                  )}
                                </div>
                                <div className={s.optionDesc} style={{ fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                                  <span style={{ color: "#fff", fontWeight: 500 }}>
                                    {costLabel}{serverCost}
                                  </span>
                                  <span style={{ color: "var(--wiz-primary-light)" }}>{profitShare}</span>
                                </div>
                                {isSelected && (
                                  <div className={s.optionCheck} style={{ opacity: 1 }}>
                                    <Check size={12} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Setup Fee Note */}
                        {state.managementType === "PREMIUM" && (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            background: "rgba(96, 165, 250, 0.05)",
                            border: "1px solid rgba(96, 165, 250, 0.15)",
                            padding: "0.75rem 1rem",
                            borderRadius: "10px",
                            fontSize: "0.82rem",
                            color: "var(--wiz-primary-light)",
                            marginBottom: "1.5rem"
                          }}>
                            <Info size={16} />
                            <span>
                              {i18n.language === "tr"
                                ? "Not: Tüm kurulumlarda geçerli olan 50 Euro tek seferlik kurulum ücreti mevcuttur."
                                : "Note: A €50 one-time setup fee applies to all configurations."}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {!submitDone && state.step === 5 && (
              <div className={s.wizardNav}>
                <div />
                <button 
                  className={s.btnWizardNext} 
                  onClick={goNext}
                  disabled={state.robotId !== "CLASSIC" && !state.budgetValue}
                  title={!state.budgetValue ? "Lütfen bütçe seçiniz" : ""}
                >
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
  return (
    <div className={s.robotDetailsPanelUnified} style={{ '--panel-accent': '#60a5fa' } as React.CSSProperties}>
      {/* Header */}
      <div className={s.tmHeader}>
        <div className={s.tmIconGlowBlue}><Target size={32} /></div>
        <div>
          <h2 className={`${s.robotNeonTitleUnified} ${s.neonBlue}`}>TradeMate Premium</h2>
          <p className={s.robotSloganUnified}>Büyük portföyler için BorsaZeka ekibi tarafından yönetilen profesyonel portföy yönetim sistemi.</p>
        </div>
      </div>

      {/* Highlights */}
      <div className={s.tmHighlights}>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}><Users size={14} /><span>Ekip Yönetimi</span></div>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}><Shield size={14} /><span>Risk Kontrolü</span></div>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}><span>Portföy Yönetimi</span></div>
      </div>

      <div className={s.flatContentUnified}>

        {/* Giriş */}
        <Section>
          <p className={s.accordionTextUnified}>
            TradeMate Premium, BorsaZeka’nın “at-unut” prensibiyle çalışan gelişmiş portföy yönetim robotunun, uzman ekip kontrolüyle sunulan profesyonel versiyonudur.
          </p>
          <p className={s.accordionTextUnified}>
            Self-Service modelinden farklı olarak TradeMate Premium’da robotun kurulumu, takibi, parametre yönetimi, risk kontrolleri, strateji optimizasyonu ve genel portföy yönetim süreci BorsaZeka ekibi tarafından yürütülür.
          </p>
          <p className={s.accordionTextUnified}>
            TradeMate Premium, kapsamlı risk kontrolü, parçalı işlem algoritmaları, otomatik dengeleme sistemi ve ekip kontrollü strateji yönetimiyle büyük portföyleri kullanıcı müdahalesine gerek kalmadan yönetmek için tasarlanmıştır.
          </p>
        </Section>

        {/* Strateji */}
        <Section title="Stratejinin Temeli" icon={<Zap size={18} />}>
          <p className={s.accordionTextUnified}>
            TradeMate Premium’un çekirdeğinde Overnight stratejisi bulunur. Robot, akşamdan pozisyon açar, ertesi sabah ise gelişmiş algoritmalarla satış işlemlerini gerçekleştirir.
          </p>
          <p className={s.accordionTextUnified}>
            Premium versiyonda bu strateji, BorsaZeka ekibi tarafından düzenli olarak takip edilir ve piyasa koşullarına göre optimize edilir.
          </p>
          <p className={s.accordionTextUnified}>
            İsteğe bağlı olarak gün içi algoritma modu da etkinleştirilebilir. Böylece yatırımcı, hem gece pozisyonlarından hem de seans içi fırsatlardan profesyonel ekip yönetimiyle faydalanabilir.
          </p>
        </Section>

        {/* Çalışma Mantığı */}
        <Section title="Çalışma Mantığı" icon={<Settings size={18} />}>
          <ul className={s.unifiedCheckList}>
            {([
              { label: "Tam Otomasyon:", desc: "Kullanıcının robotu manuel olarak yönetmesine gerek yoktur. TradeMate Premium’un çalışması, takibi ve strateji kontrolü BorsaZeka ekibi tarafından yapılır." },
              { label: "Akıllı Portföy Dağılımı:", desc: "Seçilen hisselere göre portföy otomatik olarak bölünür ve optimum fiyatlardan alım yapılması hedeflenir." },
              { label: "Parçalı İşlem Altyapısı:", desc: "Büyük emirler tahtayı bozmadan, kademeli şekilde gerçekleştirilir." },
              { label: "Ekip Kontrollü Parametre Yönetimi:", desc: "Her hisse için ayrı algoritma parametreleri hesaplanır ve piyasa koşullarına göre takip edilir. Gerekli durumlarda strateji ayarları BorsaZeka ekibi tarafından optimize edilir." },
              { label: "Risk Günlerinde Önlem:", desc: "Kredi riski yüksek günlerde kredili işlemler otomatik olarak sınırlandırılır veya devre dışı bırakılır." },
              { label: "Tatil ve Yarım Gün Takibi:", desc: "Özel takvim algoritması sayesinde tatil ve yarım işlem günlerinde gerekli aksiyonlar kullanıcı müdahalesine gerek kalmadan alınır." },
            ]).map((item, i) => (
              <li key={i} style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                <span style={{ color: "var(--panel-accent)", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {item.label}
                </span>
                <span style={{ paddingLeft: "0", color: "rgba(255,255,255,0.9)" }}>{item.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Risk Yönetimi */}
        <Section title="Risk Yönetimi ve Güvenlik">
          <ul className={s.unifiedCheckList}>
            {([
              { label: "Kara Liste:", desc: "Kullanıcının işlem yapılmasını istemediği hisseler kara listeye eklenebilir. Böylece portföy üzerinde temel kontrol korunur." },
              { label: "Brüt Takas ve Yasaklı Hisseler:", desc: "Brüt takas, kredili işlem yasağı veya olağan dışı fiyat hareketi bildirimi olan hisselerde işlem yapılmaz." },
              { label: "Kredi Kullanımı Kontrolü:", desc: "Toplam portföyün kaç katına kadar kredi kullanılabileceği yatırımcı tercihi ve risk yapısına göre belirlenebilir." },
              { label: "Rezerve Para Yönetimi:", desc: "T+2 döneminde para çekmek isteyen yatırımcı için robotun kullanacağı miktar sınırlandırılabilir ve portföy fonları buna göre yönetilebilir." },
              { label: "Tavan Hisse Algoritması:", desc: "Tavan olan hisselerde özel satış algoritması kullanılarak maksimum kâr hedeflenir." },
              { label: "Ekip Tarafından Risk Takibi:", desc: "TradeMate Premium’da risk yönetimi sadece robot algoritmalarıyla sınırlı değildir. BorsaZeka ekibi, sistemin genel performansını ve risk durumunu düzenli olarak takip eder." },
            ]).map((item, i) => (
              <li key={i} style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.1rem" }}>
                <span style={{ color: "var(--panel-accent)", fontWeight: 700, fontSize: "0.8rem" }}>{item.label}</span>
                <span style={{ paddingLeft: "0.25rem" }}>{item.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="TradeMate Premium ile Neler Yapabilirsin?">
          <Bullets items={[
            "Portföyünü profesyonel ekip yönetimine bırakabilirsin.",
            "Robotun performansını, işlem geçmişini ve kâr zarar durumunu takip edebilirsin.",
            "Kredili işlem katsayısı, kara liste ve kullanılacak bütçe gibi temel tercihleri BorsaZeka ekibiyle koordineli şekilde belirleyebilirsin.",
            "Tüm emirler, güvenli BorsaZeka sunucuları üzerinden BIST’e iletilir.",
            "Kurulum, takip, optimizasyon ve teknik yönetim BorsaZeka ekibi tarafından gerçekleştirilir.",
          ]} />
        </Section>

        {/* Kimler için */}
        <Section title="Kimler İçin Uygundur?">
          <Bullets items={[
            "Büyük portföylere sahip, işlemlerini profesyonel otomasyona bırakmak isteyen yatırımcılar",
            "Robot yönetimi, parametre takibi ve teknik detaylarla uğraşmak istemeyen kullanıcılar",
            "Portföy yönetiminde veri temelli karar sistemlerine güvenen profesyonel yatırımcılar",
            "Günlük takip yapmak istemeyen, ancak güçlü risk yönetimiyle istikrarlı getiri hedefleyen yatırımcılar",
          ]} />
        </Section>

        {/* Özet */}
        <div className={s.contentSectionUnified} style={{
          background: "rgba(96, 165, 250, 0.06)",
          border: "1px solid rgba(96, 165, 250, 0.2)",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
        }}>
          <p className={s.accordionTextUnified} style={{ margin: 0, color: "#dbeafe", fontStyle: "italic" }}>
            TradeMate Premium, yüksek hacimli portföyleri BorsaZeka ekibi yönetiminde otomatik olarak değerlendirmek isteyen yatırımcılar için geliştirilmiş profesyonel bir algoritmik yatırım çözümüdür. Kontrol ve strateji yönetimi BorsaZeka ekibinde, portföy takibi yatırımcıdadır.
          </p>
        </div>

        {/* Kullanım Şartları */}
        <Section title="TradeMate Robot Kullanım Şartları">
          <p className={s.accordionTextUnified}>
            Lütfen aşağıdaki kullanım şartlarını dikkatlice okuyun. Bu şartlar, TradeMate algoritmik yatırım robotunu kullanacak yatırımcılar için geçerlidir. Herhangi bir sorunuz olursa tarafımıza ulaşabilirsiniz.
          </p>
          <ol className={s.tmTermsListUnified}>
            {[
              { title: "Kullanıcı Sayısı ve Bütçe Sınırı", desc: "TradeMate en fazla 40 kullanıcı ile sınırlandırılmıştır. Kişi sayısından ziyade toplam portföy büyüklüğü önemlidir. Tüm müşterilerin toplam portföyü 1.000.000.000 TL’yi geçmeyecektir." },
              { title: "Robot Yönetimi", desc: "TradeMate’in yönetimi tamamen tarafımızdan gerçekleştirilecektir. Kullanıcıların robota müdahale etmesine gerek yoktur ve manuel işlem yapılması yasaktır." },
              { title: "Katılım Bütçesi", desc: "Minimum giriş bütçesi: 600.000 TL · Optimal minimum: 750.000 TL · Maksimum giriş bütçesi: 100.000.000 TL" },
              { title: "Aracı Kurum ve Komisyon İndirimi", desc: "Katılım sağlamak isteyen yatırımcılar, tarafımızca yönlendirilecek anlaşmalı aracı kurum üzerinden hesap açmalıdır. Bu sayede indirimli komisyon avantajından faydalanılacaktır: Yüzbinde 7. Yüksek işlem hacmi nedeniyle iDeal programı muhtemelen ücretsiz olacaktır. Eğer herhangi bir lisans ücreti çıkarsa, bu masraf doğrudan T2 Overall değerinden düşeceği için bu masrafa ve diğer hesap içi tüm masraflara (komisyon, hesap işletim ücreti vb.) ortak oluyoruz. iDeal lisansı ve gerekli tüm erişim bilgileri, aracı kurumla tarafımızca koordine edilecektir." },
              { title: "Sunucu Kiralama", desc: "TradeMate için sunucu kiralanması gerekmektedir. Sunucu kiralama işlemi borsazeka.com üzerinden yapılacaktır. Sunucu kurulumu tarafımızca yapılacak, yönetimi ise bize ait olacaktır." },
              { title: "Sunucu Paketleri", desc: "1.000.000 TL altındaki hesaplar için: 30€’luk sunucu yeterlidir. 1.000.000 TL üzerindeki hesaplar için: 55€’luk sunucu tavsiye edilir. Daha yüksek bütçeler için, portföy yönetim ve işlem performansı açısından 95€’luk üst seviye sunucu tercih edilebilir. Sunucu ücreti kullanıcıya aittir, yönetimi ücretsiz olarak tarafımızca yapılacaktır." },
              { title: "Kurulum Ücreti", desc: "İlk kurulum için tek seferlik 50€ ücret alınmaktadır. Bu ücret yalnızca başlangıçta talep edilir, sonraki aylarda tekrar edilmez." },
              { title: "Hesap Takibi", desc: "Yatırımcılar, aracı kurumun web sitesi veya mobil uygulaması üzerinden portföylerini anlık olarak takip edebilecektir." },
              { title: "Kâr Paylaşımı", desc: "Her ay sonunda, gerçekleşen net kâr üzerinden %50 kâr paylaşımı yapılacaktır. Ay sonlarında, tarafımızca size aylık performans raporu gönderilecektir. Zarar edilen aylarda zarar gelecek aya devredilir. Böylece kullanıcının kara geçene kadar ücret ödemesi gerekmez. Zarar edilen aylarda kullanıcının para çekimi yapması tavsiye edilmez ancak çekim yapılırsa çekim miktarı / toplam portföy oranında zararı kullanıcı realize etmiş olur." },
              { title: "Manuel İşlem Kısıtı", desc: "Kullanıcı (siz) ve robot yöneticisi (biz) manuel alım-satım işlemi yapmayacaktır. Ancak acil müdahale gerektiren teknik arıza durumlarında, kullanıcıyla koordinasyon halinde işlem yapılabilir." },
              { title: "Veri Gizliliği", desc: "Robot tarafından alınan veya satılan hisseler öncesinde veya sonrasında hiçbir şekilde paylaşılmayacaktır. Tüm veriler ve işlem detayları gizlilik prensipleri çerçevesinde korunacaktır." },
              { title: "Para Yatırma ve Çekme İşlemleri", desc: "Kullanıcı, önceden haber vererek istediği zaman para yatırabilir veya çekebilir. Para çekme talepleri için en az 2 gün önceden bilgilendirme zorunludur. Böylece robot, işlem hacmini optimize ederek para çekimi için uygun bir planlama yapabilecektir." },
              { title: "Şifre Yönetimi", desc: "Aracı kurum şifreleri, güvenli vault sunucularımızda kaydedilecek ve sadece yetkili robot yöneticisi tarafından iDeal içine kaydedilecektir. Pass kurulumu kullanıcı yetkilendirmesi ile yapılacaktır." },
              { title: "Sorumluluk", desc: "TradeMate, tam otomatik bir algoritmik yatırım sistemidir. Tüm kullanıcıların yatırımları, performans optimizasyonu ve güvenlik standartlarına uygun şekilde yönetilecektir. Sistemin en verimli şekilde çalışması için belirtilen kurallara eksiksiz uymak zorunludur." },
            ].map((item, i) => (
              <li key={i} className={s.tmTermsItemUnified}>
                <div>
                  <strong className={s.tmTermsTitleUnified}>
                    {item.title}
                  </strong>
                  <p className={s.tmTermsDescUnified}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </div>
  );
}


// --- Highway Premium Info Panel (Step 6 Left) ---------------------------------
function HighwayPremiumPanel({ t }: { t: (k: string) => string }) {
  return (
    <div className={s.robotDetailsPanelUnified} style={{ '--panel-accent': '#60a5fa' } as React.CSSProperties}>
      {/* Header */}
      <div className={s.tmHeader}>
        <div className={s.tmIconGlowBlue}><TrendingUp size={32} /></div>
        <div>
          <h2 className={`${s.robotNeonTitleUnified} ${s.neonBlue}`}>Highway Premium</h2>
          <p className={s.robotSloganUnified}>BorsaZeka ekibi tarafından yönetilen profesyonel trend takip sistemi.</p>
        </div>
      </div>

      {/* Highlights */}
      <div className={s.tmHighlights}>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}><Users size={14} /><span>Ekip Yönetimi</span></div>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}><Zap size={14} /><span>Trend Takip</span></div>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}><span>Profesyonel Optimizasyon</span></div>
      </div>

      <div className={s.flatContentUnified}>

        {/* Giriş */}
        <Section title="Giriş" icon={<Activity size={18} />}>
          <p className={s.accordionTextUnified}>
            Highway Premium, BorsaZeka’nın gün içi trend hareketlerini yakalamak için geliştirdiği dinamik ve çok katmanlı tarama sisteminin, uzman ekip yönetimiyle sunulan profesyonel versiyonudur.
          </p>
          <p className={s.accordionTextUnified}>
            Self-Service modelinden farklı olarak Highway Premium’da robotun kurulumu, takibi, parametre yönetimi, piyasa koşullarına göre optimizasyonu ve genel strateji kontrolü BorsaZeka ekibi tarafından yapılır. Yatırımcı, sistemi kendi başına yönetmek zorunda kalmadan profesyonel destekle bu algoritmadan faydalanır.
          </p>
        </Section>

        {/* Strateji */}
        <Section title="Stratejinin Temeli" icon={<Zap size={18} />}>
          <p className={s.accordionTextUnified}>
            Highway Premium, klasik tek gösterge yaklaşımından farklı olarak çok boyutlu trend analizi yapar. Robot, farklı zaman periyotlarında çoklu algoritma kombinasyonları kullanarak trend yönünü belirler.
          </p>
          <p className={s.accordionTextUnified}>
            Sistem, mini trend uyumluluğu ve makro trend doğrulaması ile çifte güvenlik sağlar. Sadece farklı zaman dilimlerinde yeterli trend uyumu oluştuğunda pozisyon açar.
          </p>
          <p className={s.accordionTextUnified}>
            Premium versiyonda bu yapı, BorsaZeka ekibi tarafından düzenli olarak izlenir ve piyasa koşullarına göre optimize edilir.
          </p>
        </Section>

        {/* Çalışma Mantığı */}
        <Section title="Çalışma Mantığı" icon={<Settings size={18} />}>
          <Bullets items={[
            "Akıllı Tarama: Robot seans içinde aktif olarak piyasayı tarar ve trending hisseleri otomatik olarak tespit eder.",
            "Çoklu Zaman Kontrolü: Farklı zaman periyotlarında trend uyumunu kontrol eder ve zayıf sinyalleri filtreler.",
            "Ekip Kontrollü Optimizasyon: Parametreler ve strateji ayarları, BorsaZeka ekibi tarafından piyasa koşullarına göre takip edilir.",
            "Dinamik Giriş: Piyasa yapısı ve hisse trendi uygun olduğunda pozisyon açar.",
          ]} />
          
          <div style={{ marginTop: "1.5rem", paddingLeft: "0" }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--panel-accent)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Profesyonel Çıkış Yönetimi:
            </p>
            <Bullets items={[
              "Belirlenmiş kar hedefi ile otomatik satış",
              "İzleyen stop ile güçlü trendleri devam ettirme",
              "Zaman stop ile risk yönetimi",
              "Piyasa koşullarına göre ekip tarafından optimize edilen strateji ayarları",
            ]} />
          </div>
        </Section>

        {/* Özel Özellikler */}
        <Section title="Özel Özellikleri" icon={<BarChart3 size={18} />}>
          <Bullets items={[
            "Ekip Tarafından Yönetim: Kurulum, takip ve strateji kontrolü BorsaZeka ekibi tarafından yapılır.",
            "Farklı Zaman Dilimlerinde Tarama: Her zaman dilimine özel optimizasyon ve tarama stratejileri kullanılır.",
            "Piyasa Uyumlu Çalışma: Ana endeks yönüne göre kar hedefleri ve risk parametreleri dinamik olarak optimize edilir.",
            "Gerçek Zamanlı Adaptasyon: Piyasa volatilitesine göre sistem davranışı ayarlanır.",
            "Risk Yönetimi: Çoklu stop mekanizması ile kayıpların minimize edilmesi hedeflenir.",
            "Performans Takibi: İşlemler, sonuçlar ve strateji performansı ekip tarafından düzenli olarak izlenir.",
          ]} />
        </Section>

        {/* Neden Highway? */}
        <Section title="Neden Highway Premium?" icon={<Rocket size={18} />}>
          <p className={s.accordionTextUnified}>
            Highway Premium, gün içi trend hareketlerinden faydalanmak isteyen ancak robot yönetimi, parametre takibi ve strateji optimizasyonu ile uğraşmak istemeyen yatırımcılar için tasarlanmıştır.
          </p>
          <p className={s.accordionTextUnified}>
            Robot seans boyunca piyasayı tarar, trend fırsatlarını tespit eder ve otomatik işlem yapar. BorsaZeka ekibi ise sistemin doğru çalışmasını, strateji ayarlarını ve piyasa koşullarına uyumunu takip eder.
          </p>
          <p className={s.accordionTextUnified}>
            Highway Premium, dinamik trend takibi ile profesyonel ekip yönetimini bir araya getiren güçlü bir algoritmik yatırım çözümüdür.
          </p>
        </Section>

        {/* Kullanım Şartları */}
        <Section title="Highway Robot Kullanım Şartları" icon={<Shield size={18} />}>
          <p className={s.accordionTextUnified}>
            Lütfen aşağıdaki kullanım şartlarını dikkatlice okuyun. Bu şartlar, Highway algoritmik yatırım robotunu kullanacak yatırımcılar için geçerlidir. Herhangi bir sorunuz olursa tarafımıza ulaşabilirsiniz.
          </p>
          <ol className={s.tmTermsListUnified}>
            {[
              { title: "Kullanıcı Sayısı ve Bütçe Sınırı", desc: "Highway en fazla 40 kullanıcı ile sınırlandırılmıştır. Kişi sayısından ziyade toplam portföy büyüklüğü önemlidir. Tüm müşterilerin toplam portföyü 50.000.000 TL’yi geçmeyecektir." },
              { title: "Robot Yönetimi", desc: "Highway’in yönetimi tamamen tarafımızdan gerçekleştirilecektir. Kullanıcıların robota müdahale etmesine gerek yoktur ve manuel işlem yapılması yasaktır." },
              { title: "Katılım Bütçesi", desc: "Minimum giriş bütçesi: 600.000 TL · Optimal minimum: 750.000 TL · Maksimum giriş bütçesi: 5.000.000 TL. 5.000.000 TL üzeri katılım teklifleri kabul edilmemektedir." },
              { title: "Aracı Kurum ve Komisyon İndirimi", desc: "Katılım sağlamak isteyen yatırımcılar, tarafımızca yönlendirilecek anlaşmalı aracı kurum üzerinden hesap açmalıdır. İndirimli komisyon avantajı: Yüzbinde 7. Yüksek işlem hacmi nedeniyle iDeal programı muhtemelen ücretsiz olacaktır. Lisans ücreti çıkarsa bu masraf T2 Overall değerinden düşeceği için tüm hesap içi masraflara ortak oluyoruz. iDeal lisansı ve gerekli tüm erişim bilgileri, aracı kurumla tarafımızca koordine edilecektir." },
              { title: "Sunucu Kiralama", desc: "Highway için sunucu kiralanması gerekmektedir. Sunucu kiralama işlemi borsazeka.com üzerinden yapılacaktır. Sunucu kurulumu tarafımızca yapılacak, yönetimi ise bize ait olacaktır." },
              { title: "Sunucu Paketleri", desc: "1.000.000 TL altındaki hesaplar için 30€’luk sunucu yeterlidir. 1.000.000 TL üzerindeki hesaplar için 55€’luk sunucu tavsiye edilir. Daha yüksek bütçeler için 95€’luk üst seviye sunucu tercih edilebilir. Sunucu ücreti kullanıcıya aittir, yönetimi ücretsiz olarak tarafımızca yapılacaktır." },
              { title: "Kurulum Ücreti", desc: "İlk kurulum için tek seferlik 50€ ücret alınmaktadır. Bu ücret yalnızca başlangıçta talep edilir, sonraki aylarda tekrar edilmez." },
              { title: "Hesap Takibi", desc: "Yatırımcılar, aracı kurumun web sitesi veya mobil uygulaması üzerinden portföylerini anlık olarak takip edebilecektir." },
              { title: "Kâr Paylaşımı", desc: "Her ay sonunda gerçekleşen net kâr üzerinden %50 kâr paylaşımı yapılacaktır. Aylık performans raporu tarafımızca gönderilecektir. Zarar edilen aylarda zarar gelecek aya devredilir; kullanıcının kara geçene kadar ücret ödemesi gerekmez. Zarar edilen aylarda para çekimi tavsiye edilmez; çekim yapılırsa çekim miktarı / toplam portföy oranında zarar realize edilmiş olur." },
              { title: "Manuel İşlem Kısıtı", desc: "Kullanıcı (siz) ve robot yöneticisi (biz) manuel alım-satım işlemi yapmayacaktır. Ancak acil müdahale gerektiren teknik arıza durumlarında, kullanıcıyla koordinasyon halinde işlem yapılabilir." },
              { title: "Veri Gizliliği", desc: "Robot tarafından alınan veya satılan hisseler öncesinde veya sonrasında hiçbir şekilde paylaşılmayacaktır. Tüm veriler ve işlem detayları gizlilik prensipleri çerçevesinde korunacaktır." },
              { title: "Para Yatırma ve Çekme İşlemleri", desc: "Kullanıcı, önceden haber vererek istediği zaman para yatırabilir veya çekebilir. Para çekme talepleri için en az 2 gün önceden bilgilendirme zorunludur. Böylece robot işlem hacmini optimize ederek uygun bir planlama yapabilecektir." },
              { title: "Şifre Yönetimi", desc: "Aracı kurum şifreleri, güvenli vault sunucularımızda kaydedilecek ve sadece yetkili robot yöneticisi tarafından iDeal içine kaydedilecektir. Pass kurulumu kullanıcı yetkilendirmesi ile yapılacaktır." },
              { title: "Sorumluluk", desc: "Highway, tam otomatik bir algoritmik yatırım sistemidir. Tüm kullanıcıların yatırımları performans optimizasyonu ve güvenlik standartlarına uygun şekilde yönetilecektir. Sistemin en verimli şekilde çalışması için belirtilen kurallara eksiksiz uymak zorunludur." },
            ].map((item, i) => (
              <li key={i} className={s.tmTermsItemUnified}>
                <div>
                  <strong className={s.tmTermsTitleUnified}>
                    {item.title}
                  </strong>
                  <p className={s.tmTermsDescUnified}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

      </div>
    </div>
  );
}


// --- KriptoZeka Premium Info Panel (Step 6 Left) ------------------------------
function KriptozekaPremiumPanel({ t }: { t: (k: string) => string }) {
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

      if (inGreen) nodes.push(<span key={i} style={{ color: "#60a5fa" }}>{part}</span>);
      else if (inBold || inBadge) nodes.push(<strong key={i} style={{ fontWeight: 800 }}>{part}</strong>);
      else nodes.push(part);
    });
    return <>{nodes}</>;
  };

  return (
    <div className={s.robotDetailsPanelUnified} style={{ '--panel-accent': '#60a5fa' } as React.CSSProperties}>
      <div className={s.tmHeader}>
        <div className={s.tmIconGlowBlue}>
          <Bitcoin size={32} />
        </div>
        <div>
          <h2 className={`${s.robotNeonTitleUnified} ${s.neonBlue}`}>KriptoZeka Premium</h2>
          <p className={s.robotSloganUnified}>{t("wizard.step6.kriptozeka.slogan")}</p>
        </div>
      </div>

      <div className={s.tmHighlights}>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}>
          <BarChart3 size={14} />
          <span>Hacim Odaklı</span>
        </div>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}>
          <ShieldAlert size={14} />
          <span>Risk Kontrolü</span>
        </div>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}>{t("wizard.step6.kriptozeka.h1")}</div>
      </div>

      <div className={s.flatContentUnified}>
        <div className={s.contentSectionUnified}>
          <h3 className={s.contentSectionTitleUnified}>
            <Zap size={18} />
            {t("wizard.step6.kriptozeka.strategyTitle")}
          </h3>
          <p className={s.accordionTextUnified}>{renderDesc(t("wizard.step6.kriptozeka.strategyP1"))}</p>
          <p className={s.accordionTextUnified}>{renderDesc(t("wizard.step6.kriptozeka.strategyP2"))}</p>
        </div>

        <Section title={t("wizard.step6.kriptozeka.logicTitle")} icon={<Settings size={18} />}>
          <ul className={s.unifiedCheckList}>
            {(["l1", "l2", "l3", "l4"] as const).map(k => (
              <li key={k} style={{ alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={16} style={{ color: "var(--panel-accent)", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.88rem" }}>{t(`wizard.step6.kriptozeka.${k}`)}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t("wizard.step6.kriptozeka.securityTitle")} icon={<Shield size={18} />}>
          <ul className={s.unifiedCheckList}>
            {(["s1", "s2", "s3", "s4"] as const).map(k => (
              <li key={k} style={{ alignItems: "flex-start", gap: "0.75rem" }}>
                <Shield size={16} style={{ color: "var(--panel-accent)", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.88rem" }}>{t(`wizard.step6.kriptozeka.${k}`)}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={t("wizard.step6.kriptozeka.termsTitle")} icon={<Activity size={18} />}>
          <p className={s.tmTermsNote} style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>{t("wizard.step6.kriptozeka.termsNote")}</p>
          <ol className={s.tmTermsListUnified}>
            {(["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12", "t13", "t14", "t15", "t16", "t17", "t18", "t19", "t20"] as const).map(k => (
              <li key={k} className={s.tmTermsItemUnified}>
                <div>
                  <strong className={s.tmTermsTitleUnified}>{t(`wizard.step6.kriptozeka.${k}Title`)}</strong>
                  <p className={s.tmTermsDescUnified}>{renderDesc(t(`wizard.step6.kriptozeka.${k}Desc`))}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </div>
  );
}


// --- DarkRoom Premium Info Panel (Step 6 Left) --------------------------------
function DarkroomPremiumPanel({ t }: { t: (k: string) => string }) {
  return (
    <div className={s.robotDetailsPanelUnified} style={{ '--panel-accent': '#c084fc' } as React.CSSProperties}>
      {/* Header */}
      <div className={s.tmHeader}>
        <div className={s.tmIconGlowPurple}><Moon size={32} /></div>
        <div>
          <h2 className={`${s.robotNeonTitleUnified} ${s.neonPurple}`}>DarkRoom Premium</h2>
          <p className={s.robotSloganUnified}>Yönetilen algoritmik yatırım deneyimi.</p>
        </div>
      </div>

      {/* Highlights */}
      <div className={s.tmHighlights}>
        <div className={`${s.featureTagUnified} ${s.tagPurple}`}><Users size={14} /><span>Ekip Yönetimi</span></div>
        <div className={`${s.featureTagUnified} ${s.tagPurple}`}><Lock size={14} /><span>Kurumsal Güvenlik</span></div>
        <div className={`${s.featureTagUnified} ${s.tagPurple}`}><Moon size={14} /><span>Gece Al – Sabah Sat</span></div>
      </div>

      <div className={s.flatContentUnified}>

        {/* Giriş */}
        <Section>
          <p className={s.accordionTextUnified}>
            DarkRoom Premium, BorsaZeka tarafından uçtan uca yönetilen, sınırlı katılımcıya açık özel bir algoritmik yatırım çözümüdür. Bu yapı, robotu kendi başına yönetmek istemeyen; kurulum, teknik takip, optimizasyon ve operasyon süreçlerinin profesyonel şekilde yürütülmesini tercih eden yatırımcılar için tasarlanmıştır.
          </p>
          <p className={s.accordionTextUnified}>
            DarkRoom Premium&apos;da kullanıcı, sistemi teknik olarak yönetmek zorunda kalmaz. Sunucu kurulumu, robot yönetimi, operasyon takibi ve aylık raporlama süreci BorsaZeka tarafından yürütülür. Yatırımcı ise portföyünü aracı kurum üzerinden şeffaf biçimde izler.
          </p>
        </Section>

        {/* Yapı */}
        <Section title="DarkRoom Premium'un Yapısı" icon={<Activity size={18} />}>
          <Bullets items={[
            "Sınırlı sayıda kullanıcı ile çalışır",
            "Toplam portföy büyüklüğü kontrollü şekilde yönetilir",
            "Performansın korunması için kabul süreci seçici şekilde ilerler",
            "Teknik altyapı ve robot yönetimi tamamen BorsaZeka tarafından sağlanır",
          ]} />
        </Section>

        {/* Nedir */}
        <Section title="DarkRoom Premium Nedir?" icon={<Target size={18} />}>
          <p className={s.accordionTextUnified}>
            DarkRoom, BorsaZeka'nın en özel ve en güvenilir robotlarından biridir. Klasik teknik analiz yöntemlerini tamamen geride bırakan bu algoritma, akşam alıp sabah satma mantığında çalışan bir gap trade robotudur.
          </p>
          <p className={s.accordionTextUnified}>
            Bu sistemin temel amacı, ertesi gün yüksek ihtimalle yukarı yönlü açılış yapacak hisseleri bir önceki akşamdan tespit ederek pozisyon almak ve ertesi sabah açılışta pozisyonu kapatmaktır.
          </p>
        </Section>

        {/* Strateji */}
        <Section title="Stratejinin Temeli">
          <p className={s.accordionTextUnified}>
            DarkRoom, herhangi bir RSI, MACD veya Bollinger Bands gibi indikatörleri kesinlikle kullanmaz. Bunun yerine, geçmiş binlerce işlem gününe ait veri setlerini analiz ederek, yarın yüksek ihtimalle yukarı yönlü açılış yapacak hisseleri belirleyen özel istatistiksel model ve yapay zeka motoru ile çalışır.
          </p>
        </Section>

        {/* Çalışma Mantığı */}
        <Section title="Çalışma Mantığı" icon={<Settings size={18} />}>
          <ul className={s.unifiedCheckList}>
            {([
              { label: "İşlem Zamanı:",      desc: "Robot yalnızca günün sonunda (akşam) pozisyon alır" },
              { label: "Pozisyon Kapatma:",  desc: "Alınan tüm pozisyonlar ertesi sabah açılışta otomatik olarak kapatılır" },
              { label: "Bekleme Yok:",       desc: "Hiçbir hisse gün içinde elde tutulmaz. Her işlem, 'gece al – sabah sat' şeklinde kısa vadelidir" },
              { label: "İstatistiksel Seçim:", desc: "Sistem her akşam yüzlerce hissedeki veri desenlerini analiz ederek, gap up (yüksek açılış) ihtimali yüksek olanları seçer" },
            ]).map((item, i) => (
              <li key={i} style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                <span style={{ color: "var(--panel-accent)", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {item.label}
                </span>
                <span style={{ paddingLeft: "0", color: "rgba(255,255,255,0.9)" }}>{item.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Süreç */}
        <Section title="DarkRoom Premium'da Süreç Nasıl İşler?">
          <p className={s.accordionTextUnified}>
            DarkRoom Premium, self-service bir yapı değildir. Burada süreç kullanıcı tarafından değil, doğrudan BorsaZeka tarafından yönetilir.
          </p>
          <Bullets items={[
            "Robotun yönetimi BorsaZeka tarafından yapılır",
            "Teknik kurulum ve sunucu yönetimi BorsaZeka tarafından sağlanır",
            "Kullanıcı, manuel müdahale yerine profesyonel yönetim modeliyle ilerler",
            "Aylık performans sonuçları düzenli olarak raporlanır",
          ]} />
        </Section>

        {/* Altyapı */}
        <Section title="Altyapı ve Emir İletimi">
          <p className={s.accordionTextUnified}>
            DarkRoom Premium&apos;da emirler, kullanıcıya tahsisli IP adresli ücretli BorsaZeka sunucuları üzerinden BIST&apos;e iletilir. Abonelik esnasında bütçenize uygun sunucuyu kiralamanız gerekir. Hesap bilgileri, kriptolu bağlantı üzerinden güvenli Vault sunuculara kaydedilir ve erişime kapalıdır.
          </p>
          <Bullets items={[
            "Emir iletimi kontrollü ve güvenli şekilde gerçekleştirilir",
            "Teknik süreçler merkezi biçimde yönetilir",
            "Kullanıcı, operasyon tarafıyla uğraşmadan yalnızca sonucuna odaklanır",
            "Tüm işlemler aracı kurum platformu üzerinden ayrıca takip edilebilir",
          ]} />
        </Section>

        {/* Güvenlik */}
        <Section title="Güvenlik ve Operasyon">
          <p className={s.accordionTextUnified}>
            DarkRoom Premium&apos;da güvenlik yalnızca robot tarafında değil, tüm operasyon zincirinde ele alınır.
          </p>
          <Bullets items={[
            "Kullanıcıya özel sunucu altyapısı kullanılır",
            "Teknik yönetim merkezi olarak yürütülür",
            "Manuel kullanım sınırlandırılarak sistem disiplini korunur",
            "Portföy büyüklüğü ve kullanıcı sayısı kontrollü tutulur",
          ]} />
        </Section>

        {/* Fark */}
        <Section title="DarkRoom Premium'un Öne Çıkan Farkı">
          <p className={s.accordionTextUnified}>
            DarkRoom Premium, yalnızca bir robot erişimi değil; aynı zamanda yönetilen bir algoritmik yatırım hizmetidir.
          </p>
          <Bullets items={[
            "Kullanıcı sistemi kendi başına kurmaz",
            "Robotu kendi başına optimize etmez",
            "Teknik altyapıyı kendi başına takip etmez",
            "Tüm bu süreçler BorsaZeka tarafından yürütülür",
          ]} />
        </Section>

        {/* Kimler için */}
        <Section title="Kimler İçin Uygundur?">
          <Bullets items={[
            "Robotu kendi başına yönetmek istemeyen yatırımcılar",
            "Akşam al – sabah sat mantığında çalışan kısa vadeli stratejilere ilgi duyanlar",
            "Teknik analiz yerine veri bilimi ve yapay zeka temelli sistemlere güvenenler",
            "Kontrollü büyüyen, seçici ve kapalı yapıda ilerleyen sistemleri tercih edenler",
            "Operasyonel yükü BorsaZeka'ya bırakıp süreci profesyonel şekilde takip etmek isteyenler",
          ]} />
        </Section>

        {/* Özet */}
        <div className={s.contentSectionUnified} style={{
          background: "rgba(192, 132, 252, 0.06)",
          border: "1px solid rgba(192, 132, 252, 0.2)",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
        }}>
          <p className={s.accordionTextUnified} style={{ margin: 0, color: "#e9d5ff", fontStyle: "italic" }}>
            DarkRoom Premium, klasik bir robot aboneliğinin ötesinde, BorsaZeka tarafından yönetilen özel bir algoritmik yatırım deneyimi sunar. Burada amaç yalnızca işlem yapmak değil; kontrollü, güvenli ve sürdürülebilir bir yapı içinde ilerlemektir.
          </p>
        </div>

        {/* Kullanım Şartları */}
        <Section title="DarkRoom Robot Kullanım Şartları">
          <p className={s.accordionTextUnified}>
            Lütfen aşağıdaki kullanım şartlarını dikkatlice okuyun. Bu şartlar, DarkRoom algoritmik yatırım robotunu kullanacak yatırımcılar için geçerlidir. Herhangi bir sorunuz olursa tarafımıza ulaşabilirsiniz.
          </p>
          <ol className={s.tmTermsListUnified}>
            {([
              { title: "Kullanıcı Sayısı ve Bütçe Sınırı", desc: "DarkRoom en fazla 40 kullanıcı ile sınırlandırılmıştır. Kişi sayısından ziyade toplam portföy büyüklüğü önemlidir. Tüm müşterilerin toplam portföyü 50.000.000 TL'yi geçmeyecektir." },
              { title: "Robot Yönetimi", desc: "DarkRoom'un yönetimi tamamen tarafımızdan gerçekleştirilecektir. Kullanıcıların robota müdahale etmesine gerek yoktur ve manuel işlem yapılması yasaktır." },
              { title: "Katılım Bütçesi", desc: "Minimum giriş bütçesi: 600.000 TL · Optimal minimum: 750.000 TL · Maksimum giriş bütçesi: 5.000.000 TL. 5.000.000 TL üzeri katılım teklifleri kabul edilmemektedir." },
              { title: "Aracı Kurum ve Komisyon İndirimi", desc: "Katılım sağlamak isteyen yatırımcılar, tarafımızca yönlendirilecek anlaşmalı aracı kurum üzerinden hesap açmalıdır. İndirimli komisyon avantajı: Yüzbinde 7. Yüksek işlem hacmi nedeniyle iDeal programı muhtemelen ücretsiz olacaktır. Lisans ücreti çıkarsa bu masraf T2 Overall değerinden düşeceği için tüm hesap içi masraflara ortak oluyoruz." },
              { title: "Sunucu Kiralama", desc: "DarkRoom için sunucu kiralanması gerekmektedir. Sunucu kiralama işlemi borsazeka.com üzerinden yapılacaktır. Sunucu kurulumu tarafımızca yapılacak, yönetimi ise bize ait olacaktır." },
              { title: "Sunucu Paketleri", desc: "1.000.000 TL altındaki hesaplar için 30€'luk sunucu yeterlidir. 1.000.000 TL üzerindeki hesaplar için 55€'luk sunucu tavsiye edilir. Daha yüksek bütçeler için 95€'luk üst seviye sunucu tercih edilebilir. Sunucu ücreti kullanıcıya aittir, yönetimi ücretsiz olarak tarafımızca yapılacaktır." },
              { title: "Kurulum Ücreti", desc: "İlk kurulum için tek seferlik 50€ ücret alınmaktadır. Bu ücret yalnızca başlangıçta talep edilir, sonraki aylarda tekrar edilmez." },
              { title: "Hesap Takibi", desc: "Yatırımcılar, aracı kurumun web sitesi veya mobil uygulaması üzerinden portföylerini anlık olarak takip edebilecektir." },
              { title: "Kâr Paylaşımı", desc: "Her ay sonunda gerçekleşen net kâr üzerinden %50 kâr paylaşımı yapılacaktır. Aylık performans raporu tarafımızca gönderilecektir. Zarar edilen aylarda zarar gelecek aya devredilir; kullanıcının kara geçene kadar ücret ödemesi gerekmez. Zarar edilen aylarda para çekimi tavsiye edilmez; çekim yapılırsa çekim miktarı / toplam portföy oranında zarar realize edilmiş olur." },
              { title: "Manuel İşlem Kısıtı", desc: "Kullanıcı ve robot yöneticisi manuel alım-satım işlemi yapmayacaktır. Ancak acil müdahale gerektiren teknik arıza durumlarında, kullanıcıyla koordinasyon halinde işlem yapılabilir." },
              { title: "Veri Gizliliği", desc: "Robot tarafından alınan veya satılan hisseler öncesinde veya sonrasında hiçbir şekilde paylaşılmayacaktır. Tüm veriler ve işlem detayları gizlilik prensipleri çerçevesinde korunacaktır." },
              { title: "Para Yatırma ve Çekme İşlemleri", desc: "Kullanıcı, önceden haber vererek istediği zaman para yatırabilir veya çekebilir. Para çekme talepleri için en az 2 gün önceden bilgilendirme zorunludur. Böylece robot işlem hacmini optimize ederek uygun bir planlama yapabilecektir." },
              { title: "Şifre Yönetimi", desc: "Aracı kurum şifreleri, güvenli vault sunucularımızda kaydedilecek ve sadece yetkili robot yöneticisi tarafından iDeal içine kaydedilecektir. Pass kurulumu kullanıcı yetkilendirmesi ile yapılacaktır." },
              { title: "Sorumluluk", desc: "DarkRoom, tam otomatik bir algoritmik yatırım sistemidir. Tüm kullanıcıların yatırımları performans optimizasyonu ve güvenlik standartlarına uygun şekilde yönetilecektir. Sistemin en verimli şekilde çalışması için belirtilen kurallara eksiksiz uymak zorunludur." },
            ]).map((item, i) => (
              <li key={i} className={s.tmTermsItemUnified}>
                <div>
                  <strong className={s.tmTermsTitleUnified}>
                    {item.title}
                  </strong>
                  <p className={s.tmTermsDescUnified}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

      </div>
    </div>
  );
}


// --- DarkRoom Self-Service Info Panel (Step 6 Left) ---------------------------
function DarkroomSelfPanel({ t }: { t: (k: string) => string }) {
  const accentColor = "#c084fc";

  const Section = ({ title, icon, children }: { title?: string; icon?: React.ReactNode; children: React.ReactNode }) => (
    <div className={s.contentSectionUnified}>
      {title && (
        <h3 className={s.contentSectionTitleUnified}>
          {icon && <span style={{ opacity: 0.8 }}>{icon}</span>}
          {title}
        </h3>
      )}
      {children}
    </div>
  );

  return (
    <div className={s.robotDetailsPanelUnified} style={{ '--panel-accent': '#c084fc' } as React.CSSProperties}>
      {/* Header */}
      <div className={s.tmHeader}>
        <div className={s.tmIconGlowPurple}><Smartphone size={32} /></div>
        <div>
          <h2 className={`${s.robotNeonTitleUnified} ${s.neonPurple}`}>DarkRoom Self-Service</h2>
          <p className={s.robotSloganUnified}>Gece alır, sabah satar. Kazanç fırsatını istatistiksel zeka ile yakalar.</p>
        </div>
      </div>

      {/* Highlights */}
      <div className={s.tmHighlights}>
        <div className={`${s.featureTagUnified} ${s.tagPurple}`}><Smartphone size={14} /><span>Mobil Uygulama Kontrolü</span></div>
        <div className={`${s.featureTagUnified} ${s.tagPurple}`}><Activity size={14} /><span>Ücretsiz Sunucu</span></div>
        <div className={`${s.featureTagUnified} ${s.tagPurple}`}><span>Gap Trade Stratejisi</span></div>
      </div>

      <div className={s.flatContentUnified}>
        
        {/* Mobil App Intro */}
        <Section title="BorsaZeka Mobile App – Self-Service Robotlar" icon={<Smartphone size={18} />}>
          <p className={s.accordionTextUnified}>
            Kendi algoritmik robotlarını cebinden yönet! BorsaZeka’nın mobil uygulaması, algoritmik işlem robotlarını kendi kontrolünde kullanmak isteyen yatırımcılar için özel olarak tasarlanmış Self-Service modülünü sunar.
          </p>
          <ul className={s.unifiedCheckList}>
            {[
              "Robotlarını manuel olarak başlatıp durdurabilir,",
              "Parametrelerini gerçek zamanlı olarak değiştirebilir,",
              "Performans takibini doğrudan uygulama üzerinden gerçekleştirebilir.",
            ].map((item, i) => (
              <li key={i} style={{ alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={16} style={{ color: "var(--panel-accent)", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.88rem" }}>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Darkroom Giriş */}
        <Section title="DarkRoom Self-Service Robotu" icon={<Moon size={18} />}>
          <p className={s.accordionTextUnified}>
            DarkRoom, BorsaZeka’nın en popüler ve güvenilir robotlarından biridir. Klasik teknik analiz yaklaşımlarını tamamen geride bırakan bu algoritma, günlük açılış boşluklarından (gap) kazanç elde etmeyi hedefler.
          </p>
        </Section>

        {/* Strateji */}
        <Section title="Stratejinin Temeli" icon={<Zap size={18} />}>
          <ul className={s.unifiedCheckList}>
            {([
              { label: "Hiçbir teknik gösterge kullanılmaz:", desc: "RSI, MACD veya Bollinger Bands gibi göstergeler bu sistemde yer almaz." },
              { label: "İstatistiksel zeka:", desc: "Geçmiş binlerce işlem gününe ait veri setlerini analiz eden yapay zeka motoru, yarın yüksek ihtimalle yukarı açılış yapacak hisseleri belirler." },
            ]).map((item, i) => (
              <li key={i} style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                <span style={{ color: "var(--panel-accent)", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {item.label}
                </span>
                <span style={{ paddingLeft: "0", color: "rgba(255,255,255,0.9)" }}>{item.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Çalışma Mantığı */}
        <Section title="Çalışma Mantığı" icon={<Settings size={18} />}>
          <ul className={s.unifiedCheckList}>
            {([
              { label: "İşlem Zamanı:",      desc: "Robot yalnızca günün sonunda (akşam) pozisyon alır." },
              { label: "Pozisyon Kapatma:",  desc: "Alınan tüm pozisyonlar ertesi sabah açılışta otomatik olarak kapatılır." },
              { label: "Bekleme Yok:",       desc: "Hiçbir hisse gün içinde elde tutulmaz. Her işlem, 'gece al – sabah sat' şeklinde kısa vadelidir." },
              { label: "İstatistiksel Seçim:", desc: "Sistem her akşam yüzlerce hissenin veri desenlerini analiz ederek, gap up (yüksek açılış) ihtimali yüksek olanları seçer." },
            ]).map((item, i) => (
              <li key={i} style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                <span style={{ color: "var(--panel-accent)", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {item.label}
                </span>
                <span style={{ paddingLeft: "0", color: "rgba(255,255,255,0.9)" }}>{item.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Neler Yapabilirsin? */}
        <Section title="DarkRoom Self-Service ile Neler Yapabilirsin?" icon={<Rocket size={18} />}>
          <p className={s.accordionTextUnified}>
            BorsaZeka Mobile App üzerinden kullanıcıya tam kontrol sağlanır:
          </p>
          <ul className={s.unifiedCheckList}>
            {([
              { label: "Robotu Aç / Kapat:", desc: "İstediğin günlerde robotu çalıştırabilir veya durdurabilirsin." },
              { label: "Bütçe ve Kredi Ayarı:", desc: "Portföyde kullanılacak toplam bütçeyi ve (varsa) kredi limitini belirleyebilirsin." },
              { label: "İşlem Bildirimleri:", desc: "Pozisyon açıldığında ve kapandığında anlık uyarı alırsın." },
              { label: "Performans Takibi:", desc: "Günlük kâr/zarar, toplam işlem sayısı ve başarı oranını görüntüleyebilirsin." },
            ]).map((item, i) => (
              <li key={i} style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                <span style={{ color: "var(--panel-accent)", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {item.label}
                </span>
                <span style={{ paddingLeft: "0", color: "rgba(255,255,255,0.9)" }}>{item.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Güvenlik */}
        <Section title="Güvenlik ve Altyapı" icon={<Shield size={18} />}>
          <ul className={s.unifiedCheckList}>
            {([
              { label: "Güvenli Emir İletimi:", desc: "Emirler, BorsaZeka sunucuları üzerinden, kullanıcıya tahsisli IP adresiyle ücretsiz olarak BIST’e iletilir." },
              { label: "Veri Güvenliği:", desc: "Hesap bilgileri, güvenli Vault sunucularda tutulur ve erişime kapalıdır." },
              { label: "Şeffaflık:", desc: "DarkRoom Self-Service yalnızca emir gönderir; kullanıcı, tüm işlemleri aracı kurum platformundan da takip edebilir." },
            ]).map((item, i) => (
              <li key={i} style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                <span style={{ color: "var(--panel-accent)", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {item.label}
                </span>
                <span style={{ paddingLeft: "0", color: "rgba(255,255,255,0.9)" }}>{item.desc}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Kimler İçin */}
        <Section title="Kimler İçin Uygundur?" icon={<Users size={18} />}>
          <Bullets items={[
            "Gece pozisyon açıp sabah satış yapmayı tercih eden kısa vadeli yatırımcılar,",
            "Teknik analiz yerine istatistiksel modelleme ve yapay zeka temelli stratejilere güvenenler,",
            "Robotu dilediği zaman açıp kapatmak isteyen, manuel kontrolü önemseyen kullanıcılar.",
          ]} />
        </Section>

        {/* Özet */}
        <div className={s.contentSectionUnified} style={{
          background: "rgba(192, 132, 252, 0.06)",
          border: "1px solid rgba(192, 132, 252, 0.2)",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          textAlign: "left"
        }}>
          <p className={s.accordionTextUnified} style={{ margin: 0, color: "#e9d5ff", fontStyle: "italic", textAlign: "left" }}>
            DarkRoom Self-Service, klasik otomasyonun ötesine geçerek robot stratejisini doğrudan cebinden yönetme imkânı sunar. Kontrol sende, algoritma BorsaZeka’da.
          </p>
        </div>

      </div>
    </div>
  );
}


// --- Highway Self-Service Info Panel (Step 6 Left) ----------------------------
function HighwaySelfPanel({ t }: { t: (k: string) => string }) {
  return (
    <div className={s.robotDetailsPanelUnified} style={{ '--panel-accent': '#60a5fa' } as React.CSSProperties}>
      <div className={s.tmHeader}>
        <div className={s.tmIconGlowBlue}>
          <Route size={32} />
        </div>
        <div>
          <h2 className={`${s.robotNeonTitleUnified} ${s.neonBlue}`}>Highway Self-Service</h2>
          <p className={s.robotSloganUnified}>{t("wizard.step6.highwaySelf.slogan")}</p>
        </div>
      </div>

      <div className={s.tmHighlights}>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}>
          <Smartphone size={14} />
          <span>Mobil Uygulama Kontrolü</span>
        </div>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}>
          <Activity size={14} />
          <span>Ücretsiz Sunucu</span>
        </div>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}>{t("wizard.step6.highwaySelf.h1")}</div>
      </div>

      <div className={s.flatContentUnified}>
        <Section title={t("wizard.step6.highwaySelf.strategyTitle")} icon={<Zap size={18} />}>
          <p className={s.accordionTextUnified}>{renderDesc(t("wizard.step6.highwaySelf.strategyP1"))}</p>
          <p className={s.accordionTextUnified}>{renderDesc(t("wizard.step6.highwaySelf.strategyP2"))}</p>
        </Section>

        <Section title={t("wizard.step6.highwaySelf.logicTitle")} icon={<Settings size={18} />}>
          <Bullets items={["l1", "l2", "l3", "l4"].map(k => t(`wizard.step6.highwaySelf.${k}`))} />
        </Section>

        <Section title={t("wizard.step6.highwaySelf.performanceTitle")} icon={<BarChart3 size={18} />}>
          <Bullets items={["p1", "p2", "p3", "p4"].map(k => t(`wizard.step6.highwaySelf.${k}`))} />
        </Section>

        <Section title={t("wizard.step6.highwaySelf.whyTitle")} icon={<Rocket size={18} />}>
          <p className={s.accordionTextUnified}>{renderDesc(t("wizard.step6.highwaySelf.whyP1"))}</p>
          <p className={s.accordionTextUnified}>{renderDesc(t("wizard.step6.highwaySelf.whyP2"))}</p>
        </Section>
      </div>
    </div>
  );
}


// --- TradeMate Self-Service Info Panel (Step 6 Left) --------------------------
function TrademateSelfPanel({ t }: { t: (k: string) => string }) {
  return (
    <div className={s.robotDetailsPanelUnified} style={{ '--panel-accent': '#60a5fa' } as React.CSSProperties}>
      <div className={s.tmHeader}>
        <div className={s.tmIconGlowBlue}>
          <Cpu size={32} />
        </div>
        <div>
          <h2 className={`${s.robotNeonTitleUnified} ${s.neonBlue}`}>TradeMate Self-Service</h2>
          <p className={s.robotSloganUnified}>Büyük Portföyler İçin Profesyonel Düzeyde Otomatik Yönetim</p>
        </div>
      </div>

      <div className={s.tmHighlights}>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}>
          <Smartphone size={14} />
          <span>Mobil Uygulama Kontrolü</span>
        </div>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}>
          <Activity size={14} />
          <span>Ücretsiz Sunucu</span>
        </div>
        <div className={`${s.featureTagUnified} ${s.tagBlue}`}>
          Yüksek Hacimli İşlem
        </div>
      </div>

      <div className={s.flatContentUnified}>
        <Section title="Strateji (Overnight & Gün İçi)" icon={<TrendingUp size={18} />}>
          <div className={s.accordionTextUnified} style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
            <p className="mb-2">
              TradeMate'in çekirdeğinde <span className="text-green-400 font-semibold">Overnight stratejisi</span> bulunur. Robot, akşamdan pozisyon açar, ertesi sabah ise gelişmiş algoritmalarla satış işlemlerini gerçekleştirir.
            </p>
            <p>
              İsteğe bağlı olarak <span className="font-bold text-white">gün içi algoritma modu</span> da etkinleştirilebilir. Böylece kullanıcı, hem gece pozisyonlarından hem de seans içi fırsatlardan yararlanabilir.
            </p>
          </div>
        </Section>

        <Section title="Tam Otomasyon & Akıllı Dağılım" icon={<Settings size={18} />}>
          <div className={s.accordionTextUnified} style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
            <p className="mb-3">
              Kullanıcıdan sadece <span className="font-bold text-white">"Aç/Kapat"</span> butonuna dokunması beklenir. Geri kalan her şeyi robot yönetir:
            </p>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span><span className="font-bold text-white">Akıllı Portföy Dağılımı:</span> Seçilen hisselere göre portföyü otomatik böler ve optimum fiyatlardan alım yapar.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span><span className="font-bold text-white">Parçalı İşlem Altyapısı:</span> Büyük emirleri tahtayı bozmadan, kademeli olarak gerçekleştirir.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span><span className="font-bold text-white">Dinamik Parametreler:</span> Her hisse için ayrı algoritma parametreleri hesaplanır ve gerçek zamanlı uygulanır.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span><span className="font-bold text-white">Tatil & Yarım Gün Takibi:</span> Özel takvim algoritması sayesinde müdahaleye gerek kalmadan yönetir.</span>
              </li>
            </ul>
          </div>
        </Section>

        <Section title="Risk Yönetimi" icon={<Shield size={18} />}>
          <div className={s.accordionTextUnified} style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.6 }}>
            <ul className="space-y-2 ml-1">
              <li className="flex items-start gap-2">
                <ShieldAlert size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span><span className="font-bold text-white">Kara Liste & Brüt Takas:</span> İstenmeyen hisselerde işlem yapılmaz, brüt takas/yasaklı hisseler filtrelenir.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldAlert size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span><span className="font-bold text-white">Kredi Kullanımı Kontrolü:</span> Portföyün kaç katına kadar kredi kullanılacağı kullanıcı tarafından belirlenir.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldAlert size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span><span className="font-bold text-white">Rezerve Para Yönetimi:</span> T+2 döneminde para çekmek için portföy fonları kısıtlanabilir.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldAlert size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                <span><span className="font-bold text-white">Tavan Hisse Algoritması:</span> Tavan olan hisselerde özel satış algoritması ile maksimum kâr hedeflenir.</span>
              </li>
            </ul>
          </div>
        </Section>
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
  if (robot.id === "DARKROOM") {
    return <DarkroomPremiumPanel t={t} />;
  }
  if (robot.id === "DARKROOM_SELF") {
    return <DarkroomSelfPanel t={t} />;
  }
  if (robot.id === "HIGHWAY_SELF") {
    return <HighwaySelfPanel t={t} />;
  }
  if (robot.id === "TRADEMATE_SELF") {
    return <TrademateSelfPanel t={t} />;
  }

  const getIcon = () => {
    switch (robot.id) {
      case "DARKROOM":
      case "DARKROOM_SELF":
        return <Shield size={32} />;
      case "HIGHWAY":
      case "HIGHWAY_SELF":
        return <TrendingUp size={32} />;
      case "TRADEMATE":
      case "TRADEMATE_SELF":
        return <Target size={32} />;
      case "FABRIKA":
      case "FABRIKA_SELF":
        return <Activity size={32} />;
      case "KRIPTTOZEKA":
        return <Coins size={32} />;
      case "KRIPTTOZEKA_ASCENT":
      case "KRIPTTOZEKA_SELF":
        return <Bot size={32} />;
      case "FOREXZEKA":
        return <Globe size={32} />;
      default:
        return <Zap size={32} />;
    }
  };

  return (
    <div className={s.robotDetailsPanelUnified} style={{ '--panel-accent': robot.comingSoon ? 'var(--text-muted)' : 'var(--wiz-primary-light)' } as React.CSSProperties}>
      <div className={s.tmHeader}>
        <div className={robot.comingSoon ? s.tmIconGlowMuted : s.tmIconGlowBlue}>
          {getIcon()}
        </div>
        <div>
          <h2 className={`${s.robotNeonTitleUnified} ${robot.comingSoon ? s.neonMuted : s.neonBlue}`}>{t(robot.nameKey)}</h2>
          <p className={s.robotSloganUnified} style={robot.comingSoon ? { opacity: 0.65 } : {}}>{t(robot.descKey)}</p>
        </div>
      </div>

      <div className={s.flatContentUnified} style={{ marginTop: "2rem" }}>
        <div className={s.contentSectionUnified}>
          <h3 className={s.contentSectionTitleUnified}>
            <Zap size={18} />
            {t("wizard.step6.featuresTitle") || "Robot Özellikleri"}
          </h3>
          <ul className={s.unifiedCheckList}>
            {robot.features.map((fKey: string) => (
              <li key={fKey} style={{ alignItems: "flex-start", gap: "0.75rem" }}>
                <CheckCircle2 size={16} style={{ color: "var(--panel-accent)", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.88rem" }}>{t(fKey)}</span>
              </li>
            ))}
          </ul>
        </div>
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
    <div className={s.annualPlanBox}>
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
        className={s.annualPlanBtn}
      >
        Yıllık Avantajla Satın Al
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}
