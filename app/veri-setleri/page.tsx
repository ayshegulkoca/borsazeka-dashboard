import type { Metadata } from "next";
import Navbar from "../components/landing/Navbar";
import VeriSetleriPage from "../components/landing/VeriSetleriPage";

export const metadata: Metadata = {
  title: "Tarihsel Veri Setleri — BorsaZeka",
  description:
    "BIST'teki 577 hissenin 2015'ten günümüze 1 dakikalık grafikleri dahil yüksek çözünürlüklü tarihsel borsa verisi paketleri. Yapay zeka ve algoritmik strateji araştırmaları için.",
};

export default function VeriSetleriRoute() {
  return (
    <>
      <Navbar />
      <VeriSetleriPage />
    </>
  );
}
