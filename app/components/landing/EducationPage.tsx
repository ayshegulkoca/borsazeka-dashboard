"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen, Play, Clock, ChevronRight, Bell,
  TrendingUp, Bot, BarChart2, Headphones,
  PlayCircle, Layers, Cpu,
  Video,
} from "lucide-react";
import Navbar from "./Navbar";
import styles from "./education.module.css";

// ── Gallery video data ─────────────────────────────────────────────────────
const GALLERY_VIDEOS = [
  {
    id: 1,
    category: "Sistem Analizi",
    title: "BorsaZeka Sistem Analizi",
    description: "Algoritmik ticaret sistemimizin temel yapısını ve karar mekanizmalarını keşfedin.",
    duration: "14:32",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0f2040 100%)",
    accentColor: "#3b82f6",
    icon: BarChart2,
  },
  {
    id: 2,
    category: "Strateji Rehberi",
    title: "Strateji Rehberi: Gap Trading",
    description: "DarkRoom robotunun kullandığı Gap Trading stratejisini adım adım öğrenin.",
    duration: "22:15",
    gradient: "linear-gradient(135deg, #2d1b69 0%, #1a0f40 100%)",
    accentColor: "#a855f7",
    icon: TrendingUp,
  },
  {
    id: 3,
    category: "Risk Yönetimi",
    title: "Portföy & Risk Yönetimi",
    description: "Robotlarınızın risk parametrelerini doğru ayarlamanın püf noktaları.",
    duration: "18:44",
    gradient: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
    accentColor: "#10b981",
    icon: Layers,
  },
];

// ── Quick links data ───────────────────────────────────────────────────────
const QUICK_LINKS = [
  {
    label: "Robotlarımızı İncele",
    sub: "Tüm algoritmik robotlar",
    href: "/robotlar",
    icon: Bot,
    iconBg: "rgba(59,130,246,0.12)",
    iconColor: "#60a5fa",
  },
  {
    label: "Ürün Seçme Sihirbazı",
    sub: "Size uygun robotu bulun",
    href: "/urun-sec",
    icon: Cpu,
    iconBg: "rgba(168,85,247,0.12)",
    iconColor: "#c084fc",
  },
  {
    label: "İşleyiş Süreci",
    sub: "Nasıl çalışıyor?",
    href: "/surec",
    icon: PlayCircle,
    iconBg: "rgba(16,185,129,0.12)",
    iconColor: "#34d399",
  },
];

