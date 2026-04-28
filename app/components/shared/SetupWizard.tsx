"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Lock,
  LogIn,
  Bot,
  Link2,
  ArrowRight,
  ExternalLink,
  Plus,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import s from "./setup-wizard.module.css";

// ─── Props ────────────────────────────────────────────────────────────────────
export interface SetupWizardProps {
  /** Step 1 — Sign In. Always true when logged in. */
  step1Completed: boolean;
  /** Step 2 — Subscribe/Robot. True when robot is selected AND active. */
  step2Completed: boolean;
  /** Step 2 pending — payment being verified. */
  step2Pending?: boolean;
  /** Step 3 — Connect broker account. */
  step3Completed: boolean;
  /**
   * Variant controls layout context.
   * "landing"   → compact card inside existing section, used inside OnboardingSteps
   * "dashboard" → compact widget without section wrapper, used in DashboardHomeClient
   */
  variant?: "landing" | "dashboard";
  /**
   * When true, the wizard never returns null (even if all steps complete).
   * Use on the Landing Page where the section should always be visible for marketing.
   */
  alwaysVisible?: boolean;
  /** Optional CSS class for the root element. */
  className?: string;
}

// ─── Sub-component: Step connector ───────────────────────────────────────────
function StepConnector({ done }: { done: boolean }) {
  return (
    <div className={s.connector} aria-hidden="true">
      <div className={`${s.connectorLine} ${done ? s.connectorLineDone : ""}`} />
      <ArrowRight
        size={13}
        className={`${s.connectorArrow} ${done ? s.connectorArrowDone : ""}`}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SetupWizard({
  step1Completed,
  step2Completed,
  step2Pending = false,
  step3Completed,
  variant = "dashboard",
  alwaysVisible = false,
  className = "",
}: SetupWizardProps) {
  const { t } = useTranslation("common");
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Step 3 is locked until both step 1 & 2 are done
  const step3Locked = !step1Completed || !step2Completed;

  // Progress
  const completedCount =
    (step1Completed ? 1 : 0) +
    (step2Completed ? 1 : 0) +
    (step3Completed ? 1 : 0);
  const progressPct = (completedCount / 3) * 100;

  // If everything is done, hide the widget entirely (unless alwaysVisible)
  if (!alwaysVisible && step1Completed && step2Completed && step3Completed) return null;

  // ── Step definitions ──────────────────────────────────────────────────────
  const steps = [
    {
      num: 1,
      icon: LogIn,
      done: step1Completed,
      pending: false,
      locked: false,
      titleKey: step1Completed
        ? "setupWizard.step1.titleDone"
        : "setupWizard.step1.titlePending",
      descKey: "setupWizard.step1.desc",
      ctaLabel: null as string | null, // no CTA — user is always signed in in our context
      ctaHref: null as string | null,
    },
    {
      num: 2,
      icon: Bot,
      done: step2Completed,
      pending: step2Pending,
      locked: !step1Completed,
      titleKey: "setupWizard.step2.title",
      descKey: step2Pending
        ? "setupWizard.step2.descPending"
        : "setupWizard.step2.desc",
      ctaLabel: step2Pending
        ? t("setupWizard.step2.ctaPending")
        : t("setupWizard.step2.cta"),
      ctaHref: step2Pending ? null : "/urun-sec",
    },
    {
      num: 3,
      icon: Link2,
      done: step3Completed,
      pending: false,
      locked: step3Locked,
      titleKey: "setupWizard.step3.title",
      descKey: step3Locked
        ? "setupWizard.step3.descLocked"
        : "setupWizard.step3.desc",
      ctaLabel: null as string | null,
      ctaHref: null as string | null,
    },
  ];

  const rootClass = [
    s.root,
    variant === "landing" ? s.rootLanding : s.rootDashboard,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      {/* ── Ambient glow blobs ──────────────────────────────────────────── */}
      <div className={s.glowTopLeft} aria-hidden="true" />
      <div className={s.glowBottomRight} aria-hidden="true" />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <div className={s.sparkleIcon}>
            <Sparkles size={15} />
          </div>
          <div>
            <div className={s.headerTitle}>{t("setupWizard.title")}</div>
            <div className={s.headerSub}>
              {t("setupWizard.stepsCompleted", {
                completed: completedCount,
                total: 3,
              })}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className={s.progressBar}>
          <div className={s.progressTrack}>
            <motion.div
              className={s.progressFill}
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            {progressPct > 0 && (
              <div
                className={s.progressDot}
                style={{ left: `${progressPct}%` }}
              />
            )}
          </div>
          <span className={s.progressLabel}>{Math.round(progressPct)}%</span>
        </div>
      </div>

      {/* ── Step cards row ──────────────────────────────────────────────── */}
      <div className={s.stepsRow}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isHovered = hoveredStep === step.num;
          const isInteractive = !step.done && !step.locked;

          // Card state class
          const cardStateClass = step.done
            ? s.stepCardDone
            : step.locked
            ? s.stepCardLocked
            : s.stepCardActive;

          return (
            <div key={step.num} className={s.stepAndConnector}>
              {/* Connector before steps 2 & 3 */}
              {idx > 0 && (
                <StepConnector done={steps[idx - 1].done && !steps[idx - 1].pending} />
              )}

              <motion.div
                layout
                className={`${s.stepCard} ${cardStateClass}`}
                onMouseEnter={() => {
                  if (!step.locked) setHoveredStep(step.num);
                }}
                onMouseLeave={() => setHoveredStep(null)}
                animate={{
                  y: isHovered ? -4 : 0,
                  boxShadow: isHovered
                    ? "0 8px 32px rgba(16,185,129,0.15), 0 0 0 1px rgba(16,185,129,0.18)"
                    : step.done
                    ? "0 0 0 1px rgba(16,185,129,0.12)"
                    : "none",
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Lock overlay */}
                {step.locked && (
                  <div className={s.lockOverlay} aria-hidden="true">
                    <Lock size={26} className={s.lockIcon} />
                  </div>
                )}

                {/* Hover glow */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className={s.hoverGlow}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>

                {/* ── Icon row ──────────────────────────────────────── */}
                <div className={s.iconRow}>
                  <div
                    className={`${s.iconBox} ${
                      step.done
                        ? s.iconBoxDone
                        : isHovered
                        ? s.iconBoxHovered
                        : ""
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Status badge */}
                  {step.done ? (
                    <span className={`${s.badge} ${s.badgeDone}`}>
                      <Check size={10} />
                      {t("setupWizard.done")}
                    </span>
                  ) : step.pending ? (
                    <span className={`${s.badge} ${s.badgePending}`}>
                      {t("setupWizard.checking")}
                    </span>
                  ) : step.locked ? (
                    <span className={`${s.badge} ${s.badgeLocked}`}>
                      <Lock size={9} />
                      {t("setupWizard.locked")}
                    </span>
                  ) : null}
                </div>

                {/* ── Step number & title ───────────────────────── */}
                <div className={s.stepMeta}>
                  <span className={s.stepNum}>
                    {t("setupWizard.step", { num: step.num })}
                  </span>
                </div>
                <div className={s.stepTitle}>{t(step.titleKey)}</div>
                <div className={s.stepDesc}>{t(step.descKey)}</div>

                {/* ── CTA ──────────────────────────────────────── */}
                {/* Step 3 special: two buttons */}
                {step.num === 3 && !step.done && !step.locked && (
                  <div className={s.ctaStack}>
                    <a
                      href="https://t.co/kUUMsLhRJZ?amp=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.ctaPrimary}
                      id="setup-wizard-open-account"
                    >
                      <ExternalLink size={15} />
                      {t("setupWizard.step3.openAccount")}
                    </a>
                    <Link
                      href="/dashboard/accounts/add-forex"
                      className={s.ctaSecondary}
                      id="setup-wizard-add-forex"
                    >
                      <Plus size={15} />
                      {t("setupWizard.step3.addForex")}
                    </Link>
                  </div>
                )}

                {/* Steps 1 & 2 CTA */}
                {step.num !== 3 && !step.done && !step.locked && step.ctaHref && (
                  <Link
                    href={step.ctaHref}
                    className={s.ctaInline}
                    id={`setup-wizard-step${step.num}-cta`}
                  >
                    {step.ctaLabel}
                    <ArrowRight size={14} className={s.ctaArrow} />
                  </Link>
                )}

                {step.num !== 3 && !step.done && !step.locked && !step.ctaHref && step.ctaLabel && (
                  <span className={`${s.ctaInline} ${s.ctaDisabled}`}>
                    {step.ctaLabel}
                  </span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
