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
  LayoutGrid,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
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
function StepConnector() {
  return (
    <div className={s.connector} aria-hidden="true" />
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
  const { data: session } = useSession();
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

      {/* ── Header Row: title + progress ────────────────────────────────── */}
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

      {/* ── Steps Row: 3 pills side by side ─────────────────────────────── */}
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
              {idx > 0 && <StepConnector />}

              <motion.div
                layout
                className={`${s.stepCard} ${cardStateClass}`}
                onMouseEnter={() => {
                  if (!step.locked) setHoveredStep(step.num);
                }}
                onMouseLeave={() => setHoveredStep(null)}
                animate={{
                  y: isHovered ? -3 : 0,
                  boxShadow: isHovered
                    ? "0 8px 32px rgba(29, 78, 216, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.25)"
                    : step.done
                    ? "0 0 0 1px rgba(29, 78, 216, 0.18)"
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
                    <Icon size={16} />
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
                
                {/* ── CUSTOM STEP CONTENT ────────────────────────── */}
                
                {/* Step 1: Profile view when done */}
                {step.num === 1 && step.done && (
                  <div className={s.step1Content}>
                    <div className={s.profileBox}>
                      <div className={s.profileAvatarWrapper}>
                        {session?.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            width={36}
                            height={36}
                            className={s.profileAvatar}
                          />
                        ) : (
                          <div className={s.profileAvatarPlaceholder}>
                            <LogIn size={16} />
                          </div>
                        )}
                      </div>
                      <div className={s.profileInfo}>
                        <div className={s.profileName}>{session?.user?.name}</div>
                        <div className={s.profileEmail}>{session?.user?.email}</div>
                      </div>
                    </div>
                    <button 
                      className={s.profileSwitch}
                      onClick={async () => {
                        await signOut({ redirect: false });
                        signIn("google", { callbackUrl: "/dashboard" });
                      }}
                    >
                      {t("onboardingSteps.step1.switchAccount")}
                    </button>
                  </div>
                )}
                
                {/* Step 1: Default desc when not done */}
                {step.num === 1 && !step.done && (
                  <div className={s.stepDesc}>{t(step.descKey)}</div>
                )}

                {/* Step 2: Multi-option paths when active */}
                {step.num === 2 && !step.done && !step.locked && !step.pending && (
                  <div className={s.optionList}>
                    <Link href="/robotlar" className={s.optionCard}>
                      <span className={s.optionText}>
                        {t("onboardingSteps.step2.optionATitle")}
                      </span>
                    </Link>
                    <Link href="/urun-sec" className={s.optionCard}>
                      <span className={s.optionText}>
                        {t("onboardingSteps.step2.optionBTitle")}
                      </span>
                    </Link>
                  </div>
                )}

                {/* Step 2: Default desc when done, locked or pending */}
                {step.num === 2 && (step.done || step.locked || step.pending) && (
                  <div className={s.stepDesc}>{t(step.descKey)}</div>
                )}

                {/* Step 3: Checklist layout */}
                {step.num === 3 && (
                  <div className={s.step3Content}>
                    <div className={s.checklist}>
                      <div className={`${s.checkItem} ${step1Completed ? s.checkItemDone : ""}`}>
                        <Check size={12} className={s.checkSmall} />
                        <span>{t("onboardingSteps.step3.checklist1")}</span>
                      </div>
                      <div className={`${s.checkItem} ${step2Completed ? s.checkItemDone : ""}`}>
                        {step2Completed ? <Check size={12} className={s.checkSmall} /> : <Lock size={12} className={s.checkSmall} />}
                        <span>{t("onboardingSteps.step3.checklist2")}</span>
                      </div>
                    </div>
                    
                    {!step.done && !step.locked && (
                      <div className={s.ctaStack}>
                        <Link
                          href="/forex"
                          className={s.ctaPrimary}
                          id="setup-wizard-open-account"
                        >
                          <ExternalLink size={15} />
                          {t("setupWizard.step3.openAccount")}
                        </Link>
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
                  </div>
                )}

                {/* Legacy CTA logic for steps 1 & 2 — only if needed */}
                {step.num !== 3 && !step.done && !step.locked && step.ctaHref && step.num !== 2 && (
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
