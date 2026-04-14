/**
 * BorsaZeka — Ürün & Fiyat Veri Katmanı
 * Tüm fiyatlar EUR cinsindendir.
 * Bu dosyayı düzenleyerek fiyatlandırma mantığını güncelleyebilirsiniz.
 */

export type Market = "BIST" | "CRYPTO" | "FOREX";
export type ManagementType = "PREMIUM" | "SELF_SERVICE";
export type BillingCycle = "monthly" | "annual";

export type RobotId =
  | "DARKROOM"
  | "HIGHWAY"
  | "TRADEMATE"
  | "FABRIKA"
  | "CLASSIC"
  | "DARKROOM_SELF"
  | "HIGHWAY_SELF"
  | "TRADEMATE_SELF"
  | "FABRIKA_SELF"
  | "KRIPTTOZEKA_PREMIUM"
  | "KRIPTTOZEKA"
  | "KRIPTTOZEKA_ASCENT"
  | "KRIPTTOZEKA_SELF"
  | "FOREXZEKA";

export type ServerTier = "30EUR" | "55EUR" | "60EUR" | "65EUR" | "95EUR" | "100EUR" | "200EUR" | "240EUR" | "320EUR" | "500EUR" | "600EUR" | "1000EUR" | "VARIABLE" | "INCLUDED";

export interface PricingResult {
  setupFeeEUR: number;
  serverCostEUR: number;
  serverCostDisplay: string;        // e.g. "40" or "40 + değişken"
  profitSharePercent: number;
  serverTier: ServerTier;
  totalMonthlyCostEUR: number;
  isComingSoon?: boolean;           // hizmet henüz sunulmamış
  stripeLink?: string;              // opsiyonel ödeme linki
  annualStripeLink?: string;        // yıllık ödeme linki (Kripto Self için)
  annualCostEUR?: number;           // yıllık toplam maliyet
  note?: string;                    // ek bilgi notu
}

export interface BudgetOption {
  label: string;
  min: number;
  max: number;
  value: number;          // hesaplama için temsili değer
  comingSoon?: boolean;   // sadece bu bütçe seçeneği pek yakında ise
}

// ─── Sunucu Paket Tanımları ──────────────────────────────────────────────────
export interface ServerPackage {
  id: string;
  name: string;
  priceEUR: number;
  specs: string[];        // Semih Bey onayı bekleniyor — şimdilik UI'da gösterilmiyor
  description: string;   // Tek satır açıklama (teknik detaylar yerine)
  stripeBaseUrl: string;
  highlight?: boolean;   // önerilen paket
}

export const SERVER_PACKAGES: ServerPackage[] = [
  {
    id: "power",
    name: "Power VPS",
    priceEUR: 30,
    description: "Yüksek performanslı işlemci ve güvenli altyapı.",
    specs: ["2 vCPU", "4 GB RAM", "50 GB SSD", "Günlük Yedekleme", "Temel Destek"],
    stripeBaseUrl: "https://buy.stripe.com/eVq4gzgPlakr8i25Jz8IU01",
  },
  {
    id: "professional",
    name: "Professional VPS",
    priceEUR: 55,
    description: "Kesintisiz çalışma süresi ve gelişmiş ağ altyapısı.",
    specs: ["4 vCPU", "8 GB RAM", "100 GB SSD", "Günlük Yedekleme", "Öncelikli Destek"],
    stripeBaseUrl: "https://buy.stripe.com/dRmdR99mT507aqa1tj8IU02",
    highlight: true,
  },
  {
    id: "expert",
    name: "Expert VPS",
    priceEUR: 95,
    description: "Düşük gecikme süresi ve optimize edilmiş işlem kapasitesi.",
    specs: ["8 vCPU", "16 GB RAM", "200 GB SSD", "Saatlik Yedekleme", "7/24 Destek"],
    stripeBaseUrl: "https://buy.stripe.com/9B69AT7eL64bfKu1tj8IU03",
  },
  {
    id: "elite",
    name: "Elite Dedicated Server",
    priceEUR: 240,
    description: "Adanmış sunucu kaynakları ve öncelikli teknik destek.",
    specs: ["16 vCPU", "64 GB RAM", "1 TB NVMe", "Anlık Yedekleme", "Dedicated Line", "VIP Destek"],
    stripeBaseUrl: "https://buy.stripe.com/4gM8wPeHddwDgOydc18IU04",
  },
  {
    id: "ultimate",
    name: "Ultimate Dedicated Server",
    priceEUR: 320,
    description: "Maksimum güç, tam izolasyon ve kurumsal seviye altyapı.",
    specs: ["32 vCPU", "128 GB RAM", "2 TB NVMe", "Anlık Yedekleme", "Dedicated Line", "24/7 VIP Destek", "SLA Garantisi"],
    stripeBaseUrl: "https://buy.stripe.com/cNi6oHdD964baqa6ND8IU05",
  },
];

