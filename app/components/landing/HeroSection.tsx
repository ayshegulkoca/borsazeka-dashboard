"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { ArrowRight, Play } from "lucide-react";
import styles from "./landing.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero} style={{ padding: "10rem 2rem 8rem" }}>
      <div className={styles.heroInner}>
        {/* Left: Copy */}
        <div>
          <div className={styles.heroBadge}>
            <span style={{ width: 6, height: 6, background: "var(--accent-primary)", borderRadius: "50%", display: "inline-block" }} />
            Yeni: GPT-4o Destekli Analiz Motoru
          </div>

          <h1 className={styles.heroTitle}>
            Borsa Analizinde{" "}
            <span className={styles.accent}>Yapay Zeka</span>{" "}
            Dönemi
          </h1>

          <p className={styles.heroSubtitle}>
            Robotlarımız 7/24 piyasayı tarayarak sizin için en karlı pozisyonları tespit eder. Duygusuz, hızlı ve veriye dayalı ticaret artık elinizin altında.
          </p>

          <div className={styles.heroCTAGroup}>
            <button
              className={styles.btnHeroPrimary}
              onClick={() => signIn("google", { callbackUrl: "/checkout" })}
            >
              Ücretsiz Denemeye Başla
              <ArrowRight size={18} />
            </button>
            <a href="#robots" className={styles.btnHeroSecondary}>
              <Play size={16} />
              Robotları Keşfet
            </a>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>+%34</span>
              <span className={styles.heroStatLabel}>Ort. Yıllık Getiri</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>12K+</span>
              <span className={styles.heroStatLabel}>Aktif Kullanıcı</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>99.9%</span>
              <span className={styles.heroStatLabel}>Uptime SLA</span>
            </div>
          </div>
        </div>

        {/* Right: Mockup */}
        <div className={styles.heroImagePanel}>
          <div className={styles.heroImageWrap}>
            <Image
              src="/dashboard-mockup.png"
              alt="BorsaZeka Dashboard Önizleme"
              width={900}
              height={560}
              priority
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className={styles.heroImageGlow} />
        </div>
      </div>
    </section>
  );
}
