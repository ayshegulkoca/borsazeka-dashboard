"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";
import MagneticButton from "./MagneticButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, i18n } = useTranslation("common");
  const currentLang = i18n.language?.startsWith("tr") ? "tr" : "en";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        {/* Logo */}
        <Link href="/" className={styles.navLogo}>
          <div className={styles.navLogoIcon}>
            <Activity size={18} color="#022c22" strokeWidth={2.5} />
          </div>
          BorsaZeka
        </Link>

        {/* Center Links */}
        <ul className={styles.navLinks}>
          <li>
            <Link href="/robotlar">{t("navbar.ourRobots")}</Link>
          </li>
          <li>
            <Link href="/urun-sec">{t("navbar.findProduct")}</Link>
          </li>
          <li>
            <Link href="/surec">{t("navbar.howItWorks")}</Link>
          </li>
          <li>
            <Link href="/iletisim">{t("navbar.contact")}</Link>
          </li>
          <li>
            <Link href="/kurulum" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>{t("navbar.setup")}</Link>
          </li>
        </ul>

        {/* Right Actions */}
        <div className={styles.navActions}>
          {/* Language Toggle */}
          <div className={styles.langToggle}>
            <button
              className={`${styles.langBtn} ${currentLang === "tr" ? styles.langBtnActive : ""}`}
              onClick={() => changeLanguage("tr")}
              aria-label="Türkçe"
            >
              TR
            </button>
            <span className={styles.langDivider}>|</span>
            <button
              className={`${styles.langBtn} ${currentLang === "en" ? styles.langBtnActive : ""}`}
              onClick={() => changeLanguage("en")}
              aria-label="English"
            >
              EN
            </button>
          </div>

          <MagneticButton strength={0.25}>
            <button
              className={styles.btnGhost}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              {t("navbar.signIn")}
            </button>
          </MagneticButton>
          <MagneticButton strength={0.3}>
            <Link href="/urun-sec" className={`${styles.btnSolid} ${styles.neonBorder}`}>
              {t("navbar.getStarted")}
            </Link>
          </MagneticButton>
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={t("navbar.menuLabel")}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ""}`}>
        <Link href="/robotlar" onClick={() => setMobileOpen(false)}>
          {t("navbar.ourRobots")}
        </Link>
        <Link
          href="/urun-sec"
          onClick={() => setMobileOpen(false)}
          style={{ color: "var(--accent-primary)", fontWeight: 600 }}
        >
          {t("navbar.findProduct")}
        </Link>
        <Link href="/surec" onClick={() => setMobileOpen(false)}>
          {t("navbar.howItWorks")}
        </Link>
        <Link href="/iletisim" onClick={() => setMobileOpen(false)}>
          {t("navbar.contact")}
        </Link>
        <Link 
          href="/kurulum" 
          onClick={() => setMobileOpen(false)}
          style={{ color: "var(--accent-primary)", fontWeight: 700 }}
        >
          {t("navbar.setup")}
        </Link>

        {/* Mobile Language Toggle */}
        <div className={styles.mobileLangToggle}>
          <button
            className={`${styles.langBtn} ${currentLang === "tr" ? styles.langBtnActive : ""}`}
            onClick={() => {
              changeLanguage("tr");
              setMobileOpen(false);
            }}
          >
            TR
          </button>
          <span className={styles.langDivider}>|</span>
          <button
            className={`${styles.langBtn} ${currentLang === "en" ? styles.langBtnActive : ""}`}
            onClick={() => {
              changeLanguage("en");
              setMobileOpen(false);
            }}
          >
            EN
          </button>
        </div>

        <div className={styles.mobileActions}>
          <button
            className={styles.btnGhost}
            style={{ flex: 1, textAlign: "center" }}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            {t("navbar.signIn")}
          </button>
          <Link
            href="/urun-sec"
            className={styles.btnSolid}
            style={{ flex: 1, textAlign: "center" }}
            onClick={() => setMobileOpen(false)}
          >
            {t("navbar.getStarted")}
          </Link>
        </div>
      </div>
    </>
  );
}
