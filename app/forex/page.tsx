import { Metadata } from "next";
import ForexPage from "@/app/components/landing/ForexPage";
import Navbar from "@/app/components/landing/Navbar";

export const metadata: Metadata = {
  title: "Forex Hesabı Aç — BorsaZeka",
  description: "BorsaZeka algoritmalarıyla tam uyumlu, düşük komisyonlu ve güvenilir Tickmill altyapısında forex hesabınızı dakikalar içinde oluşturun.",
};

export default function Page() {
  return (
    <main>
      <Navbar />
      <ForexPage />
    </main>
  );
}
