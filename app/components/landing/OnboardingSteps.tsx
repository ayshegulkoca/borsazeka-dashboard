"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

import { getUserRobots } from "@/app/actions/robots";
import { ROBOT_BY_ID, getRobotNormalizedId } from "@/lib/robots";
import SetupWizard from "@/app/components/shared/SetupWizard";
import s from "./onboarding.module.css";

// ── Main component ────────────────────────────────────────────────────────────
export default function OnboardingSteps() {
  const { data: session } = useSession();
  const { t } = useTranslation("common");

  const isLoggedIn = !!session;

  const [hasRobots, setHasRobots] = useState(false);
  const [firstRobotName, setFirstRobotName] = useState<string | undefined>(undefined);

  // getUserRobots() → Prisma: dashboard ile aynı veri kaynağı
  const syncRobots = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const robots = await getUserRobots();
      if (robots && robots.length > 0) {
        setHasRobots(true);
        // İlk robotun display adını bul
        const firstRobotId = getRobotNormalizedId(robots[0].robotId ?? "");
        setFirstRobotName(firstRobotId || undefined);
      } else {
        setHasRobots(false);
        setFirstRobotName(undefined);
      }
    } catch (e) {
      console.warn("Robot sync failed:", e);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    syncRobots();
    window.addEventListener("focus", syncRobots);
    return () => window.removeEventListener("focus", syncRobots);
  }, [syncRobots]);

  // ── Derived step states ───────────────────────────────────────────────────
  const step1Completed = isLoggedIn;
  const step2Completed = hasRobots;

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
            step2Pending={false}
            step3Completed={false}
            step2RobotName={firstRobotName ? t(`robotsCatalog.${firstRobotName}.name`, { defaultValue: firstRobotName }) : undefined}
            variant="landing"
            alwaysVisible={true}
          />
        </motion.div>

      </div>
    </section>
  );
}
