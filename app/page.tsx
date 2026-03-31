import type { Metadata } from "next";
import Navbar from "./components/landing/Navbar";
import HeroSection from "./components/landing/HeroSection";
import FeatureGrid from "./components/landing/FeatureGrid";
import RobotsSection from "./components/landing/RobotsSection";
import PricingCards from "./components/landing/PricingCards";
import BottomCTA from "./components/landing/BottomCTA";

export const metadata: Metadata = {
  title: "BorsaZeka — Algoritmik Ticaretin Yapay Zeka Gücü",
  description:
    "Yapay zeka destekli trading robotlarıyla borsada kazancınızı optimize edin. 7/24 otomatik işlem, gelişmiş risk yönetimi ve gerçek zamanlı analiz.",
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeatureGrid />
      <RobotsSection />
      <PricingCards />
      <BottomCTA />
    </>
  );
}
