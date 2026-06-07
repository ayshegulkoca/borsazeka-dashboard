import type { Metadata } from "next";
import Navbar from "../components/landing/Navbar";
import VeriSetleriPage from "../components/landing/VeriSetleriPage";

export const metadata: Metadata = {
  title: "Tarihsel Veri Setleri — BorsaZeka",
  description:
    "BIST'teki 577 hissenin 1987'den günümüze günlük ve 2012'den günümüze 1 dakikalık grafikleri dahil yüksek çözünürlüklü tarihsel borsa verisi paketleri.",
};

export default function VeriSetleriRoute() {
  return (
    <>
      <Navbar />
      <VeriSetleriPage />
    </>
  );
}
