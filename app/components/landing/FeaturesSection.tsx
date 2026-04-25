"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import s from "./features-section.module.css";

/* ─── Animated SVG Line Chart ────────────────────────────────────────────── */
function AnimatedChart({ color = "#3b82f6" }: { color?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Smooth uptrend path
  const d = "M0 72 C20 68, 35 58, 50 52 S80 38, 100 32 S130 22, 150 18 S180 10, 200 8";

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 80"
      fill="none"
      className={s.chartSvg}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`chartGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`lineGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Fill area */}
      <motion.path
        d={`${d} L200 80 L0 80Z`}
        fill={`url(#chartGrad-${color.replace("#", "")})`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Line */}
      <motion.path
        d={d}
        stroke={`url(#lineGrad-${color.replace("#", "")})`}
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
      />

      {/* Data dots */}
      {[[50, 52], [100, 32], [150, 18], [200, 8]].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="3"
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.4 + i * 0.25 }}
        />
      ))}
    </svg>
  );
}

/* ─── Card 3D tilt on hover ──────────────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 400, damping: 40 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 400, damping: 40 });
  const glowX   = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glowY   = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`${s.cardOuter} ${className ?? ""}`}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Dynamic glare spot */}
      <motion.div
        className={s.cardGlare}
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.08) 0%, transparent 60%)`
          ),
        }}
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
}

/* ─── Feature data ────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    id: "ai",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" strokeLinecap="round"/>
        <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none"/>
        <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none"/>
        <path d="M9 15s1 1.5 3 1.5 3-1.5 3-1.5" strokeLinecap="round"/>
      </svg>
    ),
    label: "Yapay Zeka Analizi",
    desc: "GPT tabanlı piyasa analizi motoru gerçek zamanlı sinyaller üretir; al/sat kararlarınızı veriye dayalı hale getirir.",
    color: "#3b82f6",
    accent: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.2)",
    chart: true,
    stat: { label: "Sinyal Doğruluğu", value: "94.7%" },
  },
  {
    id: "robot",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="11" width="18" height="10" rx="2"/>
        <path d="M12 11V7" strokeLinecap="round"/>
        <circle cx="12" cy="5" r="2"/>
        <path d="M7 11V9a5 5 0 0 1 10 0v2" strokeLinecap="round"/>
        <line x1="8" y1="15" x2="8" y2="17" strokeLinecap="round"/>
        <line x1="16" y1="15" x2="16" y2="17" strokeLinecap="round"/>
      </svg>
    ),
    label: "Robot Yönetimi",
    desc: "DarkRoom, Highway ve TradeMate robotlarını tek panelden yönetin. 7/24 otomatik trade stratejileri.",
    color: "#10b981",
    accent: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.2)",
    chart: true,
    stat: { label: "Aktif Robot", value: "3 Model" },
  },
  {
    id: "security",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.17 9 11.33C17.25 22.17 21 17.25 21 12V7l-9-5z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Güvenli Altyapı",
    desc: "256-bit AES şifreleme, iki faktörlü kimlik doğrulama ve SOC2 uyumlu veri merkezi altyapısı.",
    color: "#a855f7",
    accent: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.2)",
    chart: false,
    stat: { label: "Uptime Garantisi", value: "99.9%" },
  },
  {
    id: "data",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 9l-5 5-4-4-3 3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Canlı Piyasa Verisi",
    desc: "BIST, Forex ve kripto piyasalarından saniyede güncellenen tick verisi. Gecikme yok, veri eksiği yok.",
    color: "#f59e0b",
    accent: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    chart: true,
    stat: { label: "Güncelleme Hızı", value: "<50ms" },
  },
  {
    id: "portfolio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" strokeLinecap="round"/>
        <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round"/>
        <line x1="10" y1="14" x2="14" y2="14" strokeLinecap="round"/>
      </svg>
    ),
    label: "Portföy Takibi",
    desc: "Tüm hesaplarınızı, pozisyonlarınızı ve P&L bilgilerini tek ekranda görün. Anlık kar/zarar takibi.",
    color: "#06b6d4",
    accent: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.2)",
    chart: true,
    stat: { label: "Desteklenen Broker", value: "12+" },
  },
  {
    id: "notify",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/>
        <circle cx="18" cy="5" r="3" fill="#f87171" stroke="none"/>
      </svg>
    ),
    label: "Anlık Bildirimler",
    desc: "Fiyat alarmları, robot durum değişiklikleri ve piyasa haberleri anında telefonunuza gelir.",
    color: "#f87171",
    accent: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.2)",
    chart: false,
    stat: { label: "Bildirim Gecikmesi", value: "<1sn" },
  },
];

/* ─── Section scroll reveal variants ─────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const headerVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.7, ease: "easeOut" } },
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className={s.section}
      id="ozellikler"
      aria-label="Platform Özellikleri"
    >
      {/* ── Orb background ── */}
      <div className={s.orbBg} aria-hidden="true">
        <div className={s.orb1} />
        <div className={s.orb2} />
        <div className={s.orb3} />
        <div className={s.grid} />
      </div>

      <div className={s.inner}>
        {/* ── Header ── */}
        <motion.div
          className={s.header}
          variants={headerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className={s.badge}>
            <span className={s.badgePulse} />
            Platform Özellikleri
          </div>
          <h2 className={s.title}>
            Yatırımı{" "}
            <span className={s.titleAccent}>Geleceğe Taşı</span>
          </h2>
          <p className={s.subtitle}>
            Yapay zeka, otomasyon ve gerçek zamanlı veri analizi ile yatırım
            kararlarını güçlendir. Her özellik, finansal hedeflerine ulaşman
            için tasarlandı.
          </p>
        </motion.div>

        {/* ── Cards Grid ── */}
        <motion.div
          className={s.grid6}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {FEATURES.map((feat) => (
            <motion.div key={feat.id} variants={cardVariants}>
              <TiltCard>
                {/* Glass card inner */}
                <div
                  className={s.card}
                  style={{
                    "--card-accent": feat.accent,
                    "--card-border": feat.border,
                    "--card-color":  feat.color,
                  } as React.CSSProperties}
                >
                  {/* Coloured orb inside card */}
                  <div
                    className={s.cardOrb}
                    style={{ background: `radial-gradient(circle, ${feat.color}22 0%, transparent 70%)` }}
                    aria-hidden="true"
                  />

                  {/* Icon */}
                  <div className={s.iconWrap} style={{ color: feat.color }}>
                    {feat.icon}
                  </div>

                  {/* Text */}
                  <h3 className={s.cardTitle}>{feat.label}</h3>
                  <p className={s.cardDesc}>{feat.desc}</p>

                  {/* Animated chart or stat badge */}
                  {feat.chart ? (
                    <div className={s.chartArea}>
                      <AnimatedChart color={feat.color} />
                      <div className={s.chartStat}>
                        <span className={s.chartStatLabel}>{feat.stat.label}</span>
                        <span className={s.chartStatValue} style={{ color: feat.color }}>
                          {feat.stat.value}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={s.statBadge} style={{ borderColor: feat.border, background: feat.accent }}>
                      <span className={s.statBadgeLabel}>{feat.stat.label}</span>
                      <span className={s.statBadgeValue} style={{ color: feat.color }}>
                        {feat.stat.value}
                      </span>
                    </div>
                  )}

                  {/* Bottom gradient line */}
                  <div
                    className={s.cardBottomLine}
                    style={{ background: `linear-gradient(90deg, transparent, ${feat.color}60, transparent)` }}
                    aria-hidden="true"
                  />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
