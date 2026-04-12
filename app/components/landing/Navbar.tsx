"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Activity, ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";
import MagneticButton from "./MagneticButton";

// ── Avatar Dropdown (Navbar'da giriş yapılmış kurumsal görünüm) ──────────────
function AvatarDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Click-outside kapama
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={styles.avatarWrapper}>
      <button
        id="navbar-avatar-btn"
        className={styles.avatarBtn}
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className={styles.avatarRing}>
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? ""}
              width={32}
              height={32}
              className={styles.avatarImg}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={16} />
            </div>
          )}
        </div>
        <span className={styles.avatarName}>
          {session?.user?.name?.split(" ")[0] ?? "Hesap"}
        </span>
        <ChevronDown
          size={14}
          className={`${styles.avatarChevron} ${open ? styles.avatarChevronOpen : ""}`}
        />
      </button>

      {open && (
        <div className={styles.avatarDropdown} role="menu">
          {/* User info header */}
          <div className={styles.dropdownHeader}>
            <div className={styles.dropdownAvatar}>
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? ""}
                  width={40}
                  height={40}
                  className={styles.avatarImg}
                />
              ) : (
                <div className={styles.avatarPlaceholder} style={{ width: 40, height: 40 }}>
                  <User size={20} />
                </div>
              )}
            </div>
            <div>
              <div className={styles.dropdownName}>{session?.user?.name ?? "Kullanıcı"}</div>
              <div className={styles.dropdownEmail}>{session?.user?.email}</div>
            </div>
          </div>

          <div className={styles.dropdownDivider} />

          <Link
            href="/dashboard"
            className={styles.dropdownItem}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </Link>

          <div className={styles.dropdownDivider} />

          <button
            className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
          >
            <LogOut size={15} />
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation("common");
  const currentLang = i18n.language?.startsWith("tr") ? "tr" : "en";

  useEffect(() => {
    setMounted(true);
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
              className={`${styles.langBtn} ${mounted && currentLang === "tr" ? styles.langBtnActive : ""}`}
              onClick={() => changeLanguage("tr")}
              aria-label="Türkçe"
            >
              TR
            </button>
            <span className={styles.langDivider}>|</span>
            <button
              className={`${styles.langBtn} ${mounted && currentLang === "en" ? styles.langBtnActive : ""}`}
              onClick={() => changeLanguage("en")}
              aria-label="English"
            >
              EN
            </button>
          </div>

          {/* Auth: Avatar Dropdown if logged in, else Sign In button */}
          {mounted && isAuthenticated ? (
            <AvatarDropdown />
          ) : (
            <>
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
            </>
          )}
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
            className={`${styles.langBtn} ${mounted && currentLang === "tr" ? styles.langBtnActive : ""}`}
            onClick={() => { changeLanguage("tr"); setMobileOpen(false); }}
          >
            TR
          </button>
          <span className={styles.langDivider}>|</span>
          <button
            className={`${styles.langBtn} ${mounted && currentLang === "en" ? styles.langBtnActive : ""}`}
            onClick={() => { changeLanguage("en"); setMobileOpen(false); }}
          >
            EN
          </button>
        </div>

        <div className={styles.mobileActions}>
          {mounted && isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className={styles.btnGhost}
                style={{ flex: 1, textAlign: "center" }}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <button
                className={styles.btnGhost}
                style={{ flex: 1, textAlign: "center", color: "#f87171" }}
                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
