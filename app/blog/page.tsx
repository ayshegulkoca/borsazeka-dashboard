import type { Metadata } from "next";
import BlogPage from "../components/landing/BlogPage";

export const metadata: Metadata = {
  title: "Blog — BorsaZeka",
  description:
    "BorsaZeka yapay zeka borsa robotları ve algoritmik ticaret blogu. Finansal teknolojiler, piyasa stratejileri ve risk yönetimi hakkında en güncel yazılar.",
};

export default function BlogRoute() {
  return <BlogPage />;
}
