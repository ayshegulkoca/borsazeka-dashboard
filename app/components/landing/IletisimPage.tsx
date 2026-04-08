"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import s from "./iletisim.module.css";

export default function IletisimPage() {
  const { t } = useTranslation("common");

  return (
    <div className={s.container}>
      <section className={s.hero} aria-label="İletişim">
        {/* Subtle grid background */}
        <div className={s.grid} aria-hidden="true" />
        {/* Ambient glow blob */}
        <div className={s.glow} aria-hidden="true" />

        <div className={s.inner}>
          {/* ── Left: Text ── */}
          <div className={s.left}>
            <span className={s.tag}>{t("iletisim.tag")}</span>
            <h1 className={s.title}>{t("iletisim.title")}</h1>
            <p className={s.subtitle}>
              Sorularınız mı var? Uzman ekibimiz ve topluluğumuzla 7/24 iletişimde kalın.
            </p>

            {/* Quick-access links */}
            <div className={s.quickLinks}>
              <a href="https://www.x.com/DH_Altin" target="_blank" rel="noopener noreferrer" className={s.quickLink}>
                <span className={s.quickDot} style={{ background: "#1d9bf0" }} />
                Twitter / X — @DH_Altin
              </a>
              <a href="https://t.me/semiharslan" target="_blank" rel="noopener noreferrer" className={s.quickLink}>
                <span className={s.quickDot} style={{ background: "#26a5e4" }} />
                Telegram — @semiharslan
              </a>
              <a href="https://t.me/BorsaZekaCom" target="_blank" rel="noopener noreferrer" className={s.quickLink}>
                <span className={s.quickDot} style={{ background: "#00FF9D" }} />
                Kanal — @BorsaZekaCom
              </a>
            </div>
          </div>

          {/* ── Right: Abstract visual ── */}
          <div className={s.right} aria-hidden="true">
            {/* Outer ring */}
            <div className={s.sphere}>
              <div className={s.sphereRing1} />
              <div className={s.sphereRing2} />
              <div className={s.sphereRing3} />
              {/* Core */}
              <div className={s.sphereCore}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(0,255,157,0.85)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              {/* Orbiting dots */}
              <div className={s.orbit1}><div className={s.orbitDot} /></div>
              <div className={s.orbit2}><div className={s.orbitDot} style={{ background: "#26a5e4" }} /></div>
              <div className={s.orbit3}><div className={s.orbitDot} style={{ background: "#1d9bf0" }} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Office Section ── */}
      <section className={s.officeSection}>
        {/* Glow behind the map/address */}
        <div className={s.officeGlow} aria-hidden="true" />
        
        <div className={s.officeInner}>
          <div className={s.addressBlock}>
            <div className={s.pinIcon}>
              <MapPin size={32} />
            </div>
            <h2 className={s.officeTitle}>{t("iletisim.globalHeadquarters")}</h2>
            <address className={s.officeAddress}>
              Harju maakond, Tallinn, Lasnamäe linnaosa,<br />
              Lõõtsa tn 2a, 11415, ESTONIA
            </address>
          </div>

          <div className={s.mapFrame}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2030.569502934063!2d24.8028!3d59.4218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692eb49e2df95e9%3A0xe7a5c898c8c50ac6!2zTMO1w7RzYSAyYSwgMTE0MTUgVGFsbGlubiwgRXN0b255YQ!5e0!3m2!1sen!2str!4v1712570000000!5m2!1sen!2str"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={s.mapIframe}
              title="BorsaZeka Office Location"
            ></iframe>
          </div>

          <a 
            href="https://maps.google.com/?q=Lõõtsa+tn+2a,+11415+Tallinn,+Estonia" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={s.enlargeMap}
          >
            <ExternalLink size={16} />
            {t("iletisim.enlargeMap")}
          </a>
        </div>
      </section>
    </div>
  );
}
