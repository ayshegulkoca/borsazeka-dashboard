// Merkezi robot kataloğu — DB'deki robotId değerleriyle eşleşir

export type RobotId = "darkroom" | "highway" | "trademate";

export interface RobotDef {
  id: RobotId;
  name: string;
  tagline: string;
  description: string;
  monthlyReturn: string;
  winRate: string;
  totalTrades: number;
  riskLevel: "Düşük" | "Orta" | "Yüksek";
  tags: string[];
  color: string; // accent color for ui
}

export const ROBOT_CATALOG: RobotDef[] = [
  {
    id: "darkroom",
    name: "DarkRoom Self-Service",
    tagline: "Sessiz ama güçlü momentum stratejisi",
    description:
      "DarkRoom, düşük volatilite dönemlerinde sessizce pozisyon alarak, trendi takip eden gelişmiş bir momentum motorudur. Geçmiş 5000+ işlem günü verisiyle beslenen AI modeli sayesinde zararlı gürültüyü filtreler.",
    monthlyReturn: "+%18.4",
    winRate: "%71",
    totalTrades: 482,
    riskLevel: "Orta",
    tags: ["AI Tabanlı", "Orta Risk", "Momentum"],
    color: "#60a5fa",
  },
  {
    id: "highway",
    name: "Highway Self-Service",
    tagline: "Yüksek hacimli piyasalarda trend yakalaması",
    description:
      "Highway, yüksek işlem hacminin olduğu piyasa koşullarında hızlı pozisyon alıp kapatan agresif bir trend takipçisidir. Özellikle açılış saatlerinde ve önemli haber akışlarında yüksek performans gösterir.",
    monthlyReturn: "+%24.7",
    winRate: "%68",
    totalTrades: 894,
    riskLevel: "Yüksek",
    tags: ["Hızlı İşlem", "Yüksek Risk", "Trend"],
    color: "#f472b6",
  },
  {
    id: "trademate",
    name: "TradeMate Self-Service",
    tagline: "Kişiselleştirilebilir esnek strateji motoru",
    description:
      "TradeMate, kullanıcının kendi risk profiline ve tercihlerine göre ayarlanabilen hibrit bir robot platformudur. AI önerileri sunarken nihai kararı kullanıcıya bırakır. Yeni başlayanlar için ideal.",
    monthlyReturn: "+%14.2",
    winRate: "%74",
    totalTrades: 317,
    riskLevel: "Düşük",
    tags: ["Kişiselleştirilebilir", "Düşük Risk", "Hibrit"],
    color: "#10b981",
  },
];

export const ROBOT_BY_ID: Record<RobotId, RobotDef> = Object.fromEntries(
  ROBOT_CATALOG.map((r) => [r.id, r])
) as Record<RobotId, RobotDef>;

/** Pakete göre hangi robotların otomatik ekleneceğini döndürür */
export const PLAN_DEFAULT_ROBOTS: Record<string, RobotId[]> = {
  DARKROOM_PREMIUM: ["darkroom"],
  HIGHWAY_PREMIUM: ["highway"],
  TRADEMATE_PREMIUM: ["trademate"],
  FABRIKA_PREMIUM: ["darkroom", "highway", "trademate"],
  BORSAZEKA_CLASSIC: ["darkroom", "highway", "trademate"],
  // eski planlar
  STARTER: ["darkroom"],
  PRO: ["darkroom", "highway"],
  ENTERPRISE: ["darkroom", "highway", "trademate"],
};