// ─── BIST Premium: DarkRoom & Highway ────────────────────────────────────────
export const BIST_DH_TIERS: Array<{
  minTL: number; maxTL: number;
  serverCostEUR: number; profitSharePercent: number;
}> = [
  { minTL: 600_000,   maxTL: 1_000_000, serverCostEUR: 30, profitSharePercent: 50 },
  { minTL: 1_000_001, maxTL: 3_000_000, serverCostEUR: 55, profitSharePercent: 50 },
  { minTL: 3_000_001, maxTL: 5_000_000, serverCostEUR: 55, profitSharePercent: 45 },
];

// ─── BIST Premium: TradeMate ──────────────────────────────────────────────────
export const BIST_TM_TIERS: Array<{
  minTL: number; maxTL: number;
  serverCostEUR: number; profitSharePercent: number;
}> = [
  { minTL: 600_000,    maxTL: 1_000_000,   serverCostEUR: 30,  profitSharePercent: 50 },
  { minTL: 1_000_001,  maxTL: 3_000_000,   serverCostEUR: 55,  profitSharePercent: 50 },
  { minTL: 3_000_001,  maxTL: 5_000_000,   serverCostEUR: 55,  profitSharePercent: 45 },
  { minTL: 5_000_001,  maxTL: 10_000_000,  serverCostEUR: 95,  profitSharePercent: 45 },
  { minTL: 10_000_001, maxTL: 50_000_000,  serverCostEUR: 240, profitSharePercent: 40 },
  { minTL: 50_000_001, maxTL: 100_000_000, serverCostEUR: 320, profitSharePercent: 35 },
];

// ─── BIST Premium: Fabrika ────────────────────────────────────────────────────
export const BIST_FABRIKA_TIERS: Array<{
  minTL: number; maxTL: number;
  serverCostEUR: number; profitSharePercent: number;
}> = [
  { minTL: 5_000_001,  maxTL: 10_000_000,  serverCostEUR: 95,  profitSharePercent: 45 },
  { minTL: 10_000_001, maxTL: 50_000_000,  serverCostEUR: 240, profitSharePercent: 40 },
  { minTL: 50_000_001, maxTL: 100_000_000, serverCostEUR: 320, profitSharePercent: 35 },
];

// ─── BIST Self-Service (ortak paket) ─────────────────────────────────────────
export const BIST_SELF_TIERS: Array<{
  minTL: number; maxTL: number;
  serverCostEUR: number; note?: string;
}> = [
  { minTL: 0,          maxTL: 100_000,     serverCostEUR: 50,   note: "Ortak paket" },
  { minTL: 100_001,    maxTL: 300_000,     serverCostEUR: 100,  note: "Ortak paket" },
  { minTL: 300_001,    maxTL: 600_000,     serverCostEUR: 200,  note: "Ortak paket" },
  { minTL: 600_001,    maxTL: 3_000_000,   serverCostEUR: 500,  note: "Fabrika özel" },
  { minTL: 3_000_001,  maxTL: 5_000_000,   serverCostEUR: 1000, note: "Fabrika özel" },
];

// ─── ForexZeka Fiyatlandırma ──────────────────────────────────────────────────
export const FOREXZEKA_TIERS: Array<{
  minUSD: number; maxUSD: number;
  serverCostEUR: number; isVariable?: boolean; comingSoon?: boolean;
}> = [
  { minUSD: 500,   maxUSD: 999,    serverCostEUR: 40  },
  { minUSD: 1000,  maxUSD: 1499,   serverCostEUR: 50  },
  { minUSD: 1500,  maxUSD: 1999,   serverCostEUR: 60  },
  { minUSD: 2000,  maxUSD: 2499,   serverCostEUR: 70  },
  { minUSD: 2500,  maxUSD: 2999,   serverCostEUR: 80  },
  { minUSD: 3000,  maxUSD: 3499,   serverCostEUR: 90  },
  { minUSD: 3500,  maxUSD: 3999,   serverCostEUR: 100 },
  { minUSD: 4000,  maxUSD: 4499,   serverCostEUR: 110 },
  { minUSD: 4500,  maxUSD: 4999,   serverCostEUR: 120 },
  { minUSD: 5000,  maxUSD: 999999, serverCostEUR: 40,  isVariable: true },
];

