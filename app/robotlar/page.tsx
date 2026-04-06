import type { Metadata } from "next";
import RobotsPage from "../components/landing/RobotsPage";

export const metadata: Metadata = {
  title: "Robotlarımız — BorsaZeka",
  description:
    "BorsaZeka'nın yapay zeka destekli ticaret robotları: DarkRoom, Highway, TradeMate, KriptoZeka, KriptoZeka Ascent ve ForexZeka. Her bütçeye uygun algoritmik ticaret çözümleri.",
};

export default function RobotsRoute() {
  return <RobotsPage />;
}
