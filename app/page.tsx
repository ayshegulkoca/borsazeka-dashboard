import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/HeroSection";
import OnboardingSteps from "./components/landing/OnboardingSteps";

export const metadata: Metadata = {
  title: "BorsaZeka — Borsa, Yapay Zeka ile Buluştu",
  description:
    "2015'ten beri yapay zeka ile borsa robotları üretiyoruz. DarkRoom, Highway ve TradeMate robotlarıyla 7/24 otomatik ticaret başlıyor.",
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Suspense fallback={null}>
        <OnboardingSteps />
      </Suspense>
    </>
  );
}
