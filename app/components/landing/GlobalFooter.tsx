"use client";

import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import s from "./global-footer.module.css";

export default function GlobalFooter() {
  const { t } = useTranslation("common");

  return (
    <footer className={s.footer} id="contact" aria-label="Global Footer">
      <div className={s.watermark} aria-hidden="true">BorsaZeka</div>

      <div className={s.inner}>
        {/* CTA Banner */}
        <div className={s.ctaBanner}>
          <div className={s.ctaBannerText}>
            <span className={s.ctaBannerLabel}>Stratejinizi Belirleyin</span>
            <span className={s.ctaBannerTitle}>
              Size Özel Stratejiyi Henüz Belirlemediniz mi?
            </span>
          </div>
          <Link href="/urun-sec" className={s.ctaBannerBtn} id="footer-wizard-cta">
            Robot Sihirbazını Başlat <ArrowRight size={16} />
          </Link>
        </div>

        {/* Footer bar */}
        <div className={s.footerBar}>
          <div className={s.footerLeft}>
            <Link href="/" className={s.logo}>
              <Activity size={15} color="#00FF9D" />
              BorsaZeka
            </Link>

            <ul className={s.navLinks}>
              <li><Link href="/">{t("footer.home")}</Link></li>
              <li><Link href="/robotlar">{t("navbar.robots")}</Link></li>
              <li><Link href="/urun-sec">{t("footer.findProduct")}</Link></li>
              <li><Link href="/surec">{t("footer.howItWorks")}</Link></li>
              <li><Link href="/iletisim">{t("footer.contact")}</Link></li>
            </ul>

            <ul className={s.legalLinks}>
              <li><Link href="/gizlilik-politikasi">{t("legal.privacy.title")}</Link></li>
              <li><Link href="/kullanim-kosullari">{t("legal.terms.title")}</Link></li>
            </ul>
          </div>

          <span className={s.copyright}>{t("footer.copyright")}</span>
        </div>
      </div>
    </footer>
  );
}
