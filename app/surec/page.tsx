import type { Metadata } from "next";
import SurecPage from "../components/landing/SurecPage";

export const metadata: Metadata = {
  title: "Nasıl Çalışır? — BorsaZeka Müşteri Kazanım Süreci",
  description:
    "BorsaZeka algoritmik trade robotları nasıl çalışır? Mülacat, kurulum ve takip adımlarını öğrenin. DarkRoom, TradeMate ve Highway robotlarının kullanım şartları.",
};

export default function SurecRoute() {
  return <SurecPage />;
}
