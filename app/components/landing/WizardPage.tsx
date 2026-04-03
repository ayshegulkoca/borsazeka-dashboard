"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, Globe, MapPin,
  Users, Lock, Bot, CheckCircle2, Send, ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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
import s from "./wizard.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────
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
}

const TOTAL = 6;
const STEP_LABELS = ["Piyasa", "Alt Piyasa", "Yönetim", "Robot", "Bütçe", "Özet"];

// ─── Main ────────────────────────────────────────────────────────────────────
export default function WizardPage() {
  const { t } = useTranslation("common");

  const [state, setState] = useState<WState>({
    step: 1, market: null, subMarket: null, managementType: null,
    robotId: null, budgetValue: null, budgetLabel: null,
    budgetCurrency: "TRY", selectedBudgetComingSoon: false,
  });
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyDone, setNotifyDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  const patch = (p: Partial<WState>) => setState(prev => ({ ...prev, ...p }));

  // ── can proceed? ────────────────────────────────────────────────────────────
  const canNext = () => {
    if (state.step === 1) return state.market !== null;
    if (state.step === 2) return state.subMarket !== null;
    if (state.step === 3) return state.managementType !== null;
    if (state.step === 4) return state.robotId !== null;
    if (state.step === 5) return state.robotId === "CLASSIC" || state.budgetValue !== null;
    return true;
  };

  const goNext = () => {
    if (!canNext()) return;
    if (state.step === 1 && state.market === "BIST") { patch({ subMarket: "BIST", step: 3 }); return; }
    patch({ step: state.step + 1 });
  };

  const goBack = () => {
    if (state.step === 3 && state.market === "BIST") { patch({ step: 1 }); return; }
    if (state.step === 6 && state.robotId === "CLASSIC") { patch({ step: 4 }); return; }
    patch({ step: state.step - 1 });
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

  // ── submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (submitting || isPaymentBlocked) return;
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          market: state.market, subMarket: state.subMarket,
          managementType: state.managementType,
          robotId: state.robotId,
          robotName: selectedRobot ? t(selectedRobot.nameKey) : state.robotId,
          budgetValue: state.budgetValue ?? 0,
          budgetCurrency: state.budgetCurrency,
          ...(pricing ?? {}),
        }),
      });
      setSubmitDone(true);
    } catch { /* graceful */ }
    finally { setSubmitting(false); }
  };

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;
    // TODO: POST to leads API with email + robotId
    setNotifyDone(true);
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

      {/* Header */}
      <div className={s.wizardHeader}>
        <h1 className={s.wizardTitle}>{t("wizard.title")}</h1>
        <p className={s.wizardSubtitle}>{t("wizard.subtitle")}</p>
      </div>

      {/* Stepper */}
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

      {/* Content */}
      <div className={s.stepCard}>
        <div className={s.stepCardInner}>

          {/* ── STEP 1 ── */}
          {state.step === 1 && (
            <>
              <span className={s.stepTag}>{t("wizard.stepOf", { current: 1, total: TOTAL })}</span>
              <h2 className={s.stepTitle}>{t("wizard.step1.title")}</h2>
              <div className={s.optionGrid}>
                <OptionCard selected={state.market === "BIST"}
                  icon={<MapPin size={22} color="var(--accent-primary)" />}
                  label={t("wizard.step1.domestic")} desc={t("wizard.step1.domesticDesc")}
                  onClick={() => {
                    patch({ market: "BIST", subMarket: "BIST", robotId: null, budgetValue: null });
                  }} />
                <OptionCard selected={state.market === "CRYPTO" || state.market === "FOREX"}
                  icon={<Globe size={22} color="var(--accent-primary)" />}
                  label={t("wizard.step1.international")} desc={t("wizard.step1.internationalDesc")}
                  onClick={() => {
                    patch({ market: "CRYPTO", subMarket: null, robotId: null, budgetValue: null });
                  }} />
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {state.step === 2 && (
            <>
              <span className={s.stepTag}>{t("wizard.stepOf", { current: 2, total: TOTAL })}</span>
              <h2 className={s.stepTitle}>{t("wizard.step2.title")}</h2>
              <div className={`${s.optionGrid} ${s.optionGrid3}`}>
                <OptionCard selected={state.subMarket === "CRYPTO"}
                  icon={<Bot size={22} color="var(--accent-primary)" />}
                  label={t("wizard.step2.crypto")} desc={t("wizard.step2.cryptoDesc")}
                  onClick={() => {
                    patch({ subMarket: "CRYPTO", market: "CRYPTO", robotId: null, budgetValue: null, budgetCurrency: "USD" });
                  }} />
                <OptionCard selected={state.subMarket === "FOREX"}
                  icon={<Globe size={22} color="var(--accent-primary)" />}
                  label={t("wizard.step2.forex")} desc={t("wizard.step2.forexDesc")}
                  onClick={() => {
                    patch({ subMarket: "FOREX", market: "FOREX", robotId: null, budgetValue: null, budgetCurrency: "USD" });
                  }} />
              </div>
            </>
          )}

          {/* ── STEP 3 ── */}
          {state.step === 3 && (
            <>
              <span className={s.stepTag}>{t("wizard.stepOf", { current: 3, total: TOTAL })}</span>
              <h2 className={s.stepTitle}>{t("wizard.step3.title")}</h2>
              <div className={s.optionGrid}>
                <OptionCard selected={state.managementType === "PREMIUM"}
                  icon={<Users size={22} color="var(--accent-primary)" />}
                  label={t("wizard.step3.premium")} desc={t("wizard.step3.premiumDesc")}
                  onClick={() => {
                    patch({ managementType: "PREMIUM", robotId: null });
                  }} />
                <OptionCard selected={state.managementType === "SELF_SERVICE"}
                  icon={<Lock size={22} color="var(--accent-primary)" />}
                  label={t("wizard.step3.selfService")} desc={t("wizard.step3.selfServiceDesc")}
                  comingSoon comingSoonLabel={t("wizard.comingSoonBadge")}
                  onClick={() => {
                    patch({ managementType: "SELF_SERVICE", robotId: null });
                  }} />
              </div>
              {state.managementType === "SELF_SERVICE" && (
                <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: 10, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  {t("wizard.step3.selfServiceComingSoon")}
                </div>
              )}
            </>
          )}

          {/* ── STEP 4 ── */}
          {state.step === 4 && (
            <>
              <span className={s.stepTag}>{t("wizard.stepOf", { current: 4, total: TOTAL })}</span>
              <h2 className={s.stepTitle}>{t("wizard.step4.title")}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {availableRobots.map((robot: RobotDefinition) => (
                  <RobotCard key={robot.id} robot={robot}
                    selected={state.robotId === robot.id} t={t}
                    onClick={() => patch({ robotId: robot.id, budgetValue: null, budgetLabel: null, selectedBudgetComingSoon: false })} />
                ))}
              </div>
            </>
          )}

          {/* ── STEP 5 ── */}
          {state.step === 5 && (
            <>
              <span className={s.stepTag}>{t("wizard.stepOf", { current: 5, total: TOTAL })}</span>
              <h2 className={s.stepTitle}>{t("wizard.step5.title")}</h2>
              {state.robotId === "CLASSIC" ? (
                <div style={{ padding: "2rem", textAlign: "center", background: "rgba(139,92,246,0.05)", borderRadius: 16, border: "1px dashed rgba(139,92,246,0.3)" }}>
                  <p style={{ color: "#a78bfa", fontWeight: 600, marginBottom: "0.5rem" }}>
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
                        onClick={() => patch({ budgetValue: opt.value, budgetLabel: opt.label, selectedBudgetComingSoon: opt.comingSoon ?? false })}>
                        {opt.label}
                        {opt.comingSoon && <span className={s.budgetComingSoonTag}>Yakında</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── STEP 6 ── */}
          {state.step === 6 && (
            <>
              {submitDone ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                    Talebiniz Alındı!
                  </h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    En kısa sürede Telegram veya e-posta ile size ulaşacağız.
                  </p>
                  <Link href="/iletisim" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                    İletişim sayfasına git →
                  </Link>
                </div>
              ) : (
                <>
                  <span className={s.stepTag}>{t("wizard.stepOf", { current: 6, total: TOTAL })}</span>
                  <h2 className={s.stepTitle}>{t("wizard.step6.title")}</h2>
                  <div className={s.summaryGrid}>
                    {/* Left: selections */}
                    <div className={s.summaryCard}>
                      <div className={s.summaryTitle}>{t("wizard.step6.selectedRobot")}</div>
                      <div className={s.summaryRow}>
                        <div className={s.summaryRowLabel}>{t("wizard.step6.selectedRobot")}</div>
                        <div className={`${s.summaryRowValue} ${s.summaryRowValueAccent}`}>
                          {selectedRobot ? t(selectedRobot.nameKey) : "—"}
                          {selectedRobot?.comingSoon && (
                            <span style={{ fontSize: "0.62rem", marginLeft: 6, padding: "0.15rem 0.5rem", borderRadius: 100, background: "rgba(139,92,246,0.15)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)" }}>
                              Pek Yakında
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={s.summaryRow}>
                        <div className={s.summaryRowLabel}>{t("wizard.step6.market")}</div>
                        <div className={s.summaryRowValue}>{state.subMarket ?? state.market}</div>
                      </div>
                      {state.budgetLabel && (
                        <div className={s.summaryRow}>
                          <div className={s.summaryRowLabel}>{t("wizard.step6.budget")}</div>
                          <div className={s.summaryRowValue}>{state.budgetLabel}</div>
                        </div>
                      )}
                      {pricing?.note && (
                        <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.75rem", borderRadius: 8, background: "rgba(16,185,129,0.06)", fontSize: "0.78rem", color: "var(--accent-primary)" }}>
                          {pricing.note}
                        </div>
                      )}
                    </div>

                    {/* Right: pricing or coming-soon */}
                    {isPaymentBlocked ? (
                      <ComingSoonPanel
                        robot={selectedRobot}
                        notifyEmail={notifyEmail}
                        notifyDone={notifyDone}
                        onEmailChange={setNotifyEmail}
                        onNotify={handleNotify}
                        t={t}
                      />
                    ) : pricing ? (
                      <div className={s.summaryCard}>
                        <div className={s.summaryTitle}>Fiyat Detayı</div>
                        <div className={s.summaryRow}>
                          <div>
                            <div className={s.summaryRowLabel}>{t("wizard.step6.setupFee")}</div>
                            <div className={s.summaryRowNote}>{t("wizard.step6.setupFeeNote")}</div>
                          </div>
                          <div className={s.summaryRowValue}>{pricing.setupFeeEUR > 0 ? `€${pricing.setupFeeEUR}` : "—"}</div>
                        </div>
                        <div className={s.summaryRow}>
                          <div>
                            <div className={s.summaryRowLabel}>{t("wizard.step6.serverCost")}</div>
                            <div className={s.summaryRowNote}>{t("wizard.step6.serverCostNote")}</div>
                          </div>
                          <div className={s.summaryRowValue}>€{pricing.serverCostDisplay}/ay</div>
                        </div>
                        <div className={s.summaryRow}>
                          <div>
                            <div className={s.summaryRowLabel}>{t("wizard.step6.profitShare")}</div>
                            <div className={s.summaryRowNote}>
                              {pricing.profitSharePercent > 0 ? t("wizard.step6.profitShareNote") : t("wizard.step6.profitShareNA")}
                            </div>
                          </div>
                          <div className={`${s.summaryRowValue} ${s.summaryRowValueAccent}`}>
                            {pricing.profitSharePercent > 0 ? `%${pricing.profitSharePercent}` : "—"}
                          </div>
                        </div>
                        <div className={s.summaryTotalRow}>
                          <span className={s.summaryTotalLabel}>{t("wizard.step6.totalMonthly")}</span>
                          <span className={s.summaryTotalValue}>€{pricing.serverCostDisplay}/ay</span>
                        </div>
                        <p className={s.summaryTerms}>{t("wizard.step6.terms")}</p>
                        <button className={s.btnWizardSubmit}
                          style={{ width: "100%", marginTop: "1rem", justifyContent: "center" }}
                          onClick={handleSubmit} disabled={submitting}>
                          {submitting ? t("wizard.submitting") : t("wizard.step6.subscribeBtn")}
                          {!submitting && <ArrowRight size={16} />}
                        </button>
                      </div>
                    ) : (
                      <div className={s.outOfRangeWarn}>{t("wizard.step6.outOfRange")}</div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* Navigation */}
          {!submitDone && (
            <div className={s.wizardNav}>
              {state.step > 1 ? (
                <button className={s.btnWizardBack} onClick={goBack}>
                  <ArrowLeft size={16} /> {t("wizard.back")}
                </button>
              ) : <div />}
              {state.step < TOTAL && (
                <button className={s.btnWizardNext} onClick={goNext} disabled={!canNext()}>
                  {t("wizard.next")} <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── ComingSoon Panel ─────────────────────────────────────────────────────────
function ComingSoonPanel({ robot, notifyEmail, notifyDone, onEmailChange, onNotify, t }: {
  robot?: RobotDefinition;
  notifyEmail: string;
  notifyDone: boolean;
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
              <Check size={13} color="var(--accent-primary)" /> {t(fKey)}
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
          <button type="submit" className={s.notifyBtn}>{t("wizard.step6.notifySubmit")}</button>
        </form>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", color: "var(--accent-primary)", fontWeight: 600, fontSize: "0.875rem" }}>
          <CheckCircle2 size={17} /> Kaydedildi — haberdar edeceğiz!
        </div>
      )}
    </div>
  );
}

// ─── OptionCard ───────────────────────────────────────────────────────────────
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
      <div className={s.optionCheck}><Check size={12} color="#022c22" /></div>
      <div className={s.optionIcon}>{icon}</div>
      <div className={s.optionLabel}>{label}</div>
      <div className={s.optionDesc}>{desc}</div>
    </div>
  );
}

// ─── RobotCard ────────────────────────────────────────────────────────────────
function RobotCard({ robot, selected, t, onClick }: {
  robot: RobotDefinition; selected: boolean;
  t: (k: string) => string; onClick: () => void;
}) {
  return (
    <div
      className={`${s.robotOptionCard} ${selected ? s.optionCardSelected : ""} ${robot.comingSoon ? s.robotCardComingSoon : ""}`}
      onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}>
      {robot.comingSoon && <span className={s.comingSoonBadge}>{t("wizard.comingSoonBadge")}</span>}
      {selected && !robot.comingSoon && (
        <div style={{ position: "absolute", top: "1rem", right: "1rem", width: 22, height: 22, borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={13} color="#022c22" />
        </div>
      )}
      <div className={s.robotHeader}>
        <div className={s.robotNameWrap}>
          <span className={s.robotName}>{t(robot.nameKey)}</span>
          <span className={s.robotDesc}>{t(robot.descKey)}</span>
        </div>
        {robot.maxCapacity > 0 && (
          <span className={s.robotCapacity}>
            {t("wizard.step4.capacity")}: {robot.maxCapacity} {t("wizard.step4.capacityUnit")}
          </span>
        )}
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
