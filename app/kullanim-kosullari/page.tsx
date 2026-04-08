import LegalPageLayout from "@/app/components/landing/LegalPageLayout";
import Navbar from "@/app/components/landing/Navbar";

export const metadata = {
  title: "Kullanım Koşulları — BorsaZeka",
  description: "BorsaZeka platformu için kullanım koşulları ve yasal şartlar.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main>
        <LegalPageLayout type="terms" />
      </main>
    </>
  );
}
