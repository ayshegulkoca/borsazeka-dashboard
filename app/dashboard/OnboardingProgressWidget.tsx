"use client";

import Link from "next/link";
import { Bot, Link2, Check, ArrowRight, Sparkles } from "lucide-react";

interface Props {
  hasRobots: boolean;
  hasBrokerAccounts: boolean;
}

// Completely hidden if fully set up
export default function OnboardingProgressWidget({ hasRobots, hasBrokerAccounts }: Props) {
  if (hasRobots && hasBrokerAccounts) return null;

  const steps = [
    {
      id: "robot",
      num: "1",
      title: "Size uygun robota abone olun",
      desc: "Robot vitrinine göz atın, stratejinize uygun robota abone olun.",
      done: hasRobots,
      locked: false,
      href: "/#robotlarimiz",
      cta: "Robota Abone Ol",
      icon: Bot,
    },
    {
      id: "account",
      num: "2",
      title: "Hesabınızı Bağlayın",
      desc: "Aracı kurum veya Binance API bilgilerinizi güvenle girin.",
      done: hasBrokerAccounts,
      locked: !hasRobots,
      href: "/kurulum",
      cta: "Kuruluma Başla",
      icon: Link2,
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
              Kurulumu Tamamla
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
              {completedCount} / {steps.length} adım tamamlandı
            </div>
          </div>
        </div>

        {/* Progress pill */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "100px",
              height: "6px",
              borderRadius: "100px",
              background: "rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))",
                borderRadius: "100px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {Math.round(progressPct)}%
          </span>
        </div>
      </div>

      {/* Step cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              style={{
                background: step.done
                  ? "rgba(16,185,129,0.08)"
                  : step.locked
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(255,255,255,0.04)",
                border: step.done
                  ? "1px solid rgba(16,185,129,0.25)"
                  : step.locked
                  ? "1px dashed rgba(255,255,255,0.08)"
                  : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "1rem 1rem 0.85rem",
                opacity: step.locked ? 0.5 : 1,
                transition: "all 0.2s",
                pointerEvents: step.locked ? "none" : "auto",
              }}
            >
              {/* Icon + Done check */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: step.done
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: step.done ? "var(--accent-primary)" : "var(--text-muted)",
                  }}
                >
                  <Icon size={18} />
                </div>
                {step.done && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--accent-primary)",
                      background: "rgba(16,185,129,0.12)",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "100px",
                    }}
                  >
                    <Check size={10} />
                    Tamamlandı
                  </span>
                )}
              </div>

              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                {step.title}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4, marginBottom: "0.85rem" }}>
                {step.desc}
              </div>

              {!step.done && !step.locked && (
                <Link
                  href={step.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--accent-primary)",
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                >
                  {step.cta}
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