// ─── KriptoZeka Ascent Self-Service Fiyatlandırma ────────────────────────────
export const KRIPTO_SELF_TIERS: Array<{
  minUSD: number; maxUSD: number;
  monthlyEUR: number; annualEUR: number;
}> = [
  { minUSD: 0,    maxUSD: 100,  monthlyEUR: 7,   annualEUR: 0   },   // free robot + 7€ mini sunucu
  { minUSD: 100,  maxUSD: 500,  monthlyEUR: 11,  annualEUR: 116 },
  { minUSD: 500,  maxUSD: 2500, monthlyEUR: 39,  annualEUR: 340 },
  { minUSD: 2500, maxUSD: 5000, monthlyEUR: 67,  annualEUR: 564 },
];

// ─── Stripe Ödeme Linkleri — BIST Premium (Sunucu Kademesine Göre) ────────────
// Power VPS 30€, Professional VPS 55€, Expert VPS 95€, Elite 240€, Ultimate 320€
export const STRIPE_LINKS: Record<number, string> = {
  30:  "https://buy.stripe.com/eVq4gzgPlakr8i25Jz8IU01",
  55:  "https://buy.stripe.com/dRmdR99mT507aqa1tj8IU02",
  95:  "https://buy.stripe.com/9B69AT7eL64bfKu1tj8IU03",
  240: "https://buy.stripe.com/4gM8wPeHddwDgOydc18IU04",
  320: "https://buy.stripe.com/cNi6oHdD964baqa6ND8IU05",
};

// ─── Stripe Ödeme Linkleri — BIST Self-Service (Bütçe Kademesine Göre) ───────
// 0-100k TL → 50€, 100k-300k TL → 100€, 300k-600k TL → 200€,
// 600k-3M TL → 500€ (Fabrika), 3M-5M TL → 1000€ (Fabrika)
export const STRIPE_SELF_LINKS: Record<number, string> = {
  50:   "https://buy.stripe.com/7sYbJ142z8cj0PA1tj8IU06",
  100:  "https://buy.stripe.com/6oU00j6aHdwD55Qfk98IU07",
  200:  "https://buy.stripe.com/8x23cvbv10JR2XI1tj8IU08",
  500:  "https://buy.stripe.com/bJe3cv0QnakrdCm6ND8IU09",
  1000: "https://buy.stripe.com/7sY3cv7eL3W3gOy0pf8IU0a",
};

// ─── Stripe Ödeme Linkleri — KriptoZeka Ascent Self-Service (Aylık) ──────────
// NOT: Tüm planlara sabit 7€/ay mini sunucu ücreti dahildir.
// $0-$100: free robot + 7€ mini sunucu = 7€/ay
// $100-$500: 4€ robot + 7€ mini sunucu = 11€/ay
// $500-$2500: 32€ robot + 7€ mini sunucu = 39€/ay
// $2500-$5000: 60€ robot + 7€ mini sunucu = 67€/ay
export const STRIPE_KRIPTO_SELF_MONTHLY: Record<number, string> = {
  7:  "https://buy.stripe.com/fZubJ1bv10JRdCm1tj8IU0n",   // $0–$100
  11: "https://buy.stripe.com/14AdR9cz5fEL8i2c7X8IU0p",   // $100–$500
  39: "https://buy.stripe.com/aFa14ncz578f69U8VL8IU0r",   // $500–$2500
  67: "https://buy.stripe.com/4gM4gz56D78f55Qgod8IU0t",   // $2500–$5000
};

// ─── Stripe Ödeme Linkleri — KriptoZeka Ascent Self-Service (Yıllık) ─────────
// NOT: Yıllık abonelerde robot ücreti için 4 ay bedava (8 ay × ücret), sunucu için 12 ay ücret alınır.
// $0-$100 için yıllık plan yok (sadece aylık 7€)
// $100-$500: 32€ robot (8ay) + 84€ mini sunucu (12ay) = 116€/yıl
// $500-$2500: 256€ robot (8ay) + 84€ mini sunucu (12ay) = 340€/yıl
// $2500-$5000: 480€ robot (8ay) + 84€ mini sunucu (12ay) = 564€/yıl
export const STRIPE_KRIPTO_SELF_ANNUAL: Record<number, string> = {
  116: "https://buy.stripe.com/bJe8wPdD9fEL7dYdc18IU0o",  // $100–$500
  340: "https://buy.stripe.com/6oU9AT0Qn0JR55Q6ND8IU0q",  // $500–$2500
  564: "https://buy.stripe.com/9B66oHdD92RZ1TE8VL8IU0s",  // $2500–$5000
};

