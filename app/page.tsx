import type { Metadata } from "next";
import Navbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/HeroSection";
import FeatureGrid from "./components/landing/FeatureGrid";

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
      <FeatureGrid />
    </>
  );
}
