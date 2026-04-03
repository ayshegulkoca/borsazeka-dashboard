import type { Metadata } from "next";
import Navbar from "../components/landing/Navbar";
import IletisimPage from "@/app/components/landing/IletisimPage";

export const metadata: Metadata = {
  title: "İletişim — BorsaZeka",
  description:
    "BorsaZeka ekibine Twitter, Telegram veya doğrudan mesaj ile ulaşın. Algoritmik trading robotları hakkında sorularınız için 7/24 buradayız.",
};

export default function IletisimRoutePage() {
  return (
    <>
      <Navbar />
      <IletisimPage />
    </>
  );
}
