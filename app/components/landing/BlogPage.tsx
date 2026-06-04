"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import { BLOG_POSTS } from "@/src/data/blog";

export default function BlogPage() {
  const { t, i18n } = useTranslation("common");
  const lang = (i18n.language?.startsWith("tr") ? "tr" : "en") as "tr" | "en";
  const router = useRouter();

  // Localization resources for static texts
  const translations = {
    tr: {
      tag: "BORSAZEKA BLOG",
      title: "BorsaZeka Blog",
      subtitle: "Algoritmik ticaret ve piyasa analizlerine dair güncel makaleler.",
    },
    en: {
      tag: "BORSAZEKA BLOG",
      title: "BorsaZeka Blog",
      subtitle: "Latest articles on algorithmic trading and market analysis.",
    }
  };

  const { tag, title, subtitle } = translations[lang];

  return (
    <div className="bg-white text-slate-900 min-h-screen relative z-10">
      <Navbar />

      {/* Main Container - Pushed down to clear the fixed navbar with generous white space */}
      <main className="max-w-5xl mx-auto px-6 pt-40 pb-24">
        
        {/* Editorial Left-Aligned Header */}
        <header className="mb-16 border-b border-slate-100 pb-10 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-blue-600 bg-blue-50 border border-blue-200/50 uppercase mb-4">
            <BookOpen size={12} className="text-blue-500" />
            {tag}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed">
            {subtitle}
          </p>
        </header>

        {/* Editorial Article List */}
        <div className="flex flex-col">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.id}
              onClick={() => router.push(`/blog/${post.id}`)}
              className="flex flex-row justify-between items-start gap-6 sm:gap-10 py-10 border-b border-slate-100 last:border-0 group cursor-pointer hover:opacity-95 transition-opacity"
            >
              {/* Left Column: Text Content (high contrast, bold styling) */}
              <div className="flex-grow min-w-0 flex flex-col justify-center">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">
                  {post.category[lang]}
                </span>
                
                <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-3">
                  {post.title[lang]}
                </h2>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-4 font-medium line-clamp-2 sm:line-clamp-3">
                  {post.description[lang]}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {post.date[lang]}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {post.readTime[lang]}
                  </span>
                </div>
              </div>

              {/* Right Column: Square Thumbnail Image (Small, clean, rounded) */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 flex-shrink-0 relative rounded-2xl overflow-hidden shadow-xs border border-slate-100 self-center">
                <Image
                  src={post.imageUrl}
                  alt={post.title[lang]}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
