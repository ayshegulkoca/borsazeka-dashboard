"use client";

import { useState, useCallback, useEffect } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

import {
  Check, Lock, ArrowRight, Bot, Zap,
  LayoutDashboard, User, ShieldCheck,
} from "lucide-react";
import { getSubscriptionStatus } from "@/app/actions/robots";
import s from "./onboarding.module.css";



// ── Google SVG logo ───────────────────────────────────────────────────────────
function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ── Arrow connector between steps (desktop only) ─────────────────────────────
function StepConnector({ done }: { done: boolean }) {
  return (
    <div className={s.connector} aria-hidden="true">
      <div className={`${s.connectorLine} ${done ? s.connectorLineDone : ""}`} />
      <ArrowRight
        size={14}
        className={`${s.connectorArrow} ${done ? s.connectorArrowDone : ""}`}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OnboardingSteps() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoggedIn  = !!session;
  const isLoading   = status === "loading";



  const [selectionDone,  setSelectionDone]  = useState(false);
  const [selectionLabel, setSelectionLabel] = useState<string>("");
  const [isPending,      setIsPending]      = useState(false);

  // DB'den abonelik durumunu çek (Örn: PENDING ise "Kontrol Ediliyor" göster)
  const syncStatus = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const sub = await getSubscriptionStatus();
      if (sub?.status === "PENDING") {
        setIsPending(true);
        setSelectionDone(true); // Adım 2 görsel olarak "başlamış" sayılsın
      } else if (sub?.status === "ACTIVE") {
        setIsPending(false);
        setSelectionDone(true);
      }
    } catch (e) {
      console.warn("Status sync failed:", e);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    syncStatus();

    // Sayfaya geri dönüldüğünde (Stripe'dan dönüşte) durumu tazele
    window.addEventListener("focus", syncStatus);
    return () => window.removeEventListener("focus", syncStatus);
  }, [syncStatus]);


  const markSelectionDone = useCallback((label: string) => {
    setSelectionDone(true);
    setSelectionLabel(label);
  }, []);

  // ── Full sign-out: clears React state + localStorage + router cache ────────
  const handleSignOut = useCallback(() => {
    // 1. Reset all React state
    setSelectionDone(false);
    setSelectionLabel("");

    // 2. Wipe any BorsaZeka keys from localStorage
    if (typeof window !== "undefined") {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("bz_"))
        .forEach((k) => localStorage.removeItem(k));
    }

    // 3. Bust Next.js RSC route cache so re-login sees fresh DB data
    router.refresh();

    // 4. Sign out and go back to landing #basla anchor
    signOut({ callbackUrl: "/#basla" });
  }, [router]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const step1Done   = isLoggedIn;
  const step2Done   = selectionDone && !isPending; // Sadece ACTIVE ise TAMAMLANDI sayılır
  const step3Locked = !step1Done || !step2Done;


  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className={s.section} id="robotlarimiz" aria-label="Başlangıç Adımları">
      <div className={s.inner}>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className={s.header}>
          <div className={s.badge}>
            <Zap size={11} />
            3 Adımda Başlayın
          </div>
          <h2 className={s.title}>Algoritmik Ticarete Başlayın</h2>
          <p className={s.subtitle}>
            Giriş yapın, size uygun yolu seçin ve hesaplarınızı güvenle bağlayın.
            Tüm süreç 5 dakika içinde tamamlanır.
          </p>
        </div>

        {/* ── Steps row ─────────────────────────────────────────────────── */}
        <div className={s.stepsRow}>

          {/* ═══════ STEP 1 — Auth ════════════════════════════════════════ */}
          <motion.div
            layout
            className={`${s.stepCard} ${step1Done ? s.stepCardDone : s.stepCardActive}`}
          >
            {/* Number bubble */}
            <div className={`${s.stepNum} ${step1Done ? s.stepNumDone : s.stepNumActive}`}>
              {step1Done ? <Check size={16} /> : "1"}
            </div>
            <div className={s.stepLabel}>ADIM 1</div>
            <div className={s.stepTitle}>
              {step1Done ? "Giriş Yapıldı" : "Hesabınıza Giriş Yapın"}
            </div>

            {/* Body */}
            <div className={s.stepBodyFlat}>
              {step1Done ? (
                /* Logged-in */
                <>
                  <div className={s.authSessionInfo}>
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? "Avatar"}
                        width={42}
                        height={42}
                        className={s.authAvatar}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={s.authAvatarPlaceholder}>
                        <User size={18} />
                      </div>
                    )}
                    <div className={s.authUserDetails}>
                      <div className={s.authName}>{session?.user?.name ?? "Kullanıcı"}</div>
                      <div className={s.authEmail}>{session?.user?.email}</div>
                    </div>
                  </div>
                  <button
                    id="onboarding-signout"
                    className={s.btnSignOut}
                    onClick={handleSignOut}
                  >
                    Farklı hesap kullan
                  </button>
                </>
              ) : (
                /* Logged-out */
                <>
                  <p className={s.authDesc}>
                    Google hesabınızla tek tıkta giriş yapın.
                  </p>
                  <button
                    id="onboarding-google-signin"
                    className={s.btnGoogle}
                    onClick={() => signIn("google", { callbackUrl: "/#basla", prompt: "select_account" })}
                    disabled={isLoading}
                  >
                    <GoogleLogo />
                    Google ile Giriş Yap
                  </button>
                </>
              )}
            </div>

            {/* Done chip */}
            {step1Done && (
              <span className={`${s.stepStatus} ${s.stepStatusDone}`}>
                <Check size={11} /> Tamamlandı
              </span>
            )}
          </motion.div>

          {/* ── Connector 1→2 ── */}
          <StepConnector done={step1Done} />

          {/* ═══════ STEP 2 — Selection ══════════════════════════════════ */}
          <motion.div
            layout
            className={`${s.stepCard} ${
              step2Done
                ? s.stepCardDone
                : !step1Done
                ? s.stepCardLocked
                : s.stepCardActive
            }`}
          >
            {/* Lock overlay when locked */}
            {!step1Done && (
              <div className={s.lockOverlay}>
                <Lock size={28} className={s.lockOverlayIcon} />
              </div>
            )}

            <div
              className={`${s.stepNum} ${
                step2Done
                  ? s.stepNumDone
                  : !step1Done
                  ? s.stepNumLocked
                  : s.stepNumActive
              }`}
            >
              {step2Done ? <Check size={16} /> : !step1Done ? <Lock size={14} /> : "2"}
            </div>
            <div className={s.stepLabel}>ADIM 2</div>
            <div className={s.stepTitle}>Size uygun robota abone olun</div>

            {/* Body */}
            <div className={s.stepBodyFlat}>
              {isPending ? (
                <div className={s.selectionDone} style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", padding: "1rem", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fbbf24", fontWeight: 700, fontSize: "0.85rem" }}>
                    <ShieldCheck size={18} />
                    Ödemeniz Kontrol Ediliyor...
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
                    Stripe tarafındaki ödemeniz doğrulanıyor. Bu işlem genellikle birkaç dakika sürer.
                  </p>
                </div>
              ) : step2Done ? (
                <div className={s.selectionDone}>
                  <span className={s.selectionDoneChip}>
                    <Check size={12} /> {selectionLabel}
                  </span>
                  <span>seçildi</span>
                </div>
              ) : !step1Done ? (
                <p className={s.lockedHint}>Önce giriş yapmanız gerekiyor.</p>
              ) : (
                <div className={s.selectionGrid}>
                  {/* Option A: Profesyonelim → /robotlar (vitrine, site içinde kalır) */}
                  <Link
                    href="/robotlar"
                    className={s.selectionCard}
                    id="onboarding-pro-path"
                    onClick={() => markSelectionDone("İstediğim robotu biliyorum")}
                  >
                    <div className={s.selectionIcon}>
                      <LayoutDashboard size={20} />
                    </div>
                    <div className={s.selectionCardTitle}>İstediğim robotu biliyorum</div>
                    <div className={s.selectionCardDesc}>
                      Robot vitrinini görüp doğrudan abone olmak istiyorum.
                    </div>
                    <ArrowRight size={16} className={s.selectionArrow} />
                  </Link>

                  {/* Option B: Robotumu Bul → /urun-sec */}
                  <Link
                    href="/urun-sec"
                    className={s.selectionCard}
                    id="onboarding-wizard-path"
                    onClick={() => markSelectionDone("Robotumu Bul")}
                  >
                    <div className={s.selectionIcon}>
                      <Bot size={20} />
                    </div>
                    <div className={s.selectionCardTitle}>Robotumu Bul</div>
                    <div className={s.selectionCardDesc}>
                      6 adımlı sihirbazla bana uygun robotu bulayım.
                    </div>
                    <ArrowRight size={16} className={s.selectionArrow} />
                  </Link>
                </div>
              )}
            </div>

            {isPending ? (
              <span className={s.stepStatus} style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24" }}>
                Kontrol Ediliyor
              </span>
            ) : step2Done && (
              <span className={`${s.stepStatus} ${s.stepStatusDone}`}>
                <Check size={11} /> Tamamlandı
              </span>
            )}
          </motion.div>

          {/* ── Connector 2→3 ── */}
          <StepConnector done={step2Done && step1Done} />

          {/* ═══════ STEP 3 — Setup ══════════════════════════════════════ */}
          <motion.div
            layout
            className={`${s.stepCard} ${
              step3Locked ? s.stepCardLocked : s.stepCardActive
            }`}
          >
            {/* Lock overlay when locked */}
            {step3Locked && (
              <div className={s.lockOverlay}>
                <Lock size={28} className={s.lockOverlayIcon} />
              </div>
            )}

            <div className={`${s.stepNum} ${step3Locked ? s.stepNumLocked : s.stepNumActive}`}>
              {step3Locked ? <Lock size={14} /> : "3"}
            </div>
            <div className={s.stepLabel}>ADIM 3</div>
            <div className={s.stepTitle}>Hesaplarınızı Bağlayın</div>

            {/* Body */}
            <div className={s.stepBodyFlat}>
              {step3Locked ? (
                <div className={s.lockedChecklist}>
                  <div className={`${s.lockedCheckItem} ${step1Done ? s.lockedCheckDone : ""}`}>
                    {step1Done ? <Check size={12} /> : <Lock size={12} />}
                    Adım 1 — Giriş Yap
                  </div>
                  <div className={`${s.lockedCheckItem} ${step2Done ? s.lockedCheckDone : ""}`}>
                    {step2Done ? <Check size={12} /> : <Lock size={12} />}
                    Adım 2 — Yolunu Seç
                  </div>
                </div>
              ) : (
                <p className={s.authDesc}>
                  Aracı kurum veya Binance bağlantınızı güvenle tamamlayın.
                  Verileriniz AES-256 ile şifrelenir.
                </p>
              )}
            </div>

            {/* CTA button — active only when steps 1+2 done */}
            <Link
              href="/kurulum"
              id="onboarding-kurulum-btn"
              className={`${s.btnSetup} ${step3Locked ? s.btnSetupDisabled : ""}`}
              onClick={(e) => { if (step3Locked) e.preventDefault(); }}
              aria-disabled={step3Locked}
              tabIndex={step3Locked ? -1 : 0}
            >
              <ShieldCheck size={16} />
              Kuruluma Başla
              {!step3Locked && <ArrowRight size={15} />}
            </Link>

            {step3Locked && (
              <span className={`${s.stepStatus} ${s.stepStatusLocked}`}>
                <Lock size={11} /> Kilitli
              </span>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
