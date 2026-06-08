"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { BarChart2, Clock, Calendar, Database, FileJson, RefreshCw, HardDrive, CheckCircle2, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import styles from "./veri-setleri.module.css";

import { DATA_PACKAGES, type DataPackage } from "./dataPackages";

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
                  <span className={styles.cardSpecValue}>{isTR ? pkg.coverageTR : pkg.coverageEN}</span>
                </div>
                <div className={styles.cardSpecRow}>
                  <span className={styles.cardSpecLabel}>{t("dataSets.timeframeLabel")}</span>
                  <span className={styles.cardSpecValue}>{isTR ? pkg.timeframeTR : pkg.timeframeEN}</span>
                </div>
                <div className={styles.cardSpecRow}>
                  <span className={styles.cardSpecLabel}>{t("dataSets.dateRangeLabel")}</span>
                  <span className={styles.cardSpecValue}>{isTR ? pkg.dateRangeTR : pkg.dateRangeEN}</span>
                </div>
                <div className={styles.cardSpecRow}>
                  <span className={styles.cardSpecLabel}>{t("dataSets.formatLabel")}</span>
                  <span className={styles.cardSpecValue}>{isTR ? pkg.formatTR : pkg.formatEN}</span>
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
            {isTR ? "CSV Formatı Desteği" : "CSV Format Support"}
          </div>
        </div>
      </div>
    </div>
  );
}
