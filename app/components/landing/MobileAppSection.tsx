"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import s from "./mobile-app.module.css";

/* ─── Animated counter hook (intersection-aware) ─────────────────────────── */
function useInView(threshold = 0.25) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── QR Code SVG placeholder ────────────────────────────────────────────── */
function QRCodePlaceholder() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={s.qrSvg}
      aria-label="QR Code"
    >
      {/* Outer finder patterns */}
      <rect x="5" y="5" width="30" height="30" rx="3" stroke="rgba(148, 163, 184, 0.7)" strokeWidth="3" fill="none" />
      <rect x="12" y="12" width="16" height="16" rx="1" fill="rgba(148, 163, 184, 0.7)" />
      <rect x="65" y="5" width="30" height="30" rx="3" stroke="rgba(148, 163, 184, 0.7)" strokeWidth="3" fill="none" />
      <rect x="72" y="12" width="16" height="16" rx="1" fill="rgba(148, 163, 184, 0.7)" />
      <rect x="5" y="65" width="30" height="30" rx="3" stroke="rgba(148, 163, 184, 0.7)" strokeWidth="3" fill="none" />
      <rect x="12" y="72" width="16" height="16" rx="1" fill="rgba(148, 163, 184, 0.7)" />
      {/* Data modules (simplified) */}
      {[
        [45,5],[50,5],[55,5],[60,5],
        [45,12],[55,12],[60,12],
        [45,19],[50,19],[60,19],
        [45,26],[50,26],[55,26],
        [45,33],[55,33],[60,33],
        [5,45],[10,45],[20,45],[25,45],[30,45],
        [5,52],[15,52],[25,52],
        [5,59],[10,59],[20,59],[30,59],
        [45,45],[50,45],[55,45],[60,45],[65,45],[70,45],[75,45],[80,45],[85,45],[90,45],[95,45],
        [45,52],[55,52],[65,52],[75,52],[85,52],[95,52],
        [45,59],[50,59],[60,59],[70,59],[80,59],[90,59],
        [45,66],[55,66],[65,66],[75,66],[85,66],[95,66],
        [45,73],[50,73],[60,73],[70,73],[80,73],[90,73],
        [45,80],[55,80],[65,80],[75,80],[85,80],[95,80],
        [45,87],[50,87],[60,87],[70,87],[80,87],[90,87],
        [45,94],[55,94],[65,94],[75,94],[85,94],[95,94],
        [5,66],[15,66],[20,66],[30,66],
        [5,73],[10,73],[20,73],[30,73],
        [5,80],[15,80],[25,80],
        [5,87],[10,87],[20,87],[30,87],
        [5,94],[15,94],[25,94],[30,94],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill="rgba(148, 163, 184, 0.55)" />
      ))}
    </svg>
  );
}

