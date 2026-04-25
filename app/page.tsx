import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/HeroSection";
import TickerBand from "./components/landing/TickerBand";
import FeaturesSection from "./components/landing/FeaturesSection";
import OnboardingSteps from "./components/landing/OnboardingSteps";
import MobileAppSection from "./components/landing/MobileAppSection";

export const metadata: Metadata = {
  title: "BorsaZeka — Borsa, Yapay Zeka ile Buluştu",
  description:
    "2015'ten beri yapay zeka ile borsa robotları üretiyoruz. DarkRoom, Highway ve TradeMate robotlarıyla 7/24 otomatik ticaret başlıyor.",
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      {/* Canlı piyasa veri şeridi — Navbar hemen altında sabit */}
      <Suspense fallback={null}>
        <TickerBand />
      </Suspense>
      <HeroSection />
      {/* Glassmorphism özellik kartları */}
      <Suspense fallback={null}>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={null}>
        <OnboardingSteps />
      </Suspense>
      <Suspense fallback={null}>
        <MobileAppSection />
      </Suspense>
    </>
  );
}

