export interface DataPackage {
  id: string;
  titleTR: string;
  titleEN: string;
  descriptionTR: string;
  descriptionEN: string;
  coverageTR: string;
  coverageEN: string;
  timeframeTR: string;
  timeframeEN: string;
  dateRangeTR: string;
  dateRangeEN: string;
  formatTR: string;
  formatEN: string;
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
    descriptionTR: "BIST'teki tüm 577 hissenin Kasım 2012'den günümüze yüksek çözünürlüklü 1 dakikalık OHLCV verisi.",
    descriptionEN: "High-resolution 1-minute OHLCV data for all 577 BIST stocks from November 2012 to present.",
    coverageTR: "BIST TÜM — 577 Hisse",
    coverageEN: "BIST ALL — 577 Equities",
    timeframeTR: "1 Dakika",
    timeframeEN: "1 Minute",
    dateRangeTR: "Kas 2012 – Günümüz",
    dateRangeEN: "Nov 2012 – Present",
    formatTR: "CSV",
    formatEN: "CSV",
    updateFrequency: "Günlük",
    estimatedSize: "~150 GB",
    featured: true,
    featuresTR: [
      "577 hissenin tamamında eksiksiz veri",
      "Açılış, Kapanış, En Yüksek, En Düşük, Hacim (OHLCV)",
      "Şirket birleşme/bölünme ve temettü düzeltmeleri",
      "İşlem seans bilgisi ve devre kesici kayıtları",
      "Kolay entegre edilebilir veri yapısı",
    ],
    featuresEN: [
      "Complete data coverage for all 577 stocks",
      "Open, High, Low, Close, Volume (OHLCV)",
      "Adjusted for corporate actions (mergers, splits, dividends)",
      "Trading session info and circuit breaker records",
      "Easy-to-integrate data structure",
    ],
    useCasesTR: [
      { title: "Backtest Modelleme", desc: "Stratejinizi 13 yıllık 1 dakikalık granülaritede test edin." },
      { title: "Yapay Zeka Eğitimi", desc: "Derin öğrenme modelleriniz için yüksek frekanslı etiketli veri." },
      { title: "Piyasa Analizi", desc: "Seans içi volatilite ve likidite örüntülerini keşfedin." },
    ],
    useCasesEN: [
      { title: "Backtest Modeling", desc: "Test your strategy with 13 years of 1-minute granularity." },
      { title: "AI Training", desc: "High-frequency labeled data for deep learning models." },
      { title: "Market Analysis", desc: "Explore intraday volatility and liquidity patterns." },
    ],
    techSpecsTR: [
      { key: "Veri Kaynağı", value: "BIST Resmi Feed" },
      { key: "Zaman Dilimi", value: "Europe/Istanbul (UTC+3)" },
      { key: "Aralık", value: "1 Dakika (OHLCV)" },
      { key: "Düzeltme", value: "Bölünme & Temettü" },
      { key: "Format", value: "CSV" },
      { key: "Sıkıştırma", value: "ZIP / GZIP" },
      { key: "Tahmini Boyut", value: "~150 GB (ham)" },
    ],
    techSpecsEN: [
      { key: "Data Source", value: "BIST Official Feed" },
      { key: "Timezone", value: "Europe/Istanbul (UTC+3)" },
      { key: "Interval", value: "1 Minute (OHLCV)" },
      { key: "Adjustment", value: "Split & Dividend Adjusted" },
      { key: "Format", value: "CSV" },
      { key: "Compression", value: "ZIP / GZIP" },
      { key: "Estimated Size", value: "~150 GB (raw)" },
    ],
  },
  {
    id: "bist-daily",
    titleTR: "BIST Tam Liste — Günlük",
    titleEN: "BIST Full List — Daily",
    descriptionTR: "Ağustos 1987'den bu yana tüm BIST hisselerinin günlük OHLCV, hacim ve piyasa değeri verisi.",
    descriptionEN: "Daily OHLCV, volume and market cap data for all BIST equities since August 1987.",
    coverageTR: "BIST TÜM — Tüm Semboller",
    coverageEN: "BIST ALL — All Symbols",
    timeframeTR: "Günlük",
    timeframeEN: "Daily",
    dateRangeTR: "Ağu 1987 – Günümüz",
    dateRangeEN: "Aug 1987 – Present",
    formatTR: "CSV",
    formatEN: "CSV",
    updateFrequency: "Günlük (Kapanış Sonrası)",
    estimatedSize: "~5 GB",
    featuresTR: [
      "35+ yıllık kesintisiz günlük veri",
      "Piyasa değeri ve serbest dolaşım oranı",
      "Endeks bileşimi geçmişi (BIST100, BIST50 vb.)",
      "Suspend ve şirket olayı işaretleri",
      "Standart CSV dosya formatı",
    ],
    featuresEN: [
      "35+ years of continuous daily data",
      "Market cap and free float rate",
      "Index constituent history (BIST100, BIST50, etc.)",
      "Suspension and corporate event flags",
      "Standard CSV file format",
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
      { key: "Format", value: "CSV" },
      { key: "Tahmini Boyut", value: "~5 GB" },
    ],
    techSpecsEN: [
      { key: "Data Source", value: "BIST Official Feed" },
      { key: "Timezone", value: "Close-based (Istanbul)" },
      { key: "Interval", value: "Daily (OHLCV + Volume)" },
      { key: "Adjustment", value: "Full Corporate Action Adjusted" },
      { key: "Format", value: "CSV" },
      { key: "Estimated Size", value: "~5 GB" },
    ],
  },
  {
    id: "bist-custom",
    titleTR: "Özel Sembol & Çözünürlük Paketi",
    titleEN: "Custom Symbol & Resolution Package",
    descriptionTR: "Kendi sembol listeniz ve istediğiniz çözünürlük için (1dk / 5dk / 1s / 1g) özelleştirilmiş veri paketi.",
    descriptionEN: "Customized data package for your own symbol list and preferred resolution (1m / 5m / 1h / 1d).",
    coverageTR: "Kullanıcı Tanımlı Semboller",
    coverageEN: "User-defined Symbols",
    timeframeTR: "Esnek (1dk / 5dk / 1s / 1g)",
    timeframeEN: "Flexible (1m / 5m / 1h / 1d)",
    dateRangeTR: "Esnek — Talep Bazlı",
    dateRangeEN: "Flexible — On Demand",
    formatTR: "CSV",
    formatEN: "CSV",
    updateFrequency: "Talep Bazlı",
    estimatedSize: "Talep Bazlı",
    featuresTR: [
      "Sadece ihtiyacınız olan sembolleri seçin",
      "1 dakikalık ila günlük arası tüm çözünürlükler",
      "Özel başlangıç ve bitiş tarihi belirleme",
      "CSV formatında hızlı teslimat",
      "Kurumsal müşteriler için özel fiyatlandırma",
    ],
    featuresEN: [
      "Select only the symbols you need",
      "All resolutions from 1-minute to daily",
      "Custom start and end date selection",
      "Fast delivery in CSV format",
      "Custom pricing for institutional clients",
    ],
    useCasesTR: [
      { title: "Odaklı Araştırma", desc: "Yalnızca analiz ettiğiniz sektör veya endeks için veri alın." },
      { title: "Maliyet Optimizasyonu", desc: "Yüzlerce hisse yerine yalnızca ihtiyacınız olan veriyi satın alın." },
      { title: "Kurumsal Entegrasyon", desc: "Mevcut sistemlerinizle entegre edebilmek için standart format desteği." },
    ],
    useCasesEN: [
      { title: "Focused Research", desc: "Get data only for the sector or index you are analyzing." },
      { title: "Cost Optimization", desc: "Purchase only the data you need instead of hundreds of symbols." },
      { title: "Institutional Integration", desc: "Standard format support for integration with your existing systems." },
    ],
    techSpecsTR: [
      { key: "Veri Kaynağı", value: "BIST Resmi Feed" },
      { key: "Semboller", value: "Kullanıcı Tanımlı" },
      { key: "Aralık", value: "1dk / 5dk / 15dk / 30dk / 1s / 1g" },
      { key: "Düzeltme", value: "İsteğe Bağlı" },
      { key: "Format", value: "CSV" },
      { key: "Teslimat", value: "FTP / S3 / Doğrudan İndirme" },
    ],
    techSpecsEN: [
      { key: "Data Source", value: "BIST Official Feed" },
      { key: "Symbols", value: "User-defined" },
      { key: "Interval", value: "1m / 5m / 15m / 30m / 1h / 1d" },
      { key: "Adjustment", value: "Optional" },
      { key: "Format", value: "CSV" },
      { key: "Delivery", value: "FTP / S3 / Direct Download" },
    ],
  },
];
