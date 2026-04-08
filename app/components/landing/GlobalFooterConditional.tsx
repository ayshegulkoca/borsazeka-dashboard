"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import GlobalFooter from "@/app/components/landing/GlobalFooter";

// Pages where global footer should NOT appear
const EXCLUDED_PATHS = ["/dashboard", "/checkout"];

export default function GlobalFooterConditional() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until client hydration is done
  if (!mounted) return null;

  const isExcluded = EXCLUDED_PATHS.some(
    (excluded) => pathname === excluded || pathname.startsWith(excluded + "/")
  );

  if (isExcluded) return null;
  return <GlobalFooter />;
}
