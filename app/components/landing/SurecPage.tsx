"use client";

import Link from "next/link";
import { Activity, Users, Cpu, ShieldCheck, TrendingUp, Clock, ChevronRight, ArrowLeft, CheckCircle2, Server, Bot, BarChart2, Lock, Coins } from "lucide-react";
import styles from "./surec.module.css";

const STEPS = [
  {
    icon: Users,
    number: "01",
    title: "Başvuru & İletişim",
    desc: "Twitter, Telegram veya web sitemiz üzerinden bize ulaşırsınız. Ön bilgileri paylaşırsınız.",
    color: "#10b981",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Mülakat & Uygunluk",
    desc: "Telegram üzerinden mesajlaşma ya da sesli görüşme ile uygunluk tespiti yapılır. Bütçe aralığı ve beklentiler değerlendirilir.",
    color: "#34d399",
  },
  {
    icon: Cpu,
    number: "03",
    title: "Robot Seçimi & Şartlar",
    desc: "Profilinize uygun robot belirlenir (DarkRoom / TradeMate / Highway). Kullanım şartları size iletilir.",
    color: "#6ee7b7",
  },
  {
    icon: Activity,
    number: "04",
    title: "Hesap Açılımı",
    desc: "Yönlendirdiğimiz aracı kurumdan indirimli hesap açılır. Komisyon %0.007, iDeal lisansları ve kredi ayarları yapılır.",
    color: "#10b981",
  },
  {
    icon: Server,
    number: "05",
    title: "Sunucu Kiralama & Kurulum",
    desc: "borsazeka.com'dan sunucu kiralanır. Tek seferlik 50 € kurulum ücreti alınır. Sunucu ve robot kurulumunu biz gerçekleştiririz.",
    color: "#34d399",
  },
  {
    icon: TrendingUp,
    number: "06",
    title: "Robot Aktif & Takip",
    desc: "Robot çalıştırılır. Her gün 09:00 ve 12:00'da raporlama yapılır. Kar-zarar takibinizi aracı kurum uygulamasından anlık görürsünüz.",
    color: "#6ee7b7",
  },
];

const ROBOTS = [
  {
    name: "DarkRoom",
    maxUsers: 40,
    budget: "100.000 ₺ – 2.000.000 ₺",
    profit: "%50 kâr paylaşımı",
    setup: "50 € tek seferlik",
    server: "30–80 €/ay",
    highlights: [
      "En fazla 40 müşteri kapasitesi",
      "Robot yönetimi tamamen bize ait",
      "Aracı kurumdan indirimli hesap",
      "iDeal programı entegrasyonu",
      "Günlük kar takibi & raporlama",
      "Manuel müdahale yasak",
    ],
    badge: "Popüler",
    badgeColor: "#10b981",
    gradient: "linear-gradient(135deg, #0e1b15 0%, #072b1c 100%)",
    border: "rgba(16,185,129,0.35)",
  },
  {
    name: "TradeMate",
    maxUsers: 50,
    budget: "250.000 ₺ – 10.000.000 ₺",
    profit: "%50 kâr paylaşımı",
    setup: "50 € tek seferlik",
    server: "30–80 €/ay",
    highlights: [
      "En fazla 50 müşteri kapasitesi",
      "Uzman ekip tarafından yönetilir",
      "Yüksek bütçe kapasitesi",
      "iDeal programı entegrasyonu",
      "Otomatik aylık raporlama",
      "Anlık hesap takibi",
    ],
    badge: "Yüksek Kapasite",
    badgeColor: "#3b82f6",
    gradient: "linear-gradient(135deg, #0f172a 0%, #0e1b35 100%)",
    border: "rgba(59,130,246,0.3)",
  },
  {
    name: "Highway",
    maxUsers: 30,
    budget: "250.000 ₺ – 10.000.000 ₺",
    profit: "%50 kâr paylaşımı",
    setup: "50 € tek seferlik",
    server: "30–80 €/ay",
    highlights: [
      "En fazla 30 müşteri — eksklusif",
      "Uzman ekip yönetimi",
      "Seçkin portföy stratejisi",
      "iDeal programı entegrasyonu",
      "Priö portföy yönetimi",
      "Hız odaklı algoritma",
    ],
    badge: "Eksklusif",
    badgeColor: "#f59e0b",
    gradient: "linear-gradient(135deg, #1c130a 0%, #231a06 100%)",
    border: "rgba(245,158,11,0.3)",
  },
];