// ─── Stripe Ödeme Linkleri — Forex Premium (Başlangıç Sermayesine Göre) ───────
// NOT: İlk 500$ bütçe için ücret alınmaz (temel bütçe 0€).
// Ardından her 500$ için +10€ eklenir. 5000$+ bütçede kâr paylaşımı (%40-%50) modeline geçilir.
export const STRIPE_FOREX_LINKS: Record<number, string> = {
  500:  "https://buy.stripe.com/aFadR9eHddwD8i27RH8IU0d",  // 500$ → 40€
  1000: "https://buy.stripe.com/aFa8wP8iPeAHaqa5Jz8IU0e",  // 1000$ → 50€
  1500: "https://buy.stripe.com/dRm6oHbv1bovdCm0pf8IU0f",  // 1500$ → 60€
  2000: "https://buy.stripe.com/cNidR9dD9bov7dYeg58IU0g",  // 2000$ → 70€
  2500: "https://buy.stripe.com/aFa4gzbv1eAH2XI1tj8IU0h",  // 2500$ → 80€
  3000: "https://buy.stripe.com/5kQ4gzaqXgIPcyi3Br8IU0i",  // 3000$ → 90€
  3500: "https://buy.stripe.com/28EaEX7eLakr69Udc18IU0j",  // 3500$ → 100€
  4000: "https://buy.stripe.com/3cIbJ18iP2RZ41Mb3T8IU0k",  // 4000$ → 110€
  4500: "https://buy.stripe.com/3cI7sLdD978f55Qc7X8IU0l",  // 4500$ → 120€
  // 5000$+ → kâr paylaşımı (stripeLink yok, iletisim formu gösterilir)
};

// ─── Hesaplama Fonksiyonları ─────────────────────────────────────────────────
export function calcBISTPrice(
  robotId: "DARKROOM" | "HIGHWAY" | "TRADEMATE" | "FABRIKA",
  budgetTL: number
): PricingResult | null {
  const tiers =
    robotId === "TRADEMATE" ? BIST_TM_TIERS :
    robotId === "FABRIKA"   ? BIST_FABRIKA_TIERS :
    BIST_DH_TIERS;

  const tier = tiers.find((t) => budgetTL >= t.minTL && budgetTL <= t.maxTL);
  if (!tier) return null;

  return {
    setupFeeEUR: 50,
    serverCostEUR: tier.serverCostEUR,
    serverCostDisplay: String(tier.serverCostEUR),
    profitSharePercent: tier.profitSharePercent,
    serverTier: `${tier.serverCostEUR}EUR` as ServerTier,
    totalMonthlyCostEUR: tier.serverCostEUR,
    stripeLink: STRIPE_LINKS[tier.serverCostEUR],
  };
}

export function calcBISTSelfPrice(budgetTL: number): PricingResult | null {
  const tier = BIST_SELF_TIERS.find((t) => budgetTL >= t.minTL && budgetTL <= t.maxTL);
  if (!tier) return null;
  return {
    setupFeeEUR: 0,
    serverCostEUR: tier.serverCostEUR,
    serverCostDisplay: String(tier.serverCostEUR),
    profitSharePercent: 0,
    serverTier: `${tier.serverCostEUR}EUR` as ServerTier,
    totalMonthlyCostEUR: tier.serverCostEUR,
    stripeLink: STRIPE_SELF_LINKS[tier.serverCostEUR],
    note: tier.note,
  };
}

export function calcKriptoPremiumPrice(): PricingResult {
  return {
    setupFeeEUR: 0,
    serverCostEUR: 30,
    serverCostDisplay: "30",
    profitSharePercent: 50,
    serverTier: "30EUR",
    totalMonthlyCostEUR: 30,
  };
}

/**
 * KriptoZeka Ascent Self-Service fiyat hesaplama.
 * billingCycle: "monthly" (varsayılan) veya "annual"
 * NOT: $0–$100 aralığında yıllık plan yoktur.
 */
