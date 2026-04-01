"use client";

import { signIn } from "next-auth/react";
import { Rocket, LogIn } from "lucide-react";
import styles from "./landing.module.css";

export default function BottomCTA() {
  return (
    <section id="cta" className={`${styles.section} ${styles.ctaSection}`}>
      <div className={styles.container}>
        <h2 className={styles.ctaTitle}>
          Hemen Robotları Çalıştır
        </h2>
        <p className={styles.ctaSubtitle}>
          Başvuru sürecimiz hakkında bilgi almak veya hemen başlamak için aşağıdaki
          butonları kullanın. Sorularınız için Telegram üzerinden bize ulaşabilirsiniz.
        </p>
        <div className={styles.ctaButtonGroup}>
          <button
            className={styles.btnCtaPrimary}
            onClick={() => signIn("google", { callbackUrl: "/checkout" })}
          >
            <Rocket size={20} />
            Hemen Başla
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
  );
}
