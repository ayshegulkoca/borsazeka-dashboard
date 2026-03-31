"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { signIn } from "next-auth/react";
import styles from "./landing.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <li><a href="#features">Özellikler</a></li>
          <li><a href="#robots">Robotlar</a></li>
          <li><a href="#pricing">Fiyatlandırma</a></li>
          <li><a href="#cta">İletişim</a></li>
        </ul>

        {/* Right Actions */}
        <div className={styles.navActions}>
          <button
            className={styles.btnGhost}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Giriş Yap
          </button>
          <button
            className={styles.btnSolid}
            onClick={() => signIn("google", { callbackUrl: "/checkout" })}
          >
            Hemen Başla
          </button>
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menüyü aç"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ""}`}>
        <a href="#features" onClick={() => setMobileOpen(false)}>Özellikler</a>
        <a href="#robots" onClick={() => setMobileOpen(false)}>Robotlar</a>
        <a href="#pricing" onClick={() => setMobileOpen(false)}>Fiyatlandırma</a>
        <a href="#cta" onClick={() => setMobileOpen(false)}>İletişim</a>
        <div className={styles.mobileActions}>
          <button
            className={styles.btnGhost}
            style={{ flex: 1, textAlign: "center" }}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Giriş Yap
          </button>
          <button
            className={styles.btnSolid}
            style={{ flex: 1, textAlign: "center" }}
            onClick={() => signIn("google", { callbackUrl: "/checkout" })}
          >
            Hemen Başla
          </button>
        </div>
      </div>
    </>
  );
}
