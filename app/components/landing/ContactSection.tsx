"use client";

import { Activity, ExternalLink, Send } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";

function XIcon({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export default function ContactSection() {
  const { t } = useTranslation("common");

  const channels = [
    {
      id: "twitter",
      labelKey: "contact.twitterLabel",
      handle: "@DH_Altin",
      url: "https://www.x.com/DH_Altin",
      color: "#1d9bf0",
      bg: "rgba(29,155,240,0.08)",
      border: "rgba(29,155,240,0.2)",
      renderIcon: (color: string) => <XIcon size={22} color={color} />,
    },
    {
      id: "telegram-dm",
      labelKey: "contact.telegramDmLabel",
      handle: "@semiharslan",
      url: "https://t.me/semiharslan",
      color: "#26a5e4",
      bg: "rgba(38,165,228,0.08)",
      border: "rgba(38,165,228,0.2)",
      renderIcon: (color: string) => <Send size={22} color={color} />,
    },
    {
      id: "telegram-channel",
      labelKey: "contact.telegramChannelLabel",
      handle: "@BorsaZekaCom",
      url: "https://t.me/BorsaZekaCom",
      color: "#34d399",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.2)",
      renderIcon: (color: string) => <Send size={22} color={color} />,
    },
  ];

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{t("contact.sectionTag")}</span>
          <h2 className={styles.sectionTitle}>{t("contact.sectionTitle")}</h2>
          <p className={styles.sectionSubtitle}>
            {t("contact.sectionSubtitle")}{" "}
            <a href="/surec" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
              {t("contact.howItWorksLink")}
            </a>{" "}
            {t("contact.sectionSubtitleEnd")}
          </p>
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

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <Activity size={16} color="var(--accent-primary)" />
            BorsaZeka
          </div>
          <ul className={styles.footerLinks}>
            <li><a href="/">{t("footer.home") || "Anasayfa"}</a></li>
            <li><Link href="/urun-sec">{t("footer.findProduct")}</Link></li>
            <li><Link href="/surec">{t("footer.howItWorks")}</Link></li>
            <li><Link href="/iletisim">{t("footer.contact")}</Link></li>
            <li><Link href="/gizlilik-politikasi">{t("legal.privacy.title")}</Link></li>
            <li><Link href="/kullanim-kosullari">{t("legal.terms.title")}</Link></li>
          </ul>
          <span className={styles.footerCopy}>{t("footer.copyright")}</span>
        </div>
      </footer>
    </section>
  );
}