export function calcKriptoSelfPrice(
  budgetUSD: number,
  billingCycle: BillingCycle = "monthly"
): PricingResult | null {
  const tier = KRIPTO_SELF_TIERS.find((t) => budgetUSD >= t.minUSD && budgetUSD <= t.maxUSD);
  if (!tier) return null;

  const isAnnual = billingCycle === "annual" && tier.annualEUR > 0;
  const costEUR = isAnnual ? tier.annualEUR : tier.monthlyEUR;
  const stripeLink = isAnnual
    ? STRIPE_KRIPTO_SELF_ANNUAL[tier.annualEUR]
    : STRIPE_KRIPTO_SELF_MONTHLY[tier.monthlyEUR];

  const annualNoteMonthly = tier.annualEUR > 0
    ? `Yıllık: €${tier.annualEUR} (robot ücretinde 4 ay bedava, sunucu 12 ay)`
    : "Robot + mini sunucu dahil (7€/ay)";

  const annualNoteAnnual = `Yıllık ödeme; robot ücreti 8 ay, sunucu 12 ay hesaplanır.`;

  return {
    setupFeeEUR: 0,
    serverCostEUR: costEUR,
    serverCostDisplay: String(costEUR),
    profitSharePercent: 0,
    serverTier: "INCLUDED",
    totalMonthlyCostEUR: isAnnual ? Math.round(costEUR / 12) : costEUR,
    stripeLink,
    annualStripeLink: tier.annualEUR > 0 ? STRIPE_KRIPTO_SELF_ANNUAL[tier.annualEUR] : undefined,
    annualCostEUR: tier.annualEUR > 0 ? tier.annualEUR : undefined,
    note: isAnnual ? annualNoteAnnual : annualNoteMonthly,
  };
}

export function calcForexZekaPrice(budgetUSD: number): PricingResult | null {
  const tier = FOREXZEKA_TIERS.find((t) => budgetUSD >= t.minUSD && budgetUSD <= t.maxUSD);
  if (!tier) return null;
  return {
    setupFeeEUR: 0,
    serverCostEUR: tier.serverCostEUR,
    serverCostDisplay: tier.isVariable
      ? `${tier.serverCostEUR} + kâr paylaşımı`
      : String(tier.serverCostEUR),
    profitSharePercent: tier.isVariable ? 50 : 0,
    serverTier: tier.isVariable ? "VARIABLE" : `${tier.serverCostEUR}EUR` as ServerTier,
    totalMonthlyCostEUR: tier.serverCostEUR,
    isComingSoon: tier.comingSoon,
    stripeLink: tier.isVariable ? undefined : STRIPE_FOREX_LINKS[budgetUSD],
    note: tier.isVariable
      ? "5000$+ bütçede kâr paylaşımı modeline geçilir (%40–%50)"
      : "İlk 500$ bütçe için sabit ücret uygulanır; sunucu + robot paketi dahil.",
  };
}

// ─── Robot Tanımları ─────────────────────────────────────────────────────────
export interface RobotDefinition {
  id: RobotId;
  nameKey: string;
  descKey: string;
  market: Market;
  managementType: ManagementType;
  comingSoon: boolean;           // sadece görsel badge; tıklanabilir kalır
  paymentBlocked: boolean;       // step 6'da ödeme engeli
  maxCapacity: number;
  minBudgetTL?: number;
  minBudgetUSD?: number;
  features: string[];            // i18n keys
}

