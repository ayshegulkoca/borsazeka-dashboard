"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import { BLOG_POSTS } from "@/src/data/blog";

export default function BlogPage() {
  const { t, i18n } = useTranslation("common");
  const lang = (i18n.language?.startsWith("tr") ? "tr" : "en") as "tr" | "en";
  const router = useRouter();

  const featuredPost = BLOG_POSTS.find((post) => post.featured) || BLOG_POSTS[0];
  const gridPosts = BLOG_POSTS.filter((post) => post.id !== featuredPost.id);

  // Localization resources for static texts
  const translations = {
    tr: {
      tag: "BORSAZEKA BLOG",
      title: "BorsaZeka Blog",
      subtitle: "Algoritmik ticaret ve piyasa analizlerine dair güncel makaleler",
      featuredLabel: "Öne Çıkan Yazı",
      readMore: "Okumaya Başla",
    },
    en: {
      tag: "BORSAZEKA BLOG",
      title: "BorsaZeka Blog",
      subtitle: "Latest articles on algorithmic trading and market analysis",
      featuredLabel: "Featured Post",
      readMore: "Start Reading",
    }
  };

  const { tag, title, subtitle, featuredLabel, readMore } = translations[lang];

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen relative z-10">
      <Navbar />

      {/* Decorative Glows (very soft) */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-50/20 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Main Container - Large padding-top to avoid fixed navbar overlap and add breathing room */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-36 pb-24">
        
        {/* Header Area */}
        <header className="mb-20 text-center md:text-left border-b border-slate-100 pb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-blue-600 bg-blue-50 border border-blue-200/50 uppercase mb-4">
            <BookOpen size={12} className="text-blue-500" />
            {tag}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg font-semibold max-w-2xl">
            {subtitle}
          </p>
        </header>

        {/* Featured Post (Modern 2-Column Editorial Grid) */}
        {featuredPost && (
          <section 
            onClick={() => router.push(`/blog/${featuredPost.id}`)}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-24 items-center group cursor-pointer"
          >
            {/* Left Column: Image (Bounded, rounded, non-overflowing) */}
            <div className="relative h-[280px] sm:h-[350px] md:h-[400px] rounded-3xl overflow-hidden shadow-xs border border-slate-100">
              <Image
                src={featuredPost.imageUrl}
                alt={featuredPost.title[lang]}
                fill
                priority
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-xs tracking-wider uppercase">
                  {featuredLabel}
                </span>
              </div>
            </div>

            {/* Right Column: Editorial Typography */}
            <div className="flex flex-col justify-center space-y-4 py-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {featuredPost.category[lang]}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 group-hover:text-blue-600 transition-colors leading-tight">
                {featuredPost.title[lang]}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-semibold">
                {featuredPost.description[lang]}
              </p>

              <div className="flex items-center gap-6 text-xs font-semibold text-slate-400 pt-2 pb-6 border-b border-slate-100">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {featuredPost.date[lang]}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {featuredPost.readTime[lang]}
                </span>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:gap-2 transition-all">
                  {readMore}
                  <ArrowRight size={15} />
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Lower Grid (Spacious gap-12 editorial tiles) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-6">
          {gridPosts.map((post) => (
            <article 
              key={post.id}
              onClick={() => router.push(`/blog/${post.id}`)}
              className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
            >
              {/* Image wrap with fixed clean height */}
              <div className="relative h-48 md:h-52 w-full overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title[lang]}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-700 bg-blue-50/90 border border-blue-200/50 tracking-wider uppercase">
                  {post.category[lang]}
                </span>
              </div>

              {/* Text content with p-6 and space-y-3 */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-3">
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    {post.title[lang]}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold line-clamp-3">
                    {post.description[lang]}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400 mt-auto">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date[lang]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime[lang]}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>

      </div>
    </div>
  );
}
