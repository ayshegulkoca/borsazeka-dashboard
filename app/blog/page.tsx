import type { Metadata } from "next";
import BlogPage from "../components/landing/BlogPage";

export const metadata: Metadata = {
  title: "Blog — BorsaZeka",
  description:
    "Semih Arslan'ın kaleminden algoritmik ticaret rehberleri, yapay zeka & finansal teknoloji günlüğü, piyasa analizleri ve strateji notları.",
};

export default function BlogRoute() {
  return <BlogPage />;
}
