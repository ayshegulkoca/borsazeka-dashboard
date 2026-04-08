import LegalPageLayout from "@/app/components/landing/LegalPageLayout";
import Navbar from "@/app/components/landing/Navbar";

export const metadata = {
  title: "Gizlilik Politikası — BorsaZeka",
  description: "BorsaZeka platformu için gizlilik politikası ve veri güvenliği bilgileri.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <LegalPageLayout type="privacy" />
      </main>
    </>
  );
}
