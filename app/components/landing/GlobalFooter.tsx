"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import s from "./global-footer.module.css";

export default function GlobalFooter() {
  const { t } = useTranslation("common");

  return (
    <footer className={s.footer} id="contact" aria-label="Global Footer">
      <div className={s.inner}>
        {/* Minimalist Top Footer Bar */}
        <div className={s.footerTop}>
          <div className={s.footerBrand}>
            <Link href="/" className={s.logo}>
              <Activity size={18} color="#FFFFFF" strokeWidth={2.5} />
              <span>BorsaZeka</span>
            </Link>
            <p className={s.tagline}>{t("footer.tagline")}</p>
          </div>

          <div className={s.footerLinksGrid}>
            <div className={s.linkGroup}>
              <h4 className={s.groupTitle}>{t("navbar.howItWorks")}</h4>
              <ul className={s.linkList}>
                <li><Link href="/surec">{t("footer.howItWorks")}</Link></li>
                <li><Link href="/robotlar">{t("navbar.robots")}</Link></li>
                <li><Link href="/urun-sec">{t("footer.findProduct")}</Link></li>
              </ul>
            </div>
            <div className={s.linkGroup}>
              <h4 className={s.groupTitle}>BorsaZeka</h4>
              <ul className={s.linkList}>
                <li><Link href="/">{t("footer.home")}</Link></li>
                <li><Link href="/iletisim">{t("footer.contact")}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={s.footerBottom}>
          <div className={s.legalLinks}>
            <Link href="/gizlilik-politikasi">{t("legal.privacy.title")}</Link>
            <Link href="/kullanim-kosullari">{t("legal.terms.title")}</Link>
          </div>
          <span className={s.copyright}>{t("footer.copyright")}</span>
        </div>
      </div>
    </footer>
  );
}