export default function SurecPage() {
  return (
    <div className={styles.page}>
      {/* ── NAV BACK ── */}
      <nav className={styles.topNav}>
        <div className={styles.topNavInner}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            Ana Sayfa
          </Link>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <Activity size={16} color="#022c22" strokeWidth={2.5} />
            </div>
            BorsaZeka
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>
            Nasıl <span className={styles.accent}>Çalışır?</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Başvurudan robotun aktif edilmesine kadar şeffaf ve adım adım bir süreç.
            Algoritmik ticaretin gücünü, sizin adınıza yönetiyoruz.
          </p>
        </div>
      </section>

      {/* ── MİSYON ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionText}>
              <span className={styles.sectionTag}>Misyonumuz</span>
              <h2 className={styles.sectionTitle}>Algoritmik Ticaretin<br />Robotik Yönetimi</h2>
              <p className={styles.sectionDesc}>
                BorsaZeka olarak amacımız, borsanın karmaşıklığını sizden uzaklaştırmak ve
                algoritmik trade robotlarının gücünü herkesin erişebileceği bir formata taşımaktır.
                Siz günlük hayatınıza devam ederken, robotlarımız piyasayı 7/24 takip eder ve
                en uygun anlarda pozisyon alır.
              </p>
              <p className={styles.sectionDesc} style={{ marginTop: "1rem" }}>
                Tüm işlemler şeffaf şekilde yürütülür; her gün saat <strong>09:00</strong> ve{" "}
                <strong>12:00'da</strong> Telegram ve Twitter üzerinden sonuçlar paylaşılır.
                Hesabınızı aracı kurum uygulamasından anlık olarak takip edebilirsiniz.
              </p>
            </div>
            <div className={styles.missionCards}>
              {[
                { Icon: Bot,      title: "Tamamen Otomatik",   desc: "Robot kendi kararlarını verir, manuel müdahale gerekmez." },
                { Icon: BarChart2, title: "Şeffaf Raporlama",   desc: "Her gün iki kez Telegram ve Twitter'da sonuçlar paylaşılır." },
                { Icon: Lock,     title: "Güvenli Yapı",        desc: "Aracı kurum hesabınız tamamen size aittir, paranıza her an erişebilirsiniz." },
                { Icon: Coins,    title: "%50 Kâr Paylaşımı",  desc: "Yalnızca kâr ettiğinizde biz de kazanırız. Zararda paylaşım yok." },
              ].map((c) => (
                <div key={c.title} className={styles.missionCard}>
                  <div className={styles.missionCardIconWrap}>
                    <c.Icon size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <div className={styles.missionCardTitle}>{c.title}</div>
                    <div className={styles.missionCardDesc}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROBOTLAR ── */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Robotlar & Şartlar</span>
            <h2 className={styles.sectionTitle}>Trading Robotlarımız</h2>
            <p className={styles.sectionSubtitle}>
              Her bütçe ve profil için tasarlanmış algoritmik robotlar.
              Tüm robotlarda yönetim ekibimize aittir.
            </p>
          </div>
          <div className={styles.robotGrid}>
            {ROBOTS.map((r) => (
              <div
                key={r.name}
                className={styles.robotCard}
                style={{ background: r.gradient, borderColor: r.border }}
              >
                <div className={styles.robotCardTop}>
                  <span className={styles.robotName}>{r.name}</span>
                  <span className={styles.robotBadge} style={{ background: `${r.badgeColor}22`, color: r.badgeColor, borderColor: `${r.badgeColor}44` }}>
                    {r.badge}
                  </span>
                </div>

                <div className={styles.robotStats}>
                  <div className={styles.robotStat}>
                    <span className={styles.robotStatLabel}>Max. Kullanıcı</span>
                    <span className={styles.robotStatValue}>{r.maxUsers} kişi</span>
                  </div>
                  <div className={styles.robotStat}>
                    <span className={styles.robotStatLabel}>Bütçe Aralığı</span>
                    <span className={styles.robotStatValue}>{r.budget}</span>
                  </div>
                  <div className={styles.robotStat}>
                    <span className={styles.robotStatLabel}>Kâr Payı</span>
                    <span className={styles.robotStatValue}>{r.profit}</span>
                  </div>
                  <div className={styles.robotStat}>
                    <span className={styles.robotStatLabel}>Kurulum</span>
                    <span className={styles.robotStatValue}>{r.setup}</span>
                  </div>
                </div>

                <div className={styles.robotDivider} />

                <ul className={styles.robotFeatureList}>
                  {r.highlights.map((h) => (
                    <li key={h} className={styles.robotFeature}>
                      <CheckCircle2 size={14} color={r.badgeColor} style={{ flexShrink: 0, marginTop: 2 }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Ortak şartlar */}
          <div className={styles.sharedTerms}>
            <h3 className={styles.sharedTermsTitle}>Tüm Robotlarda Geçerli Ortak Şartlar</h3>
            <div className={styles.sharedTermsGrid}>
              {[
                "Aracı kurum komisyonu yüzbinde 7",
                "Sunucu kiralama zorunlu (borsazeka.com)",
                "1M ₺ altı → 30 €/ay sunucu · 1M ₺ üstü → 80 €/ay sunucu",
                "Aylık kâr paylaşımı — zarardan pay alınmaz",
                "Para çekme 2 gün önceden bildirilmeli",
                "Şifre değişimi öncesi robot yöneticisine haber verilmeli",
                "Manuel alım-satım kesinlikle yasak",
                "Hesap bilgileri üçüncü şahıslarla paylaşılmaz",
              ].map((t) => (
                <div key={t} className={styles.sharedTermItem}>
                  <ChevronRight size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ADIM ADIM SÜREÇ ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>İşleyiş Süreci</span>
            <h2 className={styles.sectionTitle}>Adım Adım Yolculuğunuz</h2>
            <p className={styles.sectionSubtitle}>
              İlk iletişimden robotun aktif edilmesine kadar olan süreç tamamen şeffaf ve yönetilir.
            </p>
          </div>

          <div className={styles.stepperWrap}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className={styles.stepItem}>
                  <div className={styles.stepLeft}>
                    <div className={styles.stepCircle} style={{ borderColor: step.color, boxShadow: `0 0 20px ${step.color}33` }}>
                      <Icon size={22} color={step.color} />
                    </div>
                    {i < STEPS.length - 1 && <div className={styles.stepLine} />}
                  </div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepNumber} style={{ color: step.color }}>{step.number}</div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ŞEFFAFLIK ── */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.container}>
          <div className={styles.transparencyWrap}>
            <div className={styles.transparencyLeft}>
              <span className={styles.sectionTag}>Şeffaflık</span>
              <h2 className={styles.sectionTitle}>Günlük Raporlama</h2>
              <p className={styles.sectionDesc}>
                Her gün saat <strong className={styles.accentText}>09:00</strong> ve{" "}
                <strong className={styles.accentText}>12:00</strong>'da Telegram kanalımızda ve Twitter hesabımızda
                tüm aktif robotların günlük performans bilgileri paylaşılır. Hesabınızı aracı kurum
                mobil uygulamasından istediğiniz zaman anlık takip edebilirsiniz.
              </p>
              <div className={styles.reportingBadges}>
                <div className={styles.reportingBadge}>
                  <Clock size={18} color="#10b981" />
                  <span>Her gün 09:00</span>
                </div>
                <div className={styles.reportingBadge}>
                  <Clock size={18} color="#10b981" />
                  <span>Her gün 12:00</span>
                </div>
              </div>
            </div>
            <div className={styles.transparencyRight}>
              <div className={styles.mockReport}>
                <div className={styles.mockReportHeader}>
                  <span className={styles.mockReportTitle}>Günlük Rapor — T2 Overall</span>
                  <span className={styles.mockReportTime}>09:00</span>
                </div>
                {[
                  { account: "Müşteri #1", value: "+2.4%", positive: true },
                  { account: "Müşteri #2", value: "+1.7%", positive: true },
                  { account: "Müşteri #3", value: "+3.1%", positive: true },
                  { account: "Müşteri #4", value: "-0.3%", positive: false },
                  { account: "Müşteri #5", value: "+2.8%", positive: true },
                ].map((r) => (
                  <div key={r.account} className={styles.mockReportRow}>
                    <span className={styles.mockReportAccount}>{r.account}</span>
                    <span className={styles.mockReportVal} style={{ color: r.positive ? "#10b981" : "#f87171" }}>
                      {r.value}
                    </span>
                  </div>
                ))}
                <div className={styles.mockReportFooter}>
                  Telegram'da & Twitter'da paylaşılır
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
