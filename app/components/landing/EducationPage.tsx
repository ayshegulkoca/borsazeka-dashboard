"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen, Play, Clock, ChevronRight, Bell,
  TrendingUp, Bot, BarChart2, Headphones,
  PlayCircle, Layers, Cpu, Mic,
  Video,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import styles from "./education.module.css";

// ── Main Component ─────────────────────────────────────────────────────────
export default function EducationPage() {
  const { t } = useTranslation("common");
  const [featuredPlaying, setFeaturedPlaying] = useState(false);

  // Gallery videos — titles/categories/descs driven by i18n keys
  const GALLERY_VIDEOS = [
    {
      id: 1,
      categoryKey: "education.video1Category",
      titleKey: "education.video1Title",
      descKey: "education.video1Desc",
      duration: "14:32",
      gradient: "linear-gradient(135deg, #1e3a5f 0%, #0f2040 100%)",
      accentColor: "#3b82f6",
      icon: BarChart2,
    },
    {
      id: 2,
      categoryKey: "education.video2Category",
      titleKey: "education.video2Title",
      descKey: "education.video2Desc",
      duration: "22:15",
      gradient: "linear-gradient(135deg, #2d1b69 0%, #1a0f40 100%)",
      accentColor: "#a855f7",
      icon: TrendingUp,
    },
    {
      id: 3,
      categoryKey: "education.video3Category",
      titleKey: "education.video3Title",
      descKey: "education.video3Desc",
      duration: "18:44",
      gradient: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
      accentColor: "#10b981",
      icon: Layers,
    },
  ];

  // Quick links — labels driven by i18n keys
  const QUICK_LINKS = [
    {
      labelKey: "education.quickLink1Label",
      subKey: "education.quickLink1Sub",
      href: "/robotlar",
      icon: Bot,
      iconBg: "rgba(59,130,246,0.12)",
      iconColor: "#60a5fa",
    },
    {
      labelKey: "education.quickLink2Label",
      subKey: "education.quickLink2Sub",
      href: "/urun-sec",
      icon: Cpu,
      iconBg: "rgba(168,85,247,0.12)",
      iconColor: "#c084fc",
    },
    {
      labelKey: "education.quickLink3Label",
      subKey: "education.quickLink3Sub",
      href: "/surec",
      icon: PlayCircle,
      iconBg: "rgba(16,185,129,0.12)",
      iconColor: "#34d399",
    },
  ];

  // Video tags — pulled from JSON array
  const videoTags: string[] = t("education.videoTags", { returnObjects: true }) as string[];

  return (
    <div className={styles.page}>
      <Navbar />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>
          <span className={styles.sectionTag}>
            <BookOpen size={12} />
            {t("education.sectionTag")}
          </span>
          <h1 className={styles.heroTitle}>
            {t("education.heroTitle").split(t("education.heroTitleAccent"))[0]}
            <span>{t("education.heroTitleAccent")}</span>
            {t("education.heroTitle").split(t("education.heroTitleAccent"))[1]}
          </h1>
          <p className={styles.heroSubtitle}>{t("education.heroSubtitle")}</p>
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
                <div
                  className={styles.videoPlaceholder}
                  onClick={() => setFeaturedPlaying(true)}
                  role="button"
                  aria-label={t("education.playVideo")}
                >
                  <div className={styles.videoBgGlow} />
                  <div className={styles.videoGridLines} />

                  <div className={styles.videoBadge}>
                    <span className={styles.liveIndicator} />
                    {t("education.introBadge")}
                  </div>

                  <div className={styles.playBtn}>
                    <Play size={26} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                  </div>
                  <span className={styles.playLabel}>{t("education.playVideo")}</span>
                </div>
              ) : (
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                  title={t("education.featuredVideoTitle")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                />
              )}
            </div>

            {/* Meta info */}
            <div className={styles.videoMeta}>
              <div className={styles.videoMetaHeader}>
                <h2 className={styles.videoTitle}>{t("education.featuredVideoTitle")}</h2>
                <span className={styles.videoDuration}>
                  <Clock size={12} />
                  28:40
                </span>
              </div>
              <p className={styles.videoDescription}>{t("education.featuredVideoDesc")}</p>
              <div className={styles.videoTagRow}>
                {Array.isArray(videoTags) && videoTags.map((tag: string) => (
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
                {t("education.galleryTitle")}
              </h3>
              <button className={styles.seeAllBtn}>
                {t("education.seeAll")} <ChevronRight size={14} />
              </button>
            </div>

            <div className={styles.galleryGrid}>
              {GALLERY_VIDEOS.map(video => {
                const Icon = video.icon;
                return (
                  <div
                    key={video.id}
                    className={styles.galleryCard}
                    role="button"
                    aria-label={t(video.titleKey)}
                  >
                    <div className={styles.galleryThumb}>
                      <div
                        className={styles.galleryThumbGradient}
                        style={{ background: video.gradient }}
                      />
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={32} color={video.accentColor} style={{ opacity: 0.25 }} />
                      </div>
                      <div className={styles.galleryPlayOverlay}>
                        <div className={styles.galleryPlayBtn}>
                          <Play size={16} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                        </div>
                      </div>
                      <span className={styles.galleryDuration}>{video.duration}</span>
                    </div>

                    <div className={styles.galleryCardBody}>
                      <p
                        className={styles.galleryCardCategory}
                        style={{ color: video.accentColor }}
                      >
                        {t(video.categoryKey)}
                      </p>
                      <h4 className={styles.galleryCardTitle}>{t(video.titleKey)}</h4>
                      <p className={styles.galleryCardDesc}>{t(video.descKey)}</p>
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
            {/* Custom corporate header */}
            <div className={styles.podcastHeader}>
              <div className={styles.podcastIcon}>
                <Headphones size={18} color="#ffffff" />
              </div>
              <div className={styles.podcastHeaderText}>
                <p className={styles.podcastTitle}>{t("education.podcastTitle")}</p>
                <p className={styles.podcastSubtitle}>{t("education.podcastSubtitle")}</p>
              </div>
              <span className={styles.spotifyBadge}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Spotify
              </span>
            </div>

            {/* Spotify embed — compact 152px mode (no artwork) */}
            <div className={styles.podcastEmbedWrap}>
              <iframe
                src="https://open.spotify.com/embed/show/7C2IDqAmrfl5UJ76IFyZIx?utm_source=generator&theme=0&view=list"
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={t("education.podcastTitle")}
                style={{ display: "block", border: "none" }}
              />
              {/* Koyu Maske: Sol taraftaki fotoğrafı tamamen kapatıp yerine şık Spotify logosu koyar */}
              <div 
                className="absolute top-0 left-[1.25rem] w-[152px] h-[152px] bg-[#090e1a] rounded-l-xl flex items-center justify-center border-r border-white/5 pointer-events-none"
                aria-hidden="true"
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="#1db954" className="opacity-95 drop-shadow-[0_0_10px_rgba(29,185,84,0.15)]">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className={styles.quickLinksWidget}>
            <p className={styles.quickLinksTitle}>{t("education.quickLinksTitle")}</p>
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
                      <p className={styles.quickLinkLabel}>{t(link.labelKey)}</p>
                      <p className={styles.quickLinkSub}>{t(link.subKey)}</p>
                    </div>
                    <ChevronRight size={14} className={styles.quickLinkArrow} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* COMING SOON */}
          <div className={styles.comingSoonWidget}>
            <p className={styles.comingSoonTitle}>{t("education.comingSoonTitle")}</p>
            <p className={styles.comingSoonDesc}>{t("education.comingSoonDesc")}</p>
            <button className={styles.notifyBtn}>
              <Bell size={12} />
              {t("education.notifyBtn")}
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
}
