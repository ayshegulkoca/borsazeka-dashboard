"use client";

import { useEffect, useState } from "react";
import WizardPage from "../components/landing/WizardPage";

export default function WizardWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Pageshow Event Listener (BFCache Bypass)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    // 2. Navigation Type Check (Kullanıcı Geri Tuşuyla Gelmişse)
    try {
      const perfEntries = performance.getEntriesByType("navigation");
      if (perfEntries.length > 0) {
        const navEntry = perfEntries[0] as PerformanceNavigationTiming;
        if (navEntry.type === "back_forward") {
          window.location.reload();
        }
      } else if (performance.navigation && performance.navigation.type === 2) {
        window.location.reload();
      }
    } catch (e) {
      // ignore
    }

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: "100vh", background: "var(--bg-dark)" }} />;
  }

  return <WizardPage />;
}
