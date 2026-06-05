"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { BarChart2, Clock, Calendar, Database, FileJson, RefreshCw, HardDrive, CheckCircle2, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import styles from "./veri-setleri.module.css";

// ── Mock Data ─────────────────────────────────────────────────
export interface DataPackage {
  id: string;
  titleTR: string;
  titleEN: string;
  descriptionTR: string;
  descriptionEN: string;
  coverage: string;
  timeframe: string;
  dateRange: string;
  format: string;
  updateFrequency: string;
  estimatedSize: string;
  featured?: boolean;
  featuresTR: string[];
  featuresEN: string[];
  useCasesTR: { title: string; desc: string }[];
  useCasesEN: { title: string; desc: string }[];
  techSpecsTR: { key: string; value: string }[];
  techSpecsEN: { key: string; value: string }[];
}

export const DATA_PACKAGES: DataPackage[] = [
  {
    id: "bist-1min",
    titleTR: "BIST Tam Liste — 1 Dakikalık",
    titleEN: "BIST Full List — 1-Minute",
    descriptionTR: "BIST'teki tüm 577 hissenin 2015 Temmuz'dan günümüze yüksek çözünürlüklü 1 dakikalık OHLCV verisi.",
    descriptionEN: "High-resolution 1-minute OHLCV data for all 577 BIST stocks from July 2015 to present.",
    coverage: "BIST TÜM — 577 Hisse",
    timeframe: "1 Dakika",
    dateRange: "Tem 2015 – Günümüz",
    format: "CSV / Parquet",
    updateFrequency: "Günlük",
    estimatedSize: "~120 GB",
    featured: true,
    featuresTR: [
      "577 hissenin tamamında eksiksiz veri",
      "Açılış, Kapanış, En Yüksek, En Düşük, Hacim (OHLCV)",
      "Şirket birleşme/bölünme ve temettü düzeltmeleri",
      "Işlem seans bilgisi ve devre kesici kayıtları",
      "Özel formata dönüştürme desteği",
    ],
    featuresEN: [
      "Complete data coverage for all 577 stocks",
      "Open, High, Low, Close, Volume (OHLCV)",
      "Adjusted for corporate actions (mergers, splits, dividends)",
      "Trading session info and circuit breaker records",
      "Custom format conversion support",
    ],
    useCasesTR: [
      { title: "Backtest Modelleme", desc: "Stratejinizi 10 yıllık 1 dakikalık granülaritede test edin." },
      { title: "Yapay Zeka Eğitimi", desc: "Derin öğrenme modelleriniz için yüksek frekanslı etiketli veri." },
      { title: "Piyasa Analizi", desc: "Seans içi volatilite ve likidite örüntülerini keşfedin." },
    ],
    useCasesEN: [
      { title: "Backtest Modeling", desc: "Test your strategy with 10 years of 1-minute granularity." },
      { title: "AI Training", desc: "High-frequency labeled data for deep learning models." },
      { title: "Market Analysis", desc: "Explore intraday volatility and liquidity patterns." },
    ],
    techSpecsTR: [
      { key: "Veri Kaynağı", value: "BIST Resmi Feed" },
      { key: "Zaman Dilimi", value: "Europe/Istanbul (UTC+3)" },
      { key: "Aralık", value: "1 Dakika (OHLCV)" },
      { key: "Düzeltme", value: "Bölünme & Temettü" },
      { key: "Format", value: "CSV, Parquet, JSON" },
      { key: "Sıkıştırma", value: "ZIP / GZIP" },
      { key: "Tahmini Boyut", value: "~120 GB (ham)" },
    ],
    techSpecsEN: [
      { key: "Data Source", value: "BIST Official Feed" },
      { key: "Timezone", value: "Europe/Istanbul (UTC+3)" },
      { key: "Interval", value: "1 Minute (OHLCV)" },
      { key: "Adjustment", value: "Split & Dividend Adjusted" },
      { key: "Format", value: "CSV, Parquet, JSON" },
      { key: "Compression", value: "ZIP / GZIP" },
      { key: "Estimated Size", value: "~120 GB (raw)" },
    ],
  },
  {
    id: "bist-daily",
    titleTR: "BIST Tam Liste — Günlük",
    titleEN: "BIST Full List — Daily",
    descriptionTR: "2000 yılından bu yana tüm BIST hisselerinin günlük OHLCV, hacim ve piyasa değeri verisi.",
    descriptionEN: "Daily OHLCV, volume and market cap data for all BIST equities since year 2000.",
    coverage: "BIST TÜM — Tüm Semboller",
    timeframe: "Günlük (Daily)",
    dateRange: "Oca 2000 – Günümüz",
    format: "CSV / Excel / JSON",
    updateFrequency: "Günlük (Kapanış Sonrası)",
    estimatedSize: "~3.5 GB",
    featuresTR: [
      "25+ yıllık kesintisiz günlük veri",
      "Piyasa değeri ve serbest dolaşım oranı",
      "Endeks bileşimi geçmişi (BIST100, BIST50 vb.)",
      "Suspend ve şirket olayı işaretleri",
      "Excel'e hazır format seçeneği",
    ],
    featuresEN: [
      "25+ years of continuous daily data",
      "Market cap and free float rate",
      "Index constituent history (BIST100, BIST50, etc.)",
      "Suspension and corporate event flags",
      "Excel-ready format option",
    ],
    useCasesTR: [
      { title: "Uzun Dönem Strateji Araştırması", desc: "Yıllara yayılan trend ve momentum stratejilerini test edin." },
      { title: "Portföy Optimizasyonu", desc: "Risk modeliniz için uzun vadeli korelasyon matrisleri oluşturun." },
      { title: "Akademik Çalışmalar", desc: "Finans tezleri ve akademik yayınlar için güvenilir kaynak." },
    ],
    useCasesEN: [
      { title: "Long-Term Strategy Research", desc: "Test trend and momentum strategies spanning decades." },
      { title: "Portfolio Optimization", desc: "Build long-term correlation matrices for your risk model." },
      { title: "Academic Research", desc: "Reliable source for finance theses and academic publications." },
    ],
    techSpecsTR: [
      { key: "Veri Kaynağı", value: "BIST Resmi Feed" },
      { key: "Zaman Dilimi", value: "Kapanış Bazlı (Istanbul)" },
      { key: "Aralık", value: "Günlük (OHLCV + Hacim)" },
      { key: "Düzeltme", value: "Tam Kurumsal Aksiyon Düzeltmesi" },
      { key: "Format", value: "CSV, Excel, JSON" },
      { key: "Tahmini Boyut", value: "~3.5 GB" },
    ],
    techSpecsEN: [
      { key: "Data Source", value: "BIST Official Feed" },
      { key: "Timezone", value: "Close-based (Istanbul)" },
      { key: "Interval", value: "Daily (OHLCV + Volume)" },
      { key: "Adjustment", value: "Full Corporate Action Adjusted" },
      { key: "Format", value: "CSV, Excel, JSON" },
      { key: "Estimated Size", value: "~3.5 GB" },
    ],
  },
  {
    id: "bist-custom",
    titleTR: "Özel Sembol & Çözünürlük Paketi",
    titleEN: "Custom Symbol & Resolution Package",
    descriptionTR: "Kendi sembol listenz ve istediğiniz çözünürlük için (1dk / 5dk / 1s / 1g) özelleştirilmiş veri paketi.",
    descriptionEN: "Customized data package for your own symbol list and preferred resolution (1m / 5m / 1h / 1d).",
    coverage: "Kullanıcı Tanımlı Semboller",
    timeframe: "Esnek (1dk / 5dk / 1s / 1g)",
    dateRange: "Esnek — Talep Bazlı",
    format: "Talep Bazlı",
    updateFrequency: "Talep Bazlı",
    estimatedSize: "Talep Bazlı",
    featuresTR: [
      "Sadece ihtiyacınız olan sembolleri seçin",
      "1 dakikalık ila günlük arası tüm çözünürlükler",
      "Özel başlangıç ve bitiş tarihi belirleme",
      "Tercih ettiğiniz formatta teslimat",
      "Kurumsal müşteriler için özel fiyatlandırma",
    ],
    featuresEN: [
      "Select only the symbols you need",
      "All resolutions from 1-minute to daily",
      "Custom start and end date selection",
      "Delivery in your preferred format",
      "Custom pricing for institutional clients",
    ],
    useCasesTR: [
      { title: "Odaklı Araştırma", desc: "Yalnızca analiz ettiğiniz sektör veya endeks için veri alın." },
      { title: "Maliyet Optimizasyonu", desc: "Yüzlerce hisse yerine yalnızca ihtiyacınız olan veriyi satın alın." },
      { title: "Kurumsal Entegrasyon", desc: "Mevcut sistemlerinizle entegre edebilmek için özel format desteği." },
    ],
    useCasesEN: [
      { title: "Focused Research", desc: "Get data only for the sector or index you are analyzing." },
      { title: "Cost Optimization", desc: "Purchase only the data you need instead of hundreds of symbols." },
      { title: "Institutional Integration", desc: "Custom format support for integration with your existing systems." },
    ],
    techSpecsTR: [
      { key: "Veri Kaynağı", value: "BIST Resmi Feed" },
      { key: "Semboller", value: "Kullanıcı Tanımlı" },
      { key: "Aralık", value: "1dk / 5dk / 15dk / 30dk / 1s / 1g" },
      { key: "Düzeltme", value: "İsteğe Bağlı" },
      { key: "Format", value: "CSV, Parquet, JSON, Excel" },
      { key: "Teslimat", value: "FTP / S3 / Doğrudan İndirme" },
    ],
    techSpecsEN: [
      { key: "Data Source", value: "BIST Official Feed" },
      { key: "Symbols", value: "User-defined" },
      { key: "Interval", value: "1m / 5m / 15m / 30m / 1h / 1d" },
      { key: "Adjustment", value: "Optional" },
      { key: "Format", value: "CSV, Parquet, JSON, Excel" },
      { key: "Delivery", value: "FTP / S3 / Direct Download" },
    ],
  },
];

