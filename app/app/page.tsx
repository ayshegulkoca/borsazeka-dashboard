import type { Metadata } from "next";
import LandingPage from "../page";

export const metadata: Metadata = {
  title: "BorsaZeka — Mobil Uygulamayı İndir",
  description:
    "2015'ten beri yapay zeka ile borsa robotları üretiyoruz. BorsaZeka mobil uygulamamızı indirin.",
};

export default function AppPage() {
  return <LandingPage />;
}
