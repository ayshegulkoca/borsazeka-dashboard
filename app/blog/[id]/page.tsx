import type { Metadata } from "next";
import BlogPostPage from "../../components/landing/BlogPostPage";
import { BLOG_POSTS } from "@/src/data/blog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id === id);
  if (!post) {
    return {
      title: "Yazı Bulunamadı — BorsaZeka",
      description: "Aradığınız makale bulunamadı.",
    };
  }
  return {
    title: `${post.title.tr} — BorsaZeka`,
    description: post.description.tr,
  };
}

export default async function BlogPostRoute({ params }: PageProps) {
  const { id } = await params;
  return <BlogPostPage id={id} />;
}
