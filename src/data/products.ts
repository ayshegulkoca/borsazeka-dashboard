/**
 * BorsaZeka — Ürün & Fiyat Veri Katmanı
 * Tüm fiyatlar EUR cinsindendir.
 * Bu dosyayı düzenleyerek fiyatlandırma mantığını güncelleyebilirsiniz.
 */

export type Market = "BIST" | "CRYPTO" | "FOREX";
export type ManagementType = "PREMIUM" | "SELF_SERVICE";
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

export type ServerTier = "30EUR" | "60EUR" | "65EUR" | "95EUR" | "100EUR" | "200EUR" | "240EUR" | "320EUR" | "600EUR" | "1000EUR" | "VARIABLE" | "INCLUDED";

export interface PricingResult {
  setupFeeEUR: number;
  serverCostEUR: number;
  serverCostDisplay: string;        // e.g. "40" or "40 + değişken"
  profitSharePercent: number;
  serverTier: ServerTier;
  totalMonthlyCostEUR: number;
  isComingSoon?: boolean;           // hizmet henüz sunulmamış
  stripeLink?: string;              // opsiyonel ödeme linki
  note?: string;                    // ek bilgi notu
}

export interface BudgetOption {
  label: string;
  min: number;
  max: number;
  value: number;          // hesaplama için temsili değer
  comingSoon?: boolean;   // sadece bu bütçe seçeneği pek yakında ise
}

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

// ─── BIST Self-Service (ortak paket, Pek Yakında) ────────────────────────────
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
  { minUSD: 500,   maxUSD: 999,    serverCostEUR: 40,  comingSoon: true },
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

// ─── KriptoZeka Self-Service Fiyatlandırma ───────────────────────────────────
export const KRIPTO_SELF_TIERS: Array<{
  minUSD: number; maxUSD: number;
  monthlyEUR: number; annualEUR: number;
}> = [
  { minUSD: 0,    maxUSD: 100,  monthlyEUR: 7,   annualEUR: 0   },   // free + mini sunucu
  { minUSD: 100,  maxUSD: 500,  monthlyEUR: 11,  annualEUR: 116 },
  { minUSD: 500,  maxUSD: 2500, monthlyEUR: 39,  annualEUR: 340 },
  { minUSD: 2500, maxUSD: 5000, monthlyEUR: 67,  annualEUR: 564 },
];