// ── Main Component ─────────────────────────────────────────────────────────
export default function EducationPage() {
  const [featuredPlaying, setFeaturedPlaying] = useState(false);
  const [activeGallery, setActiveGallery] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <Navbar />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>
          <span className={styles.sectionTag}>
            <BookOpen size={12} />
            Eğitim Merkezi
          </span>
          <h1 className={styles.heroTitle}>
            BorsaZeka&apos;yı <span>Derinlemesine</span> Öğrenin
          </h1>
          <p className={styles.heroSubtitle}>
            Robotlarımızın nasıl çalıştığını, stratejileri ve risk yönetimini
            videolar ve podcast bölümleriyle keşfedin.
          </p>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className={styles.mainLayout}>
        {/* LEFT COLUMN */}
        <div className={styles.leftColumn}>

          {/* FEATURED VIDEO */}
          <div className={styles.featuredVideoBlock}>
            <div className={styles.videoWrapper}>
              {!featuredPlaying ? (
                /* Placeholder / thumbnail */
                <div
                  className={styles.videoPlaceholder}
                  onClick={() => setFeaturedPlaying(true)}
                  role="button"
                  aria-label="Ana videoyu oynat"
                >
                  <div className={styles.videoBgGlow} />
                  <div className={styles.videoGridLines} />

                  {/* LIVE badge */}
                  <div className={styles.videoBadge}>
                    <span className={styles.liveIndicator} />
                    Tanıtım
                  </div>

                  {/* Play button */}
                  <div className={styles.playBtn}>
                    <Play size={26} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                  </div>
                  <span className={styles.playLabel}>Videoyu İzle</span>
                </div>
              ) : (
                /* YouTube embed — replace VIDEO_ID with real ID when available */
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                  title="Robotlarımız Nasıl Çalışır?"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                />
              )}
            </div>

            {/* Meta info */}
            <div className={styles.videoMeta}>
              <div className={styles.videoMetaHeader}>
                <h2 className={styles.videoTitle}>Robotlarımız Nasıl Çalışır?</h2>
                <span className={styles.videoDuration}>
                  <Clock size={12} />
                  28:40
                </span>
              </div>
              <p className={styles.videoDescription}>
                BorsaZeka algoritmik ticaret robotlarının karar alma süreçlerini,
                yapay zeka motorunu ve istatistiksel modelleri sıfırdan keşfedin.
                Bu kapsamlı tanıtım videosunda sisteminizin nasıl çalıştığını
                adım adım anlıyoruz.
              </p>
              <div className={styles.videoTagRow}>
                {["Yapay Zeka", "Algoritma", "BIST", "Başlangıç Seviyesi"].map(tag => (
                  <span key={tag} className={styles.videoTag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* VIDEO GALLERY */}
          <div className={styles.gallerySection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionTitleIcon}>
                  <Video size={14} />
                </span>
                Video Galerisi
              </h3>
              <button className={styles.seeAllBtn}>
                Tümünü Gör <ChevronRight size={14} />
              </button>
            </div>

            <div className={styles.galleryGrid}>
              {GALLERY_VIDEOS.map(video => {
                const Icon = video.icon;
                const isActive = activeGallery === video.id;

                return (
                  <div
                    key={video.id}
                    className={styles.galleryCard}
                    onClick={() => setActiveGallery(isActive ? null : video.id)}
                    role="button"
                    aria-label={`${video.title} videosunu oynat`}
                  >
                    {/* Thumbnail */}
                    <div className={styles.galleryThumb}>
                      <div
                        className={styles.galleryThumbGradient}
                        style={{ background: video.gradient }}
                      />
                      {/* Decorative icon in thumb */}
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={32} color={video.accentColor} style={{ opacity: 0.25 }} />
                      </div>
                      {/* Hover play overlay */}
                      <div className={styles.galleryPlayOverlay}>
                        <div className={styles.galleryPlayBtn}>
                          <Play size={16} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                        </div>
                      </div>
                      <span className={styles.galleryDuration}>{video.duration}</span>
                    </div>

                    {/* Body */}
                    <div className={styles.galleryCardBody}>
                      <p
                        className={styles.galleryCardCategory}
                        style={{ color: video.accentColor }}
                      >
                        {video.category}
                      </p>
                      <h4 className={styles.galleryCardTitle}>{video.title}</h4>
                      <p className={styles.galleryCardDesc}>{video.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <aside className={styles.rightSidebar}>

          {/* SPOTIFY PODCAST */}
          <div className={styles.podcastWidget}>
            <div className={styles.podcastHeader}>
              <div className={styles.podcastIcon}>
                <Headphones size={18} color="#ffffff" />
              </div>
              <div className={styles.podcastHeaderText}>
                <p className={styles.podcastTitle}>BorsaZeka Podcast</p>
                <p className={styles.podcastSubtitle}>Algoritmik ticaret & piyasa analizleri</p>
              </div>
              <span className={styles.spotifyBadge}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Spotify
              </span>
            </div>

            <div className={styles.podcastEmbed}>
              {/* Spotify Embed Placeholder — replace show ID when available */}
              <iframe
                src="https://open.spotify.com/embed/show/4rOoJ6Egrf8K2IrywzwOMk?utm_source=generator&theme=0"
                width="100%"
                height="232"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="BorsaZeka Podcast on Spotify"
                style={{ borderRadius: 14 }}
              />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className={styles.quickLinksWidget}>
            <p className={styles.quickLinksTitle}>Hızlı Erişim</p>
            <div className={styles.quickLinksList}>
              {QUICK_LINKS.map(link => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} className={styles.quickLinkItem}>
                    <div
                      className={styles.quickLinkIconWrap}
                      style={{ background: link.iconBg }}
                    >
                      <Icon size={15} color={link.iconColor} />
                    </div>
                    <div className={styles.quickLinkText}>
                      <p className={styles.quickLinkLabel}>{link.label}</p>
                      <p className={styles.quickLinkSub}>{link.sub}</p>
                    </div>
                    <ChevronRight size={14} className={styles.quickLinkArrow} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* COMING SOON */}
          <div className={styles.comingSoonWidget}>
            <div className={styles.comingSoonEmoji}>🎓</div>
            <p className={styles.comingSoonTitle}>Canlı Eğitimler Geliyor</p>
            <p className={styles.comingSoonDesc}>
              Uzmanlarımızla interaktif webinarlar ve canlı soru-cevap oturumları
              çok yakında başlıyor.
            </p>
            <button className={styles.notifyBtn}>
              <Bell size={12} />
              Beni Haberdar Et
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
}