/* ─── App Store Button ───────────────────────────────────────────────────── */
function AppStoreButton({ sub, name }: { sub: string; name: string }) {
  return (
    <a
      href="#"
      id="mobile-app-appstore-btn"
      className={s.storeBtn}
      aria-label={`${sub} ${name}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg className={s.storeBtnIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.82.03 3.02 2.65 4.03 2.68 4.04l-.06.26zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
      <div className={s.storeBtnText}>
        <span className={s.storeBtnSub}>{sub}</span>
        <span className={s.storeBtnName}>{name}</span>
      </div>
    </a>
  );
}

/* ─── Google Play Button ─────────────────────────────────────────────────── */
function GooglePlayButton({ sub, name }: { sub: string; name: string }) {
  return (
    <a
      href="#"
      id="mobile-app-googleplay-btn"
      className={s.storeBtn}
      aria-label={`${sub} ${name}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg className={s.storeBtnIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" fill="url(#gp-grad)"/>
        <defs>
          <linearGradient id="gp-grad" x1="3" y1="12" x2="19" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00d2ff"/>
            <stop offset="33%" stopColor="#00e676"/>
            <stop offset="66%" stopColor="#ffea00"/>
            <stop offset="100%" stopColor="#ff6d00"/>
          </linearGradient>
        </defs>
      </svg>
      <div className={s.storeBtnText}>
        <span className={s.storeBtnSub}>{sub}</span>
        <span className={s.storeBtnName}>{name}</span>
      </div>
    </a>
  );
}

/* ─── Phone Mockup with Video ────────────────────────────────────────────── */
function PhoneMockup({ chipLeft, chipRight, portfolio, status }: {
  chipLeft: string;
  chipRight: string;
  portfolio: string;
  status: string;
}) {
  return (
    <div className={s.phoneWrapper}>
      {/* Glow behind phone */}
      <div className={s.phoneGlow} aria-hidden="true" />

      {/* Floating stat chips */}
      <div className={`${s.floatChip} ${s.floatChipLeft}`} aria-hidden="true">
        <span className={s.floatChipDotBlue} />
        <span className={s.floatChipTextBlue}>{chipLeft}</span>
      </div>
      <div className={`${s.floatChip} ${s.floatChipRight}`} aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
          <polyline points="16 7 22 7 22 13"/>
        </svg>
        <span>{chipRight}</span>
      </div>

      {/* Phone frame */}
      <div className={s.phone}>
        {/* Notch / Dynamic Island */}
        <div className={s.phoneNotch} aria-hidden="true">
          <div className={s.phoneNotchPill} />
        </div>

        {/* Screen */}
        <div className={s.phoneScreen}>
          {/* Status bar */}
          <div className={s.phoneStatusBar} aria-hidden="true">
            <span>9:41</span>
            <div className={s.phoneStatusIcons}>
              <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="3" width="3" height="7" rx="0.5"/><rect x="4.5" y="2" width="3" height="8" rx="0.5"/><rect x="9" y="0" width="3" height="10" rx="0.5"/><rect x="13.5" y="0.5" width="2" height="9" rx="0.5" opacity=".35"/></svg>
              <svg width="15" height="10" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 2.25A7.1 7.1 0 0 1 12.9 4.5L14.25 3A9.35 9.35 0 0 0 7.5 0 9.35 9.35 0 0 0 .75 3L2.1 4.5A7.1 7.1 0 0 1 7.5 2.25z" opacity=".35"/><path d="M7.5 5.25A4.1 4.1 0 0 1 10.4 6.5L11.75 5a6 6 0 0 0-8.5 0L4.6 6.5A4.1 4.1 0 0 1 7.5 5.25z"/><circle cx="7.5" cy="9.5" r="1.5"/></svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity=".35" fill="none"/><rect x="2" y="2" width="16" height="8" rx="2" fill="#3730A3"/><rect x="22.5" y="4" width="2" height="4" rx="1" fill="currentColor" fillOpacity=".4"/></svg>
            </div>
          </div>

          {/* Video area */}
          <div className={s.phoneVideoWrapper}>
            <video
              className={s.phoneVideo}
              autoPlay
              loop
              muted
              playsInline
              aria-label="Borsazeka app preview"
            >
              <div />
            </video>

            {/* Fallback overlay */}
            <div className={s.phoneVideoFallback} aria-hidden="true">
              <div className={s.phoneVideoFallbackBg} />
              {/* Mock chart */}
              <svg className={s.mockChart} viewBox="0 0 280 160" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)"/>
                    <stop offset="100%" stopColor="rgba(139, 92, 246, 0)"/>
                  </linearGradient>
                </defs>
                <path d="M0 130 L30 115 L60 125 L90 90 L120 100 L150 70 L180 80 L210 50 L240 60 L280 30 L280 160 L0 160Z" fill="url(#chartFill)"/>
                <path d="M0 130 L30 115 L60 125 L90 90 L120 100 L150 70 L180 80 L210 50 L240 60 L280 30" stroke="#3B82F6" strokeWidth="2" fill="none" className={s.chartLine}/>
                <circle cx="280" cy="30" r="4" fill="#3B82F6" className={s.chartDotBlue}/>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3730A3"/>
                    <stop offset="100%" stopColor="#6366F1"/>
                  </linearGradient>
                </defs>
              </svg>
              {/* Stats row */}
              <div className={s.mockStatsRow}>
                <div className={s.mockStat}>
                  <span className={s.mockStatLabel}>BIST 100</span>
                  <span className={s.mockStatVal}>9.847,22</span>
                  <span className={s.mockStatChange}>+%1.24</span>
                </div>
                <div className={s.mockStat}>
                  <span className={s.mockStatLabel}>{portfolio}</span>
                  <span className={s.mockStatVal}>₺142.580</span>
                  <span className={s.mockStatChange}>+%3.7</span>
                </div>
              </div>
              {/* Robot card */}
              <div className={s.mockRobotCard}>
                <div className={s.mockRobotIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M7 11V9a5 5 0 0 1 10 0v2"/></svg>
                </div>
                <div>
                  <div className={s.mockRobotName}>DarkRoom</div>
                  <div className={s.mockRobotStatus}>
                    <span className={s.mockRobotDot}/> {status}
                  </div>
                </div>
                <div className={s.mockRobotProfit}>+₺4.230</div>
              </div>
            </div>
          </div>

          {/* Bottom nav bar mock */}
          <div className={s.phoneNavBar} aria-hidden="true">
            {["M3 12h18M3 6h18M3 18h18","M22 12h-4m0 0V8m0 4v4M2 12h4m0 0V8m0 4v4M12 2v4m0 0h-4m4 0h4M12 22v-4m0 0h-4m4 0h4","M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z","M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"].map((d, i) => (
              <button key={i} className={`${s.phoneNavBtn} ${i === 0 ? s.phoneNavBtnActive : ""}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={d}/></svg>
              </button>
            ))}
          </div>
        </div>

        {/* Phone side buttons */}
        <div className={s.phoneSideLeft} aria-hidden="true">
          <div className={s.phoneSideBtn} style={{ top: "20%", height: "6%" }}/>
          <div className={s.phoneSideBtn} style={{ top: "29%", height: "9%" }}/>
          <div className={s.phoneSideBtn} style={{ top: "40%", height: "9%" }}/>
        </div>
        <div className={s.phoneSideRight} aria-hidden="true">
          <div className={s.phoneSideBtn} style={{ top: "25%", height: "12%" }}/>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────────── */
export default function MobileAppSection() {
  const { ref, inView } = useInView(0.15);
  const { t } = useTranslation("common");

  const features = [
    { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: t("mobileApp.feature1") },
    { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: t("mobileApp.feature2") },
    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: t("mobileApp.feature3") },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`${s.section} ${inView ? s.sectionVisible : ""}`}
      id="download-app"
      aria-label={`${t("mobileApp.headline1")} ${t("mobileApp.headline2")}`}
    >
      {/* ── Mesh background ── */}
      <div className={s.meshBg} aria-hidden="true">
        <div className={s.meshOrb1} />
        <div className={s.meshOrb2} />
        <div className={s.meshOrb3} />
        <div className={s.meshGrid} />
      </div>

      <div className={s.inner}>
        {/* ── Left: Phone Mockup ── */}
        <div className={`${s.leftCol} ${inView ? s.leftColVisible : ""}`}>
          <PhoneMockup
            chipLeft={t("mobileApp.chipLeft")}
            chipRight={t("mobileApp.chipRight")}
            portfolio={t("mobileApp.mockPortfolio")}
            status={t("mobileApp.mockStatus")}
          />
        </div>

        {/* ── Right: Copy + CTA ── */}
        <div className={`${s.rightCol} ${inView ? s.rightColVisible : ""}`}>
          {/* Badge */}
          <div className={s.badge}>
            <span className={s.badgeDot} />
            {t("mobileApp.badge")}
          </div>

          {/* Headline */}
          <h2 className={s.headline}>
            {t("mobileApp.headline1")}{" "}
            <span className={s.headlineAccent}>{t("mobileApp.headline2")}</span>
            {t("mobileApp.headline3") && (
              <>
                <br />
                <span className={s.headlineSub}>{t("mobileApp.headline3")}</span>
              </>
            )}
          </h2>

          {/* Description */}
          <p className={s.description}>
            {t("mobileApp.description")}
          </p>

          {/* Feature pills */}
          <div className={s.features}>
            {features.map(({ icon, label }) => (
              <div key={label} className={s.featurePill}>
                <svg className={s.featurePillIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d={icon} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {label}
              </div>
            ))}
          </div>

          {/* Store buttons + QR */}
          <div className={s.downloadArea}>
            <div className={s.storeButtons}>
              <AppStoreButton
                sub={t("mobileApp.appStoreSub")}
                name={t("mobileApp.appStoreName")}
              />
              <GooglePlayButton
                sub={t("mobileApp.googlePlaySub")}
                name={t("mobileApp.googlePlayName")}
              />
            </div>

            {/* QR Divider */}
            <div className={s.qrDivider} aria-hidden="true">
              <div className={s.qrDividerLine}/>
              <span className={s.qrDividerText}>{t("mobileApp.orDivider")}</span>
              <div className={s.qrDividerLine}/>
            </div>

            {/* QR Code */}
            <div className={s.qrBlock}>
              <div className={s.qrFrame}>
                <QRCodePlaceholder />
              </div>
              <div className={s.qrLabel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 0v20M2 12h20" strokeLinecap="round"/>
                </svg>
                {t("mobileApp.qrLabel")}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
