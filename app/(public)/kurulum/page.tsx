import { Metadata } from "next";
import KurulumWizard from "@/app/components/landing/KurulumWizard";

export const metadata: Metadata = {
  title: "Hesap Kurulumu | BorsaZeka",
  description: "Borsa ve Broker bağlantılarını güvenle tamamlayın.",
};

export default function KurulumPage() {
  return <KurulumWizard />;
}
