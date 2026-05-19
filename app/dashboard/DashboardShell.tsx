"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Activity, Home, Bot, Server, LogOut, Bell, Settings, Crown, Zap, Star, Wallet, Receipt, ArrowLeft, User, CreditCard } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import styles from "./layout.module.css";

interface Props {
  children: React.ReactNode;
  userName: string;
  userEmail?: string;
  userImage?: string;
  planLabel: string;
  customerId?: string;
}

// Plan tipine göre rozet rengi ve ikonu
function PlanBadge({ planLabel }: { planLabel: string }) {
  const lower = planLabel.toLowerCase();

  let color = "var(--accent-primary)";
  let bg = "rgba(16,185,129,0.12)";
  let Icon = Star;

  if (lower.includes("classic") || lower.includes("enterprise")) {
    color = "#fbbf24";
    bg = "rgba(251,191,36,0.12)";
    Icon = Crown;
  } else if (lower.includes("fabrika")) {
    color = "#a78bfa";
    bg = "rgba(167,139,250,0.12)";
    Icon = Crown;
  } else if (lower.includes("highway")) {
    color = "#f472b6";
    bg = "rgba(244,114,182,0.12)";
    Icon = Zap;
  } else if (lower.includes("darkroom")) {
    color = "#60a5fa";
    bg = "rgba(96,165,250,0.12)";
    Icon = Zap;
  } else if (lower.includes("ücretsiz") || lower.includes("free")) {
    color = "var(--text-muted)";
    bg = "rgba(100,116,139,0.12)";
    Icon = Star;
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        fontSize: "0.72rem",
        fontWeight: 600,
        color,
        background: bg,
        padding: "0.2rem 0.55rem",
        borderRadius: 100,
      }}
    >
      <Icon size={11} />
      {planLabel}
    </span>
  );
}

// ── Language Toggle ────────────────────────────────────────────────────────────
function LangToggle() {
  const { i18n, t } = useTranslation("common");
  const currentLang = i18n.language?.startsWith("tr") ? "tr" : "en";

  const toggle = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className={styles.langToggleContainer} aria-label={t("dashboard.langToggle.label")}>
      {(["tr", "en"] as const).map((lang) => (
        <button
          key={lang}
          id={`dashboard-lang-${lang}`}
          onClick={() => toggle(lang)}
          className={`${styles.langBtn} ${currentLang === lang ? styles.langBtnActive : ""}`}
          aria-pressed={currentLang === lang}
        >
          {lang.toLocaleUpperCase('en-US')}
        </button>
      ))}
    </div>
  );
}

export default function DashboardShell({ children, userName, userEmail, userImage, planLabel, customerId }: Props) {
  const pathname = usePathname();
  const { t } = useTranslation("common");

  const navItems = [
    { label: t("dashboard.nav.home"),     href: "/dashboard",          icon: Home },
    { label: t("dashboard.nav.robots"),   href: "/dashboard/robots",   icon: Bot },
    { label: t("dashboard.nav.accounts"), href: "/dashboard/accounts", icon: Wallet },
    { label: t("dashboard.nav.servers"),  href: "/dashboard/servers",  icon: Server },
    { label: t("dashboard.settings.tabProfile"), href: "/dashboard/settings/profile", icon: User },
    { label: t("dashboard.settings.tabBilling"), href: "/dashboard/settings/billing", icon: CreditCard },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={`${styles.logoArea} flex items-center`}>
            <Image
              src="/images/logo.png"
              alt="BorsaZeka Logo"
              width={40}
              height={40}
              className="h-10 w-10 mr-3 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] object-contain"
            />
            <span className={styles.title}>BorsaZeka</span>
          </Link>

          <Link 
            href="/" 
            className={styles.backToSiteBtnSidebar} 
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            <span>{t("dashboard.nav.backToSite")}</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Kullanıcı Profili + Plan Rozeti */}
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {userImage ? (
              <Image src={userImage} alt={userName} width={40} height={40} />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(45deg, var(--accent-secondary), var(--accent-primary))",
                }}
              />
            )}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>
            {customerId && (
              <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', fontWeight: 500, marginBottom: '0.2rem' }}>
                ID: {customerId}
              </span>
            )}
            {userEmail && <span className={styles.userEmail} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{userEmail}</span>}
            {planLabel && <PlanBadge planLabel={planLabel} />}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ color: "#71717A", background: "none", border: "none", cursor: "pointer" }}
            aria-label={t("dashboard.settings.signOut")}
          >
            <LogOut size={16} strokeWidth={1.5} />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className={styles.mobileNav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileNavLink} ${isActive ? styles.mobileActiveLink : ""}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Ana İçerik */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>
            {navItems.find((i) => i.href === pathname)?.label || "Dashboard"}
          </h2>
          <div className={styles.headerActions}>
            {/* Dil Seçici (Sol tarafta) */}
            <LangToggle />
          </div>
        </header>

        <div className={styles.contentBody}>{children}</div>
      </main>
    </div>
  );
}
