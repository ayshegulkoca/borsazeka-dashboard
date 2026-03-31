export const PLAN_LABELS: Record<string, string> = {
  DARKROOM_PREMIUM: "DarkRoom Premium",
  HIGHWAY_PREMIUM: "Highway Premium",
  TRADEMATE_PREMIUM: "TradeMate Premium",
  FABRIKA_PREMIUM: "Fabrika Premium",
  BORSAZEKA_CLASSIC: "BorsaZeka Classic",
  STARTER: "Başlangıç",
  PRO: "Pro",
  ENTERPRISE: "Kurumsal",
  FREE: "Ücretsiz",
};

export const PLAN_PRICES: Record<string, string> = {
  DARKROOM_PREMIUM: "₺299",
  HIGHWAY_PREMIUM: "₺399",
  TRADEMATE_PREMIUM: "₺499",
  FABRIKA_PREMIUM: "₺899",
  BORSAZEKA_CLASSIC: "₺1.499",
  STARTER: "₺199",
  PRO: "₺499",
  ENTERPRISE: "₺1.499",
};

export const VALID_PLAN_IDS = [
  "DARKROOM_PREMIUM",
  "HIGHWAY_PREMIUM",
  "TRADEMATE_PREMIUM",
  "FABRIKA_PREMIUM",
  "BORSAZEKA_CLASSIC",
  "STARTER",
  "PRO",
  "ENTERPRISE",
] as const;

export type PlanType = (typeof VALID_PLAN_IDS)[number];
