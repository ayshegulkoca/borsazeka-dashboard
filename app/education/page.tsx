import type { Metadata } from "next";
import EducationPage from "../components/landing/EducationPage";

export const metadata: Metadata = {
  title: "Eğitim Merkezi — BorsaZeka",
  description:
    "BorsaZeka algoritmik ticaret robotlarını derinlemesine öğrenin. Sistem analizi videoları, strateji rehberleri ve podcast içerikleriyle kendinizi geliştirin.",
};

export default function EducationRoute() {
  return <EducationPage />;
}
