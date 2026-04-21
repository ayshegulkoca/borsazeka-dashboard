"use client";

import Link from "next/link";
import { Bot, Link2, Check, ArrowRight, Sparkles, TrendingUp, ExternalLink, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface Props {
  hasRobots: boolean;
  hasBrokerAccounts: boolean;
  hasForexAccount?: boolean;
  subscriptionStatus?: string;
}

// Completely hidden if fully set up
export default function OnboardingProgressWidget({ hasRobots, hasBrokerAccounts, hasForexAccount = false, subscriptionStatus }: Props) {
  const { t } = useTranslation("common");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  if (hasRobots && hasBrokerAccounts && hasForexAccount) return null;

  const isPending = subscriptionStatus === "PENDING";

  const steps = [
    {
      id: "robot",
      num: "1",
      title: t("dashboard.onboarding.step1Title"),
      desc: isPending
        ? t("dashboard.onboarding.step1DescPending")
        : t("dashboard.onboarding.step1Desc"),
      done: hasRobots,
      pending: isPending,
      locked: false,
      href: "/urun-sec",
      cta: isPending
        ? t("dashboard.onboarding.step1CtaPending")
        : t("dashboard.onboarding.step1Cta"),
      icon: Bot,
    },
    {
      id: "account",
      num: "2",
      title: t("dashboard.onboarding.step2Title"),
      desc: t("dashboard.onboarding.step2Desc"),
      done: hasBrokerAccounts,
      locked: !hasRobots,
      href: "/kurulum",
      cta: t("dashboard.onboarding.step2Cta"),
      icon: Link2,
    },
    {
      id: "forex",
      num: "3",
      title: t("dashboard.onboarding.step3Title"),
      desc: t("dashboard.onboarding.step3Desc"),
      done: hasForexAccount,
      locked: false,
      href: "#",
      cta: "",
      icon: TrendingUp,
      isForexCard: true,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const progressPct = (completedCount / steps.length) * 100;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,150,105,0.03) 100%)",
        border: "1px solid rgba(16,185,129,0.18)",
        borderRadius: "16px",
        padding: "1.5rem",
        marginBottom: "1.75rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle glow top-left */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-40px",
          left: "-40px",
          width: "160px",
          height: "160px",
          background: "radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              background: "rgba(16,185,129,0.12)",
              borderRadius: "8px",
              padding: "0.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-primary)",
            }}
          >
            <Sparkles size={15} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.975rem", color: "var(--text-primary)" }}>
              {t("dashboard.onboarding.widgetTitle")}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
              {t("dashboard.onboarding.stepsCompleted", { completed: completedCount, total: steps.length })}
            </div>
          </div>
        </div>

        {/* Progress pill — daha kalın + parlayan uç */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "120px",
              height: "10px",
              borderRadius: "100px",
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))",
                borderRadius: "100px",
                transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                position: "relative",
                minWidth: progressPct > 0 ? "10px" : "0",
              }}
            >
              {/* Parlayan uç nokta */}
              {progressPct > 0 && (
                <div
                  style={{
                    position: "absolute",
                    right: "-1px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "var(--accent-primary)",
                    boxShadow: "0 0 10px rgba(16,185,129,0.6), 0 0 20px rgba(16,185,129,0.3)",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                />
              )}
            </div>
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {Math.round(progressPct)}%
          </span>
        </div>
      </div>

      {/* Step cards — centered with equal height */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        {steps.map((step) => {
          const Icon = step.icon;
          const isHovered = hoveredCard === step.id;
          const isInteractive = !step.done && !step.locked;

          return (
            <div
              key={step.id}
              onMouseEnter={() => isInteractive || (step as any).isForexCard ? setHoveredCard(step.id) : null}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                background: step.done
                  ? "rgba(16,185,129,0.08)"
                  : step.locked
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(255,255,255,0.04)",
                border: step.done
                  ? "1px solid rgba(16,185,129,0.25)"
                  : isHovered
                  ? "1px solid rgba(16,185,129,0.45)"
                  : step.locked
                  ? "1px dashed rgba(255,255,255,0.08)"
                  : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "1.25rem 1.25rem 1rem",
                opacity: step.locked ? 0.5 : 1,
                transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                pointerEvents: step.locked ? "none" : "auto",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isHovered
                  ? "0 8px 24px rgba(16,185,129,0.12), 0 0 0 1px rgba(16,185,129,0.15)"
                  : "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Hover glow overlay */}
              {isHovered && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.08), transparent 70%)",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Icon + Done check */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", position: "relative" }}>
                {/* İkon — soft background */}
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: step.done
                      ? "rgba(16,185,129,0.15)"
                      : isHovered
                      ? "rgba(16,185,129,0.12)"
                      : "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: step.done || isHovered ? "var(--accent-primary)" : "var(--text-muted)",
                    transition: "all 0.3s ease",
                    boxShadow: step.done
                      ? "0 0 12px rgba(16,185,129,0.15)"
                      : isHovered
                      ? "0 0 12px rgba(16,185,129,0.1)"
                      : "none",
                  }}
                >
                  <Icon size={20} />
                </div>
                {step.done ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--accent-primary)",
                      background: "rgba(16,185,129,0.12)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "100px",
                    }}
                  >
                    <Check size={10} />
                    {t("dashboard.onboarding.done")}
                  </span>
                ) : (step as any).pending ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "#fbbf24",
                      background: "rgba(251,191,36,0.12)",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "100px",
                    }}
                  >
                    {t("dashboard.onboarding.checking")}
                  </span>
                ) : null}
              </div>

              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", marginBottom: "0.35rem" }}>
                {step.title}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.5rem", paddingBottom: "1rem" }}>
                {step.desc}
              </div>

              {/* Forex card gets two buttons instead of a single CTA */}
              {(step as any).isForexCard && !step.done ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "auto" }}>
                  <a
                    href="https://t.co/kUUMsLhRJZ?amp=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--bg-dark, #0d1117)",
                      background: "var(--accent-primary)",
                      border: "none",
                      borderRadius: "12px",
                      padding: "0.85rem 1.25rem",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 4px 12px rgba(16,185,129,0.2), 0 0 0 1px rgba(16,185,129,0.1)",
                    }}
                  >
                    <ExternalLink size={16} />
                    {t("dashboard.onboarding.step3OpenAccount")}
                  </a>
                  <Link
                    href="/dashboard/accounts/add-forex"
                    style={{
                      width: "100%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "12px",
                      padding: "0.75rem 1.25rem",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(16,185,129,0.08)";
                      e.currentTarget.style.borderColor = "rgba(16,185,129,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    }}
                  >
                    <Plus size={16} />
                    {t("dashboard.onboarding.step3AddForex")}
                  </Link>
                </div>
              ) : !step.done && !step.locked && !(step as any).isForexCard ? (
                <Link
                  href={(step as any).pending ? "#" : step.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: (step as any).pending ? "var(--text-muted)" : "var(--accent-primary)",
                    textDecoration: "none",
                    cursor: (step as any).pending ? "default" : "pointer",
                    pointerEvents: (step as any).pending ? "none" : "auto",
                    transition: "gap 0.2s ease, opacity 0.2s",
                    marginTop: "auto",
                  }}
                >
                  {step.cta}
                  {!(step as any).pending && <ArrowRight size={14} style={{ transition: "transform 0.2s" }} />}
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