// ─── Stripe Ödeme Linkleri ────────────────────────────────────────────────────
export const STRIPE_LINKS: Record<number, string> = {
  30: "https://buy.stripe.com/eVq4gzgPlakr8i25Jz8IU01",
  55: "https://buy.stripe.com/dRmdR99mT507aqa1tj8IU02",
  95: "https://buy.stripe.com/9B69AT7eL64bfKu1tj8IU03",
  240: "https://buy.stripe.com/4gM8wPeHddwDgOydc18IU04",
  320: "https://buy.stripe.com/cNi6oHdD964baqa6ND8IU05",
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
    isComingSoon: true,
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

export function calcKriptoSelfPrice(budgetUSD: number): PricingResult | null {
  const tier = KRIPTO_SELF_TIERS.find((t) => budgetUSD >= t.minUSD && budgetUSD <= t.maxUSD);
  if (!tier) return null;
  return {
    setupFeeEUR: 0,
    serverCostEUR: tier.monthlyEUR,
    serverCostDisplay: String(tier.monthlyEUR),
    profitSharePercent: 0,
    serverTier: "INCLUDED",
    totalMonthlyCostEUR: tier.monthlyEUR,
    isComingSoon: true,
    note: tier.annualEUR > 0 ? `Yıllık: €${tier.annualEUR} (4 ay bedava)` : "Robot + mini sunucu dahil",
  };
}

export function calcForexZekaPrice(budgetUSD: number): PricingResult | null {
  const tier = FOREXZEKA_TIERS.find((t) => budgetUSD >= t.minUSD && budgetUSD <= t.maxUSD);
  if (!tier) return null;
  return {
    setupFeeEUR: 0,
    serverCostEUR: tier.serverCostEUR,
    serverCostDisplay: tier.isVariable ? `${tier.serverCostEUR} + değişken` : String(tier.serverCostEUR),
    profitSharePercent: tier.isVariable ? 50 : 0,
    serverTier: tier.isVariable ? "VARIABLE" : `${tier.serverCostEUR}EUR` as ServerTier,
    totalMonthlyCostEUR: tier.serverCostEUR,
    isComingSoon: tier.comingSoon,
    note: tier.isVariable ? "5000$+ bütçede kâr paylaşımı modeline geçilir" : undefined,
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
    comingSoon: true,
    paymentBlocked: true,
    maxCapacity: 0,
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
    comingSoon: true,
    paymentBlocked: true,
    maxCapacity: 0,
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
    comingSoon: true,
    paymentBlocked: true,
    maxCapacity: 0,
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
    comingSoon: true,
    paymentBlocked: true,
    maxCapacity: 0,
    minBudgetTL: 0,
    features: ["wizard.robots.fabrika.f1","wizard.robots.fabrika.f4","wizard.robots.bistSelf.f2","wizard.robots.bistSelf.f4","wizard.robots.bistSelf.f5"],
  },
  // ── Kripto Premium: KriptoZeka (ayrı robot) ──────────────────────────────
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
  // ── Kripto Premium: KriptoZeka Ascent (ayrı robot) ──────────────────────
  {
    id: "KRIPTTOZEKA_ASCENT",
    nameKey: "wizard.robots.kriptoZekaAscent.name",
    descKey: "wizard.robots.kriptoZekaAscent.desc",
    market: "CRYPTO",
    managementType: "PREMIUM",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 20,
    minBudgetUSD: 5000,
    features: ["wizard.robots.kriptoZekaAscent.f1","wizard.robots.kriptoZekaAscent.f2","wizard.robots.kriptoZekaAscent.f3","wizard.robots.kriptoZekaAscent.f4"],
  },
  // ── Kripto Premium: KriptoZeka + Ascent (combined legacy) ─────────────────
  {
    id: "KRIPTTOZEKA_PREMIUM",
    nameKey: "wizard.robots.kriptoPremium.name",
    descKey: "wizard.robots.kriptoPremium.desc",
    market: "CRYPTO",
    managementType: "PREMIUM",
    comingSoon: true,
    paymentBlocked: true,
    maxCapacity: 20,
    minBudgetUSD: 5000,
    features: ["wizard.robots.kriptoPremium.f1","wizard.robots.kriptoPremium.f2","wizard.robots.kriptoPremium.f3","wizard.robots.kriptoPremium.f4"],
  },
  // ── Kripto Self-Service: KriptoZeka Ascent (Pek Yakında, tıklanabilir) ────
  {
    id: "KRIPTTOZEKA_SELF",
    nameKey: "wizard.robots.kriptoSelf.name",
    descKey: "wizard.robots.kriptoSelf.desc",
    market: "CRYPTO",
    managementType: "SELF_SERVICE",
    comingSoon: true,
    paymentBlocked: true,
    maxCapacity: 0,
    minBudgetUSD: 0,
    features: ["wizard.robots.kriptoSelf.f1","wizard.robots.kriptoSelf.f2","wizard.robots.kriptoSelf.f3","wizard.robots.kriptoSelf.f4"],
  },
  // ── Forex Premium: ForexZeka ──────────────────────────────────────────────
  {
    id: "FOREXZEKA",
    nameKey: "wizard.robots.forexZeka.name",
    descKey: "wizard.robots.forexZeka.desc",
    market: "FOREX",
    managementType: "PREMIUM",
    comingSoon: false,
    paymentBlocked: false,
    maxCapacity: 25,
    minBudgetUSD: 500,
    features: ["wizard.robots.forexZeka.f1","wizard.robots.forexZeka.f2","wizard.robots.forexZeka.f3","wizard.robots.forexZeka.f4"],
  },
];

// ─── Bütçe Seçenekleri (Robot'a göre) ───────────────────────────────────────
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

export const BUDGET_KRIPTO_SELF: BudgetOption[] = [
  { label: "$0 – $100",         min: 0,    max: 100,  value: 50   },
  { label: "$100 – $500",       min: 100,  max: 500,  value: 300  },
  { label: "$500 – $2,500",     min: 500,  max: 2500, value: 1500 },
  { label: "$2,500 – $5,000",   min: 2500, max: 5000, value: 3750 },
];

export const BUDGET_FOREXZEKA: BudgetOption[] = [
  { label: "$500",    min: 500,   max: 999,    value: 500,    comingSoon: true  },
  { label: "$1,000",  min: 1000,  max: 1499,   value: 1000   },
  { label: "$1,500",  min: 1500,  max: 1999,   value: 1500   },
  { label: "$2,000",  min: 2000,  max: 2499,   value: 2000   },
  { label: "$2,500",  min: 2500,  max: 2999,   value: 2500   },
  { label: "$3,000",  min: 3000,  max: 3499,   value: 3000   },
  { label: "$3,500",  min: 3500,  max: 3999,   value: 3500   },
  { label: "$4,000",  min: 4000,  max: 4499,   value: 4000   },
  { label: "$4,500",  min: 4500,  max: 4999,   value: 4500   },
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
    case "KRIPTTOZEKA_PREMIUM": return BUDGET_KRIPTO_PREMIUM;
    case "KRIPTTOZEKA":        return BUDGET_KRIPTO_PREMIUM;
    case "KRIPTTOZEKA_ASCENT": return BUDGET_KRIPTO_PREMIUM;
    case "KRIPTTOZEKA_SELF":    return BUDGET_KRIPTO_SELF;
    case "FOREXZEKA":    return BUDGET_FOREXZEKA;
    case "CLASSIC":      return []; // bütçe seçimi yok
    default:             return [];
  }
}

// ─── Genel fiyat hesaplama ───────────────────────────────────────────────────
export function calcPriceForRobot(
  robotId: RobotId,
  budgetValue: number
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
    case "KRIPTTOZEKA_SELF": return calcKriptoSelfPrice(budgetValue);
    case "FOREXZEKA":  return calcForexZekaPrice(budgetValue);
    case "CLASSIC":    return {
      setupFeeEUR: 0, serverCostEUR: 0, serverCostDisplay: "—",
      profitSharePercent: 0, serverTier: "INCLUDED",
      totalMonthlyCostEUR: 0, isComingSoon: true,
    };
    default:           return null;
  }
}
