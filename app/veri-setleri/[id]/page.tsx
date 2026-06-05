import type { Metadata } from "next";
import Navbar from "../../components/landing/Navbar";
import VeriSetleriDetay from "../../components/landing/VeriSetleriDetay";
import { DATA_PACKAGES } from "../../components/landing/VeriSetleriPage";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return DATA_PACKAGES.map((pkg) => ({ id: pkg.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pkg = DATA_PACKAGES.find((p) => p.id === id);
  return {
    title: pkg
      ? `${pkg.titleTR} — BorsaZeka`
      : "Veri Seti Detayı — BorsaZeka",
    description: pkg
      ? pkg.descriptionTR
      : "BorsaZeka tarihsel borsa veri seti detayları ve talep formu.",
  };
}

export default async function VeriSetleriDetayRoute({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <VeriSetleriDetay id={id} />
    </>
  );
}
