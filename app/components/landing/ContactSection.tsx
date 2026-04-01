"use client";

import { Activity, ExternalLink, Send } from "lucide-react";
import styles from "./landing.module.css";

// X (Twitter) logo — lucide-react doesn't export Twitter, so we use an inline SVG
function XIcon({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

type Channel = {
  id: string;
  label: string;
  handle: string;
  url: string;
  color: string;
  bg: string;
  border: string;
  renderIcon: (color: string) => React.ReactNode;
};

const CHANNELS: Channel[] = [
  {
    id: "twitter",
    label: "Twitter / X",
    handle: "@DH_Altin",
    url: "https://www.x.com/DH_Altin",
    color: "#1d9bf0",
    bg: "rgba(29,155,240,0.08)",
    border: "rgba(29,155,240,0.2)",
    renderIcon: (color) => <XIcon size={22} color={color} />,
  },
  {
    id: "telegram-dm",
    label: "Telegram (Özel)",
    handle: "@semiharslan",
    url: "https://t.me/semiharslan",
    color: "#26a5e4",
    bg: "rgba(38,165,228,0.08)",
    border: "rgba(38,165,228,0.2)",
    renderIcon: (color) => <Send size={22} color={color} />,
  },
  {
    id: "telegram-channel",
    label: "Telegram Kanalı",
    handle: "@BorsaZekaCom",
    url: "https://t.me/BorsaZekaCom",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    renderIcon: (color) => <Send size={22} color={color} />,
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>İletişim</span>
          <h2 className={styles.sectionTitle}>Bize Ulaşın</h2>
          <p className={styles.sectionSubtitle}>
            Sorularınız için aşağıdaki kanalları kullanabilirsiniz.
            Başvuru yapmak istiyorsanız{" "}
            <a href="/surec" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
              Nasıl Çalışır?
            </a>{" "}
            sayfasını ziyaret edin.
          </p>
        </div>

        {/* Channel Cards */}
        <div className={styles.contactGrid}>
          {CHANNELS.map((ch) => (
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
                <div className={styles.contactCardLabel}>{ch.label}</div>
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
            <li><a href="#features">Özellikler</a></li>
            <li><a href="#robots">Robotlar</a></li>
            <li><a href="#pricing">Fiyatlar</a></li>
            <li><a href="/surec">Nasıl Çalışır?</a></li>
          </ul>
          <span className={styles.footerCopy}>© 2025 BorsaZeka. Tüm hakları saklıdır.</span>
        </div>
      </footer>
    </section>
  );
}
