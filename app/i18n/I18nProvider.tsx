"use client";

import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If already initialized (SSR fallback or prior init), mark ready immediately
    if (i18n.isInitialized && i18n.hasLoadedNamespace("common")) {
      setReady(true);
      return;
    }

    // Wait for i18n to finish initializing (includes preloading both languages)
    const onReady = () => setReady(true);
    i18n.on("initialized", onReady);

    return () => {
      i18n.off("initialized", onReady);
    };
  }, []);

  if (!ready) {
    // Invisible skeleton — prevents layout shift while translations load
    return (
      <I18nextProvider i18n={i18n}>
        <div aria-hidden="true" style={{ visibility: "hidden", minHeight: "100vh" }}>
          {children}
        </div>
      </I18nextProvider>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
