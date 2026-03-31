"use client";

import { useSearchParams } from "next/navigation";
import { useTransition, Suspense } from "react";
import { activateSubscription } from "@/app/actions/subscription";
import { Activity, CheckCircle, CreditCard, Lock, Zap } from "lucide-react";
import styles from "./checkout.module.css";

type PlanType = "STARTER" | "PRO" | "ENTERPRISE";

const PLAN_INFO: Record<PlanType, { name: string; price: string; robots: string; color: string }> = {
  STARTER: { name: "Başlangıç", price: "₺199", robots: "2 Robot", color: "#64748b" },
  PRO: { name: "Pro", price: "₺499", robots: "10 Robot", color: "var(--accent-primary)" },
  ENTERPRISE: { name: "Kurumsal", price: "₺1.499", robots: "Sınırsız Robot", color: "#a78bfa" },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const rawPlan = searchParams.get("plan") ?? "PRO";
  const plan: PlanType = (["STARTER", "PRO", "ENTERPRISE"].includes(rawPlan)
    ? rawPlan
    : "PRO") as PlanType;
  const info = PLAN_INFO[plan];
  const [isPending, startTransition] = useTransition();

  const handleActivate = () => {
    startTransition(async () => {
      await activateSubscription(plan);
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <Activity size={20} color="#022c22" strokeWidth={2.5} />
          </div>
          <span className={styles.logoText}>BorsaZeka</span>
        </div>

        <h1 className={styles.title}>Aboneliğinizi Başlatın</h1>
        <p className={styles.subtitle}>Planınızı onaylayın ve hemen robotlarınızı çalıştırın.</p>

        {/* Plan Summary */}
        <div className={styles.planBox} style={{ borderColor: info.color + "44" }}>
          <div className={styles.planBoxLeft}>
            <span className={styles.planTag} style={{ color: info.color, background: info.color + "18" }}>
              {info.name} Planı
            </span>
            <span className={styles.planRobots}>{info.robots}</span>
          </div>
          <div className={styles.planPrice} style={{ color: info.color }}>
            {info.price}
            <span className={styles.planPeriod}> / ay</span>
          </div>
        </div>

        {/* What's included */}
        <ul className={styles.includeList}>
          <li><CheckCircle size={14} color="var(--accent-primary)" /> 14 gün ücretsiz deneme dahil</li>
          <li><CheckCircle size={14} color="var(--accent-primary)" /> İstediğiniz zaman iptal edin</li>
          <li><CheckCircle size={14} color="var(--accent-primary)" /> Anında robot erişimi</li>
        </ul>

        {/* Mock Payment Form */}
        <div className={styles.formSection}>
          <div className={styles.formField}>
            <label className={styles.label}>Kart Üzerindeki Ad</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Ad Soyad"
              defaultValue="Demo Kullanıcı"
              readOnly
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>Kart Numarası</label>
            <div className={styles.inputIcon}>
              <CreditCard size={16} color="var(--text-muted)" />
              <input
                className={styles.input}
                type="text"
                placeholder="1234 5678 9012 3456"
                defaultValue="4242 4242 4242 4242"
                readOnly
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>Son Kullanma</label>
              <input className={styles.input} type="text" placeholder="MM/YY" defaultValue="12/28" readOnly />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>CVV</label>
              <input className={styles.input} type="text" placeholder="123" defaultValue="***" readOnly />
            </div>
          </div>
        </div>

        {/* Simulate Payment Button */}
        <button
          className={styles.payButton}
          onClick={handleActivate}
          disabled={isPending}
          style={{ opacity: isPending ? 0.7 : 1 }}
        >
          {isPending ? (
            <>Ödeme Simülasyonu Yapılıyor...</>
          ) : (
            <>
              <Zap size={18} />
              Ödemeyi Onayla & Başla ({info.price}/ay)
            </>
          )}
        </button>

        <div className={styles.secureNote}>
          <Lock size={12} />
          Bu bir demo uygulamadır. Gerçek ödeme alınmamaktadır.
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-dark)" }} />}>
      <CheckoutContent />
    </Suspense>
  );
}
