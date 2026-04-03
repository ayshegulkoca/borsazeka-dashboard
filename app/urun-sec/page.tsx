import type { Metadata } from "next";
import Navbar from "../components/landing/Navbar";
import WizardPage from "../components/landing/WizardPage";

export const metadata: Metadata = {
  title: "Ürün Seç — BorsaZeka",
  description:
    "6 adımda size en uygun borsa robotunu ve fiyat planını bulun. BIST, Kripto ve Forex piyasaları için özelleştirilmiş algoritmik trading robotları.",
};

export default function UrunSecPage() {
  return (
    <>
      <Navbar />
      <WizardPage />
    </>
  );
}