// ── Icon Map ───────────────────────────────────────────────────
const CARD_ICONS: Record<string, React.ReactNode> = {
  "bist-1min": <BarChart2 size={24} />,
  "bist-daily": <Calendar size={24} />,
  "bist-custom": <Database size={24} />,
};

// ── VeriSetleriPage ────────────────────────────────────────────
export default function VeriSetleriPage() {
  const { t, i18n } = useTranslation("common");
  const isTR = i18n.language?.startsWith("tr");

  return (
    <div className={styles.pageShell}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>
          <span className={styles.heroTagDot} />
          {t("dataSets.heroTag")}
        </div>
        <h1 className={styles.heroTitle}>{t("dataSets.heroTitle")}</h1>
        <p className={styles.heroSubtitle}>{t("dataSets.heroSubtitle")}</p>

        {/* Stats */}
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>577</div>
            <div className={styles.heroStatLabel}>{isTR ? "BIST Hissesi" : "BIST Equities"}</div>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>10+</div>
            <div className={styles.heroStatLabel}>{isTR ? "Yıl Veri" : "Years of Data"}</div>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>1dk</div>
            <div className={styles.heroStatLabel}>{isTR ? "Min. Granülarite" : "Min. Granularity"}</div>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>120+ GB</div>
            <div className={styles.heroStatLabel}>{isTR ? "Toplam Veri Hacmi" : "Total Data Volume"}</div>
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className={styles.packagesSection}>
        <h2 className={styles.sectionTitle}>
          {isTR ? "Mevcut Veri Paketleri" : "Available Data Packages"}
        </h2>
        <p className={styles.sectionSubtitle}>
          {isTR
            ? "Her paket; kapsam, çözünürlük ve tarih aralığı bilgileriyle listelenmiştir."
            : "Each package is listed with coverage, resolution, and date range details."}
        </p>

        <div className={styles.packageGrid}>
          {DATA_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`${styles.packageCard} ${pkg.featured ? styles.packageCardFeatured : ""}`}
            >
              {/* Icon */}
              <div className={styles.cardIconWrap}>
                {CARD_ICONS[pkg.id]}
              </div>

              {/* Badge */}
              <div className={styles.cardBadge}>
                <Database size={10} />
                {t("dataSets.packageBadge")}
              </div>

              {/* Title & Desc */}
              <div>
                <div className={styles.cardTitle}>
                  {isTR ? pkg.titleTR : pkg.titleEN}
                </div>
                <div className={styles.cardDesc} style={{ marginTop: "0.4rem" }}>
                  {isTR ? pkg.descriptionTR : pkg.descriptionEN}
                </div>
              </div>

              {/* Specs */}
              <div className={styles.cardSpecs}>
                <div className={styles.cardSpecRow}>
                  <span className={styles.cardSpecLabel}>{t("dataSets.coverageLabel")}</span>
                  <span className={styles.cardSpecValue}>{pkg.coverage}</span>
                </div>
                <div className={styles.cardSpecRow}>
                  <span className={styles.cardSpecLabel}>{t("dataSets.timeframeLabel")}</span>
                  <span className={styles.cardSpecValue}>{pkg.timeframe}</span>
                </div>
                <div className={styles.cardSpecRow}>
                  <span className={styles.cardSpecLabel}>{t("dataSets.dateRangeLabel")}</span>
                  <span className={styles.cardSpecValue}>{pkg.dateRange}</span>
                </div>
                <div className={styles.cardSpecRow}>
                  <span className={styles.cardSpecLabel}>{t("dataSets.formatLabel")}</span>
                  <span className={styles.cardSpecValue}>{pkg.format}</span>
                </div>
              </div>

              {/* Features */}
              <div className={styles.cardFeatures}>
                {(isTR ? pkg.featuresTR : pkg.featuresEN).slice(0, 3).map((f, i) => (
                  <div key={i} className={styles.cardFeature}>
                    <div className={styles.cardFeatureCheck}>
                      <CheckCircle2 size={10} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              {/* Pricing & CTA */}
              <div className={styles.cardPricing}>
                <div className={styles.cardPriceLabel}>{t("dataSets.priceOnRequest")}</div>
                <Link
                  href={`/veri-setleri/${pkg.id}`}
                  className={styles.cardCta}
                >
                  {pkg.id === "bist-custom" ? t("dataSets.quoteBtn") : t("dataSets.requestBtn")}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className={styles.trustStrip}>
        <div className={styles.trustInner}>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}><Shield size={16} /></div>
            {isTR ? "BIST Resmi Kaynaklı Veri" : "Official BIST Source Data"}
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}><Zap size={16} /></div>
            {isTR ? "Kurumsal Aksiyon Düzeltmeli" : "Corporate Action Adjusted"}
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}><Globe size={16} /></div>
            {isTR ? "Güvenli Teslim — FTP / S3" : "Secure Delivery — FTP / S3"}
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}><RefreshCw size={16} /></div>
            {isTR ? "Günlük Güncelleme" : "Daily Updates"}
          </div>
          <div className={styles.trustItem}>
            <div className={styles.trustIcon}><HardDrive size={16} /></div>
            {isTR ? "Parquet & CSV Desteği" : "Parquet & CSV Support"}
          </div>
        </div>
      </div>
    </div>
  );
}
