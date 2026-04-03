"use client";

import Link from "next/link";
import { Activity, ExternalLink, Send, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";

function XIcon({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export default function IletisimPage() {
  const { t } = useTranslation("common");

  const channels = [
    {
      id: "twitter",
      labelKey: "iletisim.twitterLabel",
      handle: "@DH_Altin",
      url: "https://www.x.com/DH_Altin",
      color: "#1d9bf0",
      bg: "rgba(29,155,240,0.08)",
      border: "rgba(29,155,240,0.2)",
      renderIcon: (color: string) => <XIcon size={22} color={color} />,
    },
    {
      id: "telegram-dm",
      labelKey: "iletisim.telegramDmLabel",
      handle: "@semiharslan",
      url: "https://t.me/semiharslan",
      color: "#26a5e4",
      bg: "rgba(38,165,228,0.08)",
      border: "rgba(38,165,228,0.2)",
      renderIcon: (color: string) => <Send size={22} color={color} />,
    },
    {
      id: "telegram-channel",
      labelKey: "iletisim.telegramChannelLabel",
      handle: "@BorsaZekaCom",
      url: "https://t.me/BorsaZekaCom",
      color: "#34d399",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.2)",
      renderIcon: (color: string) => <Send size={22} color={color} />,
    },
  ];

  const reasons = [
    t("iletisim.reason1"),
    t("iletisim.reason2"),
    t("iletisim.reason3"),
    t("iletisim.reason4"),
  ];

  return (
    <main style={{ minHeight: "100vh", paddingTop: "80px" }}>
      {/* Hero */}
      <section className={styles.section} style={{ paddingBottom: "3rem" }}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>{t("iletisim.tag")}</span>
            <h1 className={styles.sectionTitle}>{t("iletisim.title")}</h1>
            <p className={styles.sectionSubtitle}>{t("iletisim.subtitle")}</p>
          </div>

          {/* Channel Cards */}
          <div className={styles.contactGrid}>
            {channels.map((ch) => (
              <a
                key={ch.id}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactCard}
                style={{ background: ch.bg, borderColor: ch.border }}
              >
                <div
                  className={styles.contactCardIconWrap}
                  style={{ background: ch.bg, borderColor: ch.border }}
                >
                  {ch.renderIcon(ch.color)}
                </div>
                <div className={styles.contactCardBody}>
                  <div className={styles.contactCardLabel}>{t(ch.labelKey)}</div>
                  <div className={styles.contactCardHandle} style={{ color: ch.color }}>
                    {ch.handle}
                  </div>
                </div>
                <ExternalLink size={16} className={styles.contactCardArrow} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Contact */}
      <section className={`${styles.section} ${styles.featuresSection}`} style={{ paddingTop: "3rem" }}>
        <div className={styles.container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div>
              <span className={styles.sectionTag}>{t("iletisim.whyContact")}</span>
              <h2 className={styles.sectionTitle} style={{ textAlign: "left", marginTop: "0.5rem" }}>
                {t("iletisim.title")}
              </h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.875rem", marginTop: "1.5rem" }}>
                {reasons.map((r, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: "rgba(16,185,129,0.15)",
                      border: "1px solid rgba(16,185,129,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.65rem", fontWeight: 700, color: "var(--accent-primary)",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      {i + 1}
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Wizard CTA card */}
            <div style={{
              background: "linear-gradient(135deg, #07200f 0%, #0a2d16 100%)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 20,
              padding: "2rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}></div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                {t("wizardCta.title")}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {t("wizardCta.subtitle")}
              </p>
              <Link
                href="/urun-sec"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.875rem 1.75rem", borderRadius: 10,
                  background: "var(--accent-primary)", color: "#022c22",
                  fontWeight: 700, fontSize: "0.9rem", transition: "all 0.2s",
                }}
              >
                {t("iletisim.wizardCta")}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <Activity size={16} color="var(--accent-primary)" />
            BorsaZeka
          </div>
          <ul className={styles.footerLinks}>
            <li><a href="/#features">{t("footer.features")}</a></li>
            <li><Link href="/urun-sec">{t("footer.findProduct")}</Link></li>
            <li><Link href="/surec">{t("footer.howItWorks")}</Link></li>
            <li><Link href="/iletisim">{t("footer.contact")}</Link></li>
          </ul>
          <span className={styles.footerCopy}>{t("footer.copyright")}</span>
        </div>
      </footer>
    </main>
  );
}
