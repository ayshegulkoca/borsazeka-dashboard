"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";
import MagneticButton from "./MagneticButton";

// ─── Particle System ──────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  opacity: number;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef<number>(0);
  const CONNECT_DIST = 130;
  const AURA_DIST = 140;
  const AURA_FORCE = 0.04;
  const COUNT = 80;

  const init = useCallback((canvas: HTMLCanvasElement) => {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    particles.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    init(canvas);
    const ctx = canvas.getContext("2d")!;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const pts = particles.current;

      for (const p of pts) {
        // Cursor AURA: attract particles toward mouse
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < AURA_DIST && dist > 1) {
          const force = (1 - dist / AURA_DIST) * AURA_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Damping
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Aura proximity brightens particle
        const auraPct = dist < AURA_DIST ? (1 - dist / AURA_DIST) : 0;
        const finalOpacity = Math.min(1, p.opacity + auraPct * 0.6);
        const finalRadius = p.radius + auraPct * 1.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, finalRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${finalOpacity})`;
        ctx.fill();

        // Glow for aura particles
        if (auraPct > 0.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, finalRadius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16,185,129,${auraPct * 0.08})`;
          ctx.fill();
        }
      }

      // Connect lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const ddx = pts[i].x - pts[j].x;
          const ddy = pts[i].y - pts[j].y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.2;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      raf.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "auto", zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}

// ─── Count-Up Hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, suffix = "") {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const pct = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - pct, 3); // ease-out-cubic
            setValue(Math.round(eased * target));
            if (pct < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, display: `${value}${suffix}` };
}

// ─── Stat with count-up ───────────────────────────────────────────────────────
function CountStat({ number, label }: { number: string; label: string }) {
  // Handles formats: "+%34", "99.9%", "10+ yıl", "500+", etc.
  const numMatch = number.match(/([\d]+\.?[\d]*)/);
  const raw = numMatch ? parseFloat(numMatch[1]) : 0;
  const isDecimal = raw !== Math.round(raw);
  const { ref, display } = useCountUp(isDecimal ? Math.round(raw * 10) : raw, 2000);

  // Reconstruct original format with animated number
  const animated = isDecimal
    ? (parseInt(display) / 10).toFixed(1)
    : display.toString();
  const final = number.replace(/([\d]+\.?[\d]*)/, animated);

  return (
    <div className={styles.heroStat}>
      <span ref={ref} className={styles.heroStatNumber}>{final}</span>
      <span className={styles.heroStatLabel}>{label}</span>
    </div>
  );
}


// ─── Main Hero ────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const { t } = useTranslation("common");
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax on mouse move
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const glow1 = section.querySelector<HTMLElement>(`.${styles.heroGlow1}`);
    const glow2 = section.querySelector<HTMLElement>(`.${styles.heroGlow2}`);
    const chart = section.querySelector<SVGElement>(`.${styles.heroChartSvg}`);

    const onMove = (e: MouseEvent) => {
      const { clientX, clientY, currentTarget } = e;
      const el = currentTarget as HTMLElement;
      const { left, top, width, height } = el.getBoundingClientRect();
      const rx = (clientX - left) / width - 0.5; // -0.5 → 0.5
      const ry = (clientY - top) / height - 0.5;

      if (glow1) {
        glow1.style.transform = `translate(${rx * 30}px, ${ry * 20}px)`;
      }
      if (glow2) {
        glow2.style.transform = `translate(${rx * -20}px, ${ry * -15}px)`;
      }
      if (chart) {
        chart.style.transform = `translate(${rx * 12}px, ${ry * 8}px)`;
      }

      // Update grid glow position
      el.style.setProperty("--mouse-x", `${clientX - left}px`);
      el.style.setProperty("--mouse-y", `${clientY - top}px`);
    };
    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={sectionRef} className={styles.heroCentered}>
      {/* ── Particle canvas (interactive) ── */}
      <ParticleCanvas />

      {/* ── Static background layers (parallax via JS) ── */}
      <div className={styles.heroBackground} aria-hidden="true">
        {/* Interactive Grid / Izgara system */}
        <div className={styles.heroGrid} />

        <svg
          className={styles.heroChartSvg}
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMid slice"
          style={{ transition: "transform 0.15s ease-out" }}
        >
          <polyline
            className={styles.heroChartLine1}
            points="0,400 120,360 240,380 360,300 480,320 600,260 720,280 840,220 960,240 1080,180 1200,200 1320,140 1440,160"
            fill="none" strokeWidth="2"
          />
          <polyline
            className={styles.heroChartLine2}
            points="0,460 150,440 300,450 450,400 600,420 750,370 900,390 1050,340 1200,360 1440,310"
            fill="none" strokeWidth="1.5"
          />
          <polyline
            className={styles.heroChartLine3}
            points="0,500 200,490 400,480 500,460 650,470 800,440 1000,430 1200,410 1440,400"
            fill="none" strokeWidth="1"
          />
          {[180, 360, 540, 720, 900, 1080, 1260].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="600" stroke="rgba(16,185,129,0.04)" strokeWidth="1" />
          ))}
          {[150, 300, 450].map((y) => (
            <line key={y} x1="0" y1={y} x2="1440" y2={y} stroke="rgba(16,185,129,0.04)" strokeWidth="1" />
          ))}
          {[[480, 320], [720, 280], [960, 240], [1200, 200]].map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r="4" fill="rgba(16,185,129,0.5)" className={styles.heroChartDot} />
          ))}
        </svg>

        <div className={styles.heroGlow1} style={{ transition: "transform 0.15s ease-out" }} />
        <div className={styles.heroGlow2} style={{ transition: "transform 0.15s ease-out" }} />
      </div>

      {/* ── Content ── */}
      <div className={styles.heroCenteredInner}>
        <div className={`${styles.heroBadge} ${styles.floating}`} style={{ animationDelay: "0.2s" }}>
          <span style={{ width: 6, height: 6, background: "var(--accent-primary)", borderRadius: "50%", display: "inline-block" }} />
          {t("hero.badge")}
        </div>

        <h1 className={`${styles.heroCenteredTitle} ${styles.floating}`} style={{ animationDelay: "0s" }}>
          {t("hero.mainSlogan")}
          <span className={styles.heroCenteredAccent}> {t("hero.titleAccent")}</span>
        </h1>

        <p className={`${styles.heroCenteredSubtitle} ${styles.floating}`} style={{ animationDelay: "0.4s" }}>{t("hero.subSlogan")}</p>

        {/* CTA with rotating border glow + magnetic effect */}
        <MagneticButton strength={0.2}>
          <div className={`${styles.heroCTAWrapper} ${styles.floating}`} style={{ animationDelay: "0.6s" }}>
            <Link href="/urun-sec" className={`${styles.heroCenteredCTA} ${styles.neonBorder}`} id="hero-cta-btn">
              {t("hero.ctaButton")}
              <ArrowRight size={20} />
            </Link>
          </div>
        </MagneticButton>

        {/* Glassmorphism Stats Bar */}
        <div className={`${styles.heroCenteredStats} ${styles.floating}`} style={{ animationDelay: "0.8s" }}>
          <CountStat number={t("hero.stat1Number")} label={t("hero.stat1Label")} />
          <div className={styles.heroStatDivider} />
          <CountStat number={t("hero.stat2Number")} label={t("hero.stat2Label")} />
          <div className={styles.heroStatDivider} />
          <CountStat number={t("hero.stat3Number")} label={t("hero.stat3Label")} />
        </div>
      </div>
    </section>
  );
}