export const ROBOTS: RobotDefinition[] = [
  // ── BIST Premium: DarkRoom ─────────────────────────────────────────────────
  {
    id: "DARKROOM",
    nameKey: "wizard.robots.darkroom.name",
    descKey: "wizard.robots.darkroom.desc",
    market: "BIST",
    managementType: "PREMIUM",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 40,
    minBudgetTL: 600_000,
    features: ["wizard.robots.darkroom.f1","wizard.robots.darkroom.f2","wizard.robots.darkroom.f3","wizard.robots.darkroom.f4"],
  },
  // ── BIST Premium: Highway ──────────────────────────────────────────────────
  {
    id: "HIGHWAY",
    nameKey: "wizard.robots.highway.name",
    descKey: "wizard.robots.highway.desc",
    market: "BIST",
    managementType: "PREMIUM",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 30,
    minBudgetTL: 600_000,
    features: ["wizard.robots.highway.f1","wizard.robots.highway.f2","wizard.robots.highway.f3","wizard.robots.highway.f4"],
  },
  // ── BIST Premium: TradeMate ────────────────────────────────────────────────
  {
    id: "TRADEMATE",
    nameKey: "wizard.robots.trademate.name",
    descKey: "wizard.robots.trademate.desc",
    market: "BIST",
    managementType: "PREMIUM",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 50,
    minBudgetTL: 600_000,
    features: ["wizard.robots.trademate.f1","wizard.robots.trademate.f2","wizard.robots.trademate.f3","wizard.robots.trademate.f4"],
  },
  // ── BIST Premium: Fabrika ──────────────────────────────────────────────────
  {
    id: "FABRIKA",
    nameKey: "wizard.robots.fabrika.name",
    descKey: "wizard.robots.fabrika.desc",
    market: "BIST",
    managementType: "PREMIUM",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 20,
    minBudgetTL: 5_000_000,
    features: ["wizard.robots.fabrika.f1","wizard.robots.fabrika.f2","wizard.robots.fabrika.f3","wizard.robots.fabrika.f4","wizard.robots.fabrika.f5"],
  },
  // ── BIST Premium: BorsaZeka Classic (Pek Yakında) ─────────────────────────
  {
    id: "CLASSIC",
    nameKey: "wizard.robots.classic.name",
    descKey: "wizard.robots.classic.desc",
    market: "BIST",
    managementType: "PREMIUM",
    comingSoon: true,
    paymentBlocked: true,
    maxCapacity: 0,
    features: ["wizard.robots.classic.f1","wizard.robots.classic.f2","wizard.robots.classic.f3","wizard.robots.classic.f4"],
  },
  // ── BIST Self-Service: DarkRoom ───────────────────────────────────────────
  {
    id: "DARKROOM_SELF",
    nameKey: "wizard.robots.darkroomSelf.name",
    descKey: "wizard.robots.darkroomSelf.desc",
    market: "BIST",
    managementType: "SELF_SERVICE",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 40,
    minBudgetTL: 0,
    features: ["wizard.robots.darkroom.f1","wizard.robots.darkroom.f2","wizard.robots.bistSelf.f2","wizard.robots.bistSelf.f4","wizard.robots.bistSelf.f5"],
  },
  // ── BIST Self-Service: Highway ────────────────────────────────────────────
  {
    id: "HIGHWAY_SELF",
    nameKey: "wizard.robots.highwaySelf.name",
    descKey: "wizard.robots.highwaySelf.desc",
    market: "BIST",
    managementType: "SELF_SERVICE",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 40,
    minBudgetTL: 0,
    features: ["wizard.robots.highway.f1","wizard.robots.highway.f2","wizard.robots.bistSelf.f2","wizard.robots.bistSelf.f4","wizard.robots.bistSelf.f5"],
  },
  // ── BIST Self-Service: TradeMate ──────────────────────────────────────────
  {
    id: "TRADEMATE_SELF",
    nameKey: "wizard.robots.trademateSelf.name",
    descKey: "wizard.robots.trademateSelf.desc",
    market: "BIST",
    managementType: "SELF_SERVICE",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 50,
    minBudgetTL: 0,
    features: ["wizard.robots.trademate.f1","wizard.robots.trademate.f2","wizard.robots.bistSelf.f2","wizard.robots.bistSelf.f4","wizard.robots.bistSelf.f5"],
  },
  // ── BIST Self-Service: Fabrika ───────────────────────────────────────────
  {
    id: "FABRIKA_SELF",
    nameKey: "wizard.robots.fabrikaSelf.name",
    descKey: "wizard.robots.fabrikaSelf.desc",
    market: "BIST",
    managementType: "SELF_SERVICE",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 20,
    minBudgetTL: 0,
    features: ["wizard.robots.fabrika.f1","wizard.robots.fabrika.f4","wizard.robots.bistSelf.f2","wizard.robots.bistSelf.f4","wizard.robots.bistSelf.f5"],
  },
  // ── Kripto Premium: KriptoZeka ──────────────────────────────────────────
  {
    id: "KRIPTTOZEKA",
    nameKey: "wizard.robots.kriptoZeka.name",
    descKey: "wizard.robots.kriptoZeka.desc",
    market: "CRYPTO",
    managementType: "PREMIUM",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 20,
    minBudgetUSD: 5000,
    features: ["wizard.robots.kriptoZeka.f1","wizard.robots.kriptoZeka.f2","wizard.robots.kriptoZeka.f3","wizard.robots.kriptoZeka.f4"],
  },
  // ── Kripto Premium: KriptoZeka Ascent (Pek Yakında) ──────────────────────
  {
    id: "KRIPTTOZEKA_ASCENT",
    nameKey: "wizard.robots.kriptoZekaAscent.name",
    descKey: "wizard.robots.kriptoZekaAscent.desc",
    market: "CRYPTO",
    managementType: "PREMIUM",
    comingSoon: true,
    paymentBlocked: true,
    maxCapacity: 20,
    minBudgetUSD: 5000,
    features: ["wizard.robots.kriptoZekaAscent.f1","wizard.robots.kriptoZekaAscent.f2","wizard.robots.kriptoZekaAscent.f3","wizard.robots.kriptoZekaAscent.f4"],
  },
  // ── Kripto Self-Service: KriptoZeka Ascent (Pek Yakında) ────────────────
  {
    id: "KRIPTTOZEKA_SELF",
    nameKey: "wizard.robots.kriptoSelf.name",
    descKey: "wizard.robots.kriptoSelf.desc",
    market: "CRYPTO",
    managementType: "SELF_SERVICE",
    comingSoon: true,       // ✅ Aktif etmek için: false yap
    paymentBlocked: true,   // ✅ Aktif etmek için: false yap
    maxCapacity: 50,
    minBudgetUSD: 0,
    features: ["wizard.robots.kriptoSelf.f1","wizard.robots.kriptoSelf.f2","wizard.robots.kriptoSelf.f3","wizard.robots.kriptoSelf.f4"],
  },
  // ── Forex Premium: ForexZeka (Pek Yakında) ────────────────────────────────────────────
  {
    id: "FOREXZEKA",
    nameKey: "wizard.robots.forexZeka.name",
    descKey: "wizard.robots.forexZeka.desc",
    market: "FOREX",
    managementType: "PREMIUM",
    comingSoon: true,       // ✅ Aktif etmek için: false yap
    paymentBlocked: true,   // ✅ Aktif etmek için: false yap
    maxCapacity: 25,
    minBudgetUSD: 500,
    features: ["wizard.robots.forexZeka.f1","wizard.robots.forexZeka.f2","wizard.robots.forexZeka.f3","wizard.robots.forexZeka.f4"],
  },
];

