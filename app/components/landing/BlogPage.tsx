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
      readMore: "Devamını Oku",
    },
    en: {
      tag: "BORSAZEKA BLOG",
      title: "BorsaZeka Blog",
      subtitle: "Latest articles on algorithmic trading and market analysis",
      featuredLabel: "Featured Post",
      readMore: "Read More",
    }
  };

  const { tag, title, subtitle, featuredLabel, readMore } = translations[lang];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen relative z-10">
      <Navbar />

      {/* Decorative Light Background Glows */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-50/40 via-transparent to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-100/20 blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section - Tall padding-top to avoid navbar overlap */}
      <section className="pt-40 pb-12 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-blue-600 bg-blue-50 border border-blue-200/55 uppercase mb-4">
          <BookOpen size={12} className="text-blue-500" />
          {tag}
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
          {subtitle}
        </p>
      </section>

      {/* Blog Container - Safe margins and padding */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
        {/* Featured Post Card */}
        {featuredPost && (
          <div 
            onClick={() => router.push(`/blog/${featuredPost.id}`)}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row items-stretch p-6 lg:p-8 gap-6 lg:gap-8 mb-16 group cursor-pointer"
          >
            {/* Image Wrap - Bounded & Rounded inside card */}
            <div className="w-full lg:w-7/12 relative h-64 sm:h-80 lg:h-auto min-h-[280px] lg:min-h-[380px] rounded-2xl overflow-hidden">
              <Image
                src={featuredPost.imageUrl}
                alt={featuredPost.title[lang]}
                fill
                priority
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-slate-900/80 backdrop-blur-xs tracking-wider uppercase">
                  {featuredLabel}
                </span>
              </div>
            </div>

            {/* Content Wrap - Vertically aligned and padded from margins */}
            <div className="w-full lg:w-5/12 flex flex-col justify-between py-2">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-3">
                  {featuredPost.category[lang]}
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-4">
                  {featuredPost.title[lang]}
                </h2>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6 font-medium line-clamp-4">
                  {featuredPost.description[lang]}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {featuredPost.date[lang]}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {featuredPost.readTime[lang]}
                  </span>
                </div>
                
                <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:gap-2 transition-all">
                  {readMore}
                  <ArrowRight size={15} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Other Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <div 
              key={post.id}
              onClick={() => router.push(`/blog/${post.id}`)}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer p-5"
            >
              <div>
                {/* Image - Rounded and separated from text */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-5">
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

                {/* Text Content */}
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3 line-clamp-2">
                  {post.title[lang]}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 font-medium line-clamp-3">
                  {post.description[lang]}
                </p>
              </div>

              {/* Footer info - aligned to bottom */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
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
          ))}
        </div>
      </main>
    </div>
  );
}
