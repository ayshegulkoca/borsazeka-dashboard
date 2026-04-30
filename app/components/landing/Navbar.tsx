"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { Activity, ChevronDown, LayoutDashboard, LogOut, Smartphone, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";
import MagneticButton from "./MagneticButton";

function AvatarDropdown() {
  const { t } = useTranslation("common");
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
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={16} />
            </div>
          )}
        </div>
        <span className={styles.avatarName}>
          {session?.user?.name?.split(" ")[0] ?? t("navbar.account")}
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
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={styles.avatarPlaceholder} style={{ width: 40, height: 40 }}>
                  <User size={20} />
                </div>
              )}
            </div>
            <div>
              <div className={styles.dropdownName}>{session?.user?.name ?? t("navbar.user")}</div>
              <div className={styles.dropdownEmail}>{session?.user?.email}</div>
            </div>
          </div>

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
            {t("navbar.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = !!session;
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

  if (!mounted) return null;


  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.navInner}>
        {/* Brand: Logo + Dashboard Button (if auth) */}
        <div className={styles.navBrandWrapper}>
          <Link href="/" className={styles.navLogo}>
            <span>BorsaZeka</span>
          </Link>

          {isAuthenticated && (
            <Link href="/dashboard" className={`${styles.btnDashboard} hidden md:inline-flex`}
              title="Dashboard"
              aria-label="Dashboard"
            >
              <LayoutDashboard size={18} className={styles.dashboardIcon} />
              Dashboard
            </Link>
          )}
        </div>

        {/* Center Links */}
        <ul className={styles.navLinks}>
          <li>
            <Link href="/robotlar" className={pathname === "/robotlar" ? styles.active : ""}>
              {t("navbar.ourRobots")}
            </Link>
          </li>
          <li>
            <Link href="/urun-sec" className={pathname === "/urun-sec" ? styles.active : ""}>
              {t("navbar.findProduct")}
            </Link>
          </li>
          <li>
            <Link href="/surec" className={pathname === "/surec" ? styles.active : ""}>
              {t("navbar.howItWorks")}
            </Link>
          </li>
          <li>
            <Link href="/forex" className={pathname === "/forex" ? styles.active : ""}>
              {t("navbar.openForex")}
            </Link>
          </li>
          <li>
            <Link href="/iletisim" className={pathname === "/iletisim" ? styles.active : ""}>
              {t("navbar.contact")}
            </Link>
          </li>
        </ul>

        {/* Right Actions */}
        <div className={styles.navActions}>
          {/* 📲 Uygulamayı İndir */}
          <button
            id="navbar-download-btn"
            className={styles.btnDownload}
            onClick={() => {
              const el = document.getElementById("download-section");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            aria-label="Uygulamayı İndir bölümüne git"
          >
            <Smartphone size={13} />
            {t("navbar.downloadApp")}
          </button>

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
          {isAuthenticated ? (
            <AvatarDropdown />
          ) : (
            <MagneticButton strength={0.25}>
              <button
                className={styles.btnGhost}
                onClick={() => signIn("google", { callbackUrl: "/dashboard", prompt: "select_account" })}

              >
                {t("navbar.signIn")}
              </button>
            </MagneticButton>
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
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ""}`}>
        {isAuthenticated && (
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={styles.btnDashboard}
            style={{ marginBottom: "0.5rem", justifyContent: "center" }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        )}
        <Link href="/robotlar" onClick={() => setMobileOpen(false)}>
          {t("navbar.ourRobots")}
        </Link>
        <Link href="/surec" onClick={() => setMobileOpen(false)}>
          {t("navbar.howItWorks")}
        </Link>
        <Link href="/forex" onClick={() => setMobileOpen(false)}>
          {t("navbar.openForex")}
        </Link>
        <Link href="/iletisim" onClick={() => setMobileOpen(false)}>
          {t("navbar.contact")}
        </Link>

        {/* 📲 Uygulamayı İndir — mobil için belirgin buton */}
        <button
          id="mobile-download-btn"
          className={styles.btnDownloadMobile}
          onClick={() => {
            setMobileOpen(false);
            setTimeout(() => {
              const el = document.getElementById("download-section");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 150);
          }}
          aria-label="Uygulamayı İndir bölümüne git"
        >
          <Smartphone size={18} />
          {t("navbar.downloadApp")}
        </button>


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
          {isAuthenticated ? (
            <>
              <button
                className={styles.btnGhost}
                style={{ flex: 1, textAlign: "center", color: "#f87171" }}
                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
              >
                {t("navbar.signOut")}
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.btnGhost}
                style={{ flex: 1, textAlign: "center" }}
                onClick={() => signIn("google", { callbackUrl: "/#basla", prompt: "select_account" })}
              >
                {t("navbar.signIn")}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
