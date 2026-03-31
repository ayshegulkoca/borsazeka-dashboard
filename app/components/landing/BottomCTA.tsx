"use client";

import { signIn } from "next-auth/react";
import { Rocket, LogIn, Activity } from "lucide-react";
import Link from "next/link";
import styles from "./landing.module.css";

export default function BottomCTA() {
  return (
    <>
      {/* Bottom CTA Section */}
      <section id="cta" className={`${styles.section} ${styles.ctaSection}`}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>
            Hemen Robotları Çalıştır 🚀
          </h2>
          <p className={styles.ctaSubtitle}>
            14 günlük ücretsiz denemenizle bugün başlayın. Kredi kartı gerekmez, iptal her zaman mümkün.
          </p>
          <div className={styles.ctaButtonGroup}>
            <button
              className={styles.btnCtaPrimary}
              onClick={() => signIn("google", { callbackUrl: "/checkout" })}
            >
              <Rocket size={20} />
              Ücretsiz Başla
            </button>
            <button
              className={styles.btnCtaSecondary}
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <LogIn size={18} />
              Giriş Yap
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <Activity size={18} color="var(--accent-primary)" />
            BorsaZeka
          </div>
          <ul className={styles.footerLinks}>
            <li><a href="#">Gizlilik Politikası</a></li>
            <li><a href="#">Kullanım Koşulları</a></li>
            <li><a href="#">Destek</a></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
          </ul>
          <span className={styles.footerCopy}>© 2025 BorsaZeka. Tüm hakları saklıdır.</span>
        </div>
      </footer>
    </>
  );
}
