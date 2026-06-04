"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import { BLOG_POSTS } from "@/src/data/blog";

interface BlogPostPageProps {
  id: string;
}

export default function BlogPostPage({ id }: BlogPostPageProps) {
  const { t, i18n } = useTranslation("common");
  const lang = (i18n.language?.startsWith("tr") ? "tr" : "en") as "tr" | "en";

  const post = BLOG_POSTS.find((p) => p.id === id);

  const translations = {
    tr: {
      backBtn: "Blog'a Geri Dön",
      notFoundTitle: "Yazı Bulunamadı",
      notFoundDesc: "Aradığınız makale mevcut değil veya silinmiş olabilir.",
      notFoundCta: "Tüm Yazıları Gör",
    },
    en: {
      backBtn: "Back to Blog",
      notFoundTitle: "Post Not Found",
      notFoundDesc: "The article you are looking for does not exist or might have been removed.",
      notFoundCta: "View All Posts",
    }
  };

  const { backBtn, notFoundTitle, notFoundDesc, notFoundCta } = translations[lang];

  if (!post) {
    return (
      <div className="bg-slate-50 text-slate-900 min-h-screen relative z-10">
        <Navbar />
        <main className="max-w-md mx-auto px-4 pt-48 pb-24 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{notFoundTitle}</h1>
          <p className="text-slate-500 mb-8 font-medium">{notFoundDesc}</p>
          <Link 
            href="/blog"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} className="mr-2" />
            {notFoundCta}
          </Link>
        </main>
      </div>
    );
  }

  // Parse custom mock markdown helper
  const renderContentBlocks = (contentText: string) => {
    const blocks = contentText.split("\n\n");
    return blocks.map((block, idx) => {
      // Heading 3
      if (block.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-extrabold text-slate-950 mt-10 mb-4 leading-tight">
            {block.replace("### ", "")}
          </h3>
        );
      }
      // List
      if (block.startsWith("- ")) {
        const listItems = block.split("\n");
        return (
          <ul key={idx} className="list-disc pl-5 my-6 space-y-2.5 text-slate-600 font-medium text-sm sm:text-base">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx}>
                {/* Parse inline strong tags like **text** */}
                {item.replace("- ", "").split("**").map((textChunk, chunkIdx) => {
                  if (chunkIdx % 2 === 1) {
                    return <strong key={chunkIdx} className="text-slate-950 font-bold">{textChunk}</strong>;
                  }
                  return textChunk;
                })}
              </li>
            ))}
          </ul>
        );
      }
      // Default paragraph
      return (
        <p key={idx} className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line">
          {/* Simple parser for inline strong **text** inside paragraph */}
          {block.split("**").map((textChunk, chunkIdx) => {
            if (chunkIdx % 2 === 1) {
              return <strong key={chunkIdx} className="text-slate-950 font-bold">{textChunk}</strong>;
            }
            return textChunk;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen relative z-10">
      <Navbar />

      {/* Decorative Glows */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-50/30 via-transparent to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/10 blur-[120px] pointer-events-none -z-10" />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Navigation & Category */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
            {backBtn}
          </Link>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200/50 uppercase tracking-wider">
            {post.category[lang]}
          </span>
        </div>

        {/* Title & Meta */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          {post.title[lang]}
        </h1>

        <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-400 mb-8 pb-6 border-b border-slate-100">
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-300" />
            {post.date[lang]}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} className="text-slate-300" />
            {post.readTime[lang]}
          </span>
        </div>

        {/* Featured Image */}
        <div className="relative w-full aspect-video sm:aspect-[21/10] rounded-3xl overflow-hidden shadow-xs border border-slate-100 mb-10">
          <Image
            src={post.imageUrl}
            alt={post.title[lang]}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <article className="prose prose-slate max-w-none">
          {renderContentBlocks(post.content[lang])}
        </article>
      </main>
    </div>
  );
}