// ─── Bütçe Seçenekleri (Robot'a göre) ────────────────────────────────────────
export const BUDGET_DARKROOM_HIGHWAY: BudgetOption[] = [
  { label: "600.000 – 1.000.000 ₺",  min: 600_000,   max: 1_000_000, value: 800_000   },
  { label: "1.000.000 – 3.000.000 ₺", min: 1_000_001, max: 3_000_000, value: 2_000_000 },
  { label: "3.000.000 – 5.000.000 ₺", min: 3_000_001, max: 5_000_000, value: 4_000_000 },
];

export const BUDGET_TRADEMATE: BudgetOption[] = [
  { label: "600.000 – 1.000.000 ₺",    min: 600_000,    max: 1_000_000,   value: 800_000    },
  { label: "1.000.000 – 3.000.000 ₺",  min: 1_000_001,  max: 3_000_000,   value: 2_000_000  },
  { label: "3.000.000 – 5.000.000 ₺",  min: 3_000_001,  max: 5_000_000,   value: 4_000_000  },
  { label: "5.000.000 – 10.000.000 ₺", min: 5_000_001,  max: 10_000_000,  value: 7_000_000  },
  { label: "10M – 50M ₺",              min: 10_000_001, max: 50_000_000,  value: 20_000_000 },
  { label: "50M – 100M ₺",             min: 50_000_001, max: 100_000_000, value: 75_000_000 },
];

export const BUDGET_FABRIKA: BudgetOption[] = [
  { label: "5.000.000 – 10.000.000 ₺", min: 5_000_001,  max: 10_000_000,  value: 7_000_000  },
  { label: "10M – 50M ₺",              min: 10_000_001, max: 50_000_000,  value: 20_000_000 },
  { label: "50M – 100M ₺",             min: 50_000_001, max: 100_000_000, value: 75_000_000 },
];

export const BUDGET_BIST_SELF_SHARED: BudgetOption[] = [
  { label: "0 – 100.000 ₺",              min: 0,          max: 100_000,   value: 50_000    },
  { label: "100.000 – 300.000 ₺",        min: 100_001,    max: 300_000,   value: 200_000   },
  { label: "300.000 – 600.000 ₺",        min: 300_001,    max: 600_000,   value: 450_000   },
];

export const BUDGET_BIST_SELF_FABRIKA: BudgetOption[] = [
  ...BUDGET_BIST_SELF_SHARED,
  { label: "600.000 – 3.000.000 ₺ (Fabrika)", min: 600_001, max: 3_000_000, value: 1_000_000 },
  { label: "3.000.000 – 5.000.000 ₺",          min: 3_000_001, max: 5_000_000, value: 4_000_000 },
];

