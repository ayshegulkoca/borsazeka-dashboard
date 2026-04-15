"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Activity, Home, Bot, Server, LogOut, Bell, Settings, Crown, Zap, Star, Wallet } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import styles from "./layout.module.css";

interface Props {
  children: React.ReactNode;
  userName: string;
  userEmail?: string;
  userImage?: string;
  planLabel: string;
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

export default function DashboardShell({ children, userName, userEmail, userImage, planLabel }: Props) {
  const pathname = usePathname();

  const navItems = [
    { label: "Ana Sayfa", href: "/dashboard", icon: Home },
    { label: "Robot Vitrini", href: "/dashboard/robots", icon: Bot },
    { label: "Hesaplarım", href: "/dashboard/accounts", icon: Wallet },
    { label: "Sunucular", href: "/dashboard/servers", icon: Server },
    { label: "Ayarlar", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <Activity color="var(--accent-primary)" size={24} />
          </div>
          <span className={styles.title}>BorsaZeka</span>
        </Link>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          <div className={styles.navDivider} style={{ margin: "1rem 0", borderTop: "1px solid rgba(255,255,255,0.05)" }} />
          
          <Link href="/" className={styles.navLink} style={{ color: "var(--accent-primary)" }}>
            <Activity size={20} />
            <span>Siteye Geri Dön</span>
          </Link>
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
            {userEmail && <span className={styles.userEmail} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{userEmail}</span>}
            {planLabel && <PlanBadge planLabel={planLabel} />}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
            aria-label="Çıkış yap"
          >
            <LogOut size={18} />
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
            <button className={styles.iconBtn} aria-label="Bildirimler">
              <Bell size={20} />
            </button>
            <Link href="/dashboard/settings" className={styles.iconBtn} aria-label="Ayarlar">
              <Settings size={20} />
            </Link>
          </div>
        </header>

        <div className={styles.contentBody}>{children}</div>
      </main>
    </div>
  );
}
