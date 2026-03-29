"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Activity, Home, Bot, Server, LogOut, Bell, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import styles from "./layout.module.css";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Ana Sayfa", href: "/dashboard", icon: Home },
    { label: "Robot Vitrini", href: "/dashboard/robots", icon: Bot },
    { label: "Sunucular", href: "/dashboard/servers", icon: Server },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <Activity color="var(--accent-primary)" size={24} />
          </div>
          <span className={styles.title}>BorsaZeka</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {/* Mock Profile Image */}
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, var(--accent-secondary), var(--accent-primary))' }}></div>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Ayşegül Koca</span>
            <span className={styles.userRole}>Premium Plus</span>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{ color: "var(--text-muted)" }}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>
            {navItems.find(i => i.href === pathname)?.label || "Dashboard"}
          </h2>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn}>
              <Bell size={20} />
            </button>
            <button className={styles.iconBtn}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className={styles.contentBody}>
          {children}
        </div>
      </main>
    </div>
  );
}
