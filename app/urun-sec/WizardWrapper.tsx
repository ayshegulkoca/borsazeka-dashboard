"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const WizardPage = dynamic(() => import("../components/landing/WizardPage"), {
  ssr: false,
});

export default function WizardWrapper() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-dark)" }} />}>
      <WizardPage />
    </Suspense>
  );
}