export const BUDGET_KRIPTO_PREMIUM: BudgetOption[] = [
  { label: "$5,000 – $10,000",  min: 5000,  max: 10000,  value: 7500  },
  { label: "$10,000 – $25,000", min: 10001, max: 25000,  value: 15000 },
  { label: "$25,000 – $50,000", min: 25001, max: 50000,  value: 37500 },
  { label: "$50,000+",          min: 50001, max: 999999, value: 75000 },
];

// KriptoZeka Ascent Self-Service bütçe seçenekleri
export const BUDGET_KRIPTO_SELF: BudgetOption[] = [
  { label: "$0 – $100",         min: 0,    max: 100,  value: 50   },
  { label: "$100 – $500",       min: 100,  max: 500,  value: 300  },
  { label: "$500 – $2,500",     min: 500,  max: 2500, value: 1500 },
  { label: "$2,500 – $5,000",   min: 2500, max: 5000, value: 3750 },
];

export const BUDGET_FOREXZEKA: BudgetOption[] = [
  { label: "$500",    min: 500,   max: 999,    value: 500   },
  { label: "$1,000",  min: 1000,  max: 1499,   value: 1000  },
  { label: "$1,500",  min: 1500,  max: 1999,   value: 1500  },
  { label: "$2,000",  min: 2000,  max: 2499,   value: 2000  },
  { label: "$2,500",  min: 2500,  max: 2999,   value: 2500  },
  { label: "$3,000",  min: 3000,  max: 3499,   value: 3000  },
  { label: "$3,500",  min: 3500,  max: 3999,   value: 3500  },
  { label: "$4,000",  min: 4000,  max: 4499,   value: 4000  },
  { label: "$4,500",  min: 4500,  max: 4999,   value: 4500  },
  { label: "$5,000+ (Kâr Paylaşımı)", min: 5000, max: 999999, value: 5000 },
];

// ─── Robot'a göre bütçe seçeneklerini döndür ────────────────────────────────
export function getBudgetOptionsForRobot(robotId: RobotId | null): BudgetOption[] {
  switch (robotId) {
    case "DARKROOM":
    case "HIGHWAY":      return BUDGET_DARKROOM_HIGHWAY;
    case "TRADEMATE":    return BUDGET_TRADEMATE;
    case "FABRIKA":      return BUDGET_FABRIKA;
    case "DARKROOM_SELF":
    case "HIGHWAY_SELF":
    case "TRADEMATE_SELF": return BUDGET_BIST_SELF_SHARED;
    case "FABRIKA_SELF":   return BUDGET_BIST_SELF_FABRIKA;
    case "KRIPTTOZEKA":         return BUDGET_KRIPTO_PREMIUM;
    case "KRIPTTOZEKA_ASCENT":  return BUDGET_KRIPTO_PREMIUM;
    case "KRIPTTOZEKA_SELF":    return BUDGET_KRIPTO_SELF;
    case "FOREXZEKA":    return BUDGET_FOREXZEKA;
    case "CLASSIC":      return []; // bütçe seçimi yok
    default:             return [];
  }
}

// ─── Genel fiyat hesaplama ───────────────────────────────────────────────────
export function calcPriceForRobot(
  robotId: RobotId,
  budgetValue: number,
  billingCycle: BillingCycle = "monthly"
): PricingResult | null {
  switch (robotId) {
    case "DARKROOM":
    case "HIGHWAY":    return calcBISTPrice(robotId, budgetValue);
    case "TRADEMATE":  return calcBISTPrice("TRADEMATE", budgetValue);
    case "FABRIKA":    return calcBISTPrice("FABRIKA", budgetValue);
    case "DARKROOM_SELF":
    case "HIGHWAY_SELF":
    case "TRADEMATE_SELF":
    case "FABRIKA_SELF": return calcBISTSelfPrice(budgetValue);
    case "KRIPTTOZEKA_PREMIUM": return calcKriptoPremiumPrice();
    case "KRIPTTOZEKA":         return calcKriptoPremiumPrice();
    case "KRIPTTOZEKA_ASCENT":  return calcKriptoPremiumPrice();
    case "KRIPTTOZEKA_SELF": return calcKriptoSelfPrice(budgetValue, billingCycle);
    case "FOREXZEKA":  return calcForexZekaPrice(budgetValue);
    case "CLASSIC":    return {
      setupFeeEUR: 0, serverCostEUR: 0, serverCostDisplay: "—",
      profitSharePercent: 0, serverTier: "INCLUDED",
      totalMonthlyCostEUR: 0, isComingSoon: true,
    };
    default:           return null;
  }
}
