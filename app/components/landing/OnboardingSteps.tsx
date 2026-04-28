"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

import { getSubscriptionStatus } from "@/app/actions/robots";
import SetupWizard from "@/app/components/shared/SetupWizard";
import s from "./onboarding.module.css";

// ── Main component ────────────────────────────────────────────────────────────
export default function OnboardingSteps() {
  const { data: session } = useSession();
  const { t } = useTranslation("common");

  const isLoggedIn = !!session;

  const [selectionDone, setSelectionDone] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Fetch subscription status from DB so PENDING/ACTIVE is reflected in real time
  const syncStatus = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const sub = await getSubscriptionStatus();
      if (sub?.status === "PENDING") {
        setIsPending(true);
        setSelectionDone(true);
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
    // Re-sync when user navigates back (e.g. from Stripe)
    window.addEventListener("focus", syncStatus);
    return () => window.removeEventListener("focus", syncStatus);
  }, [syncStatus]);

  // ── Derived step states ───────────────────────────────────────────────────
  const step1Completed = isLoggedIn;
  const step2Completed = selectionDone && !isPending; // only ACTIVE counts as done
  const step2Pending   = isPending;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      className={s.section}
      id="robotlarimiz"
      aria-label={t("onboardingSteps.title")}
    >
      <div className={s.inner}>

        {/* ── Section header ─────────────────────────────────────────────── */}
        <motion.div
          className={s.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={s.badge}>
            <Zap size={11} />
            {t("onboardingSteps.badge")}
          </div>
          <h2 className={s.title}>{t("onboardingSteps.title")}</h2>
          <p className={s.subtitle}>{t("onboardingSteps.subtitle")}</p>
        </motion.div>

        {/* ── Setup Wizard cards ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <SetupWizard
            step1Completed={step1Completed}
            step2Completed={step2Completed}
            step2Pending={step2Pending}
            step3Completed={false}
            variant="landing"
            alwaysVisible={true}
          />
        </motion.div>

      </div>
    </section>
  );
}
