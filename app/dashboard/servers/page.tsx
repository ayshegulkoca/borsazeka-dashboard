import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SERVER_PACKAGES } from "@/src/data/products";
import { getPrefilledStripeLink } from "@/lib/stripe";
import { apiGet, apiFetch } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import ServersClient from "./ServersClient";

function getRobotNormalizedId(name: string): string {
  if (!name) return "";
  const n = name.toLowerCase().trim();
  if (n.includes("trademate")) return "trademate";
  if (n.includes("darkroom")) return "darkroom";
  if (n.includes("highway")) return "highway";
  if (n.includes("fabrika")) return "fabrika";
  if (n.includes("classic")) return "classic";
  if (n.includes("kripto")) return "kripttozeka";
  if (n.includes("forex")) return "forexzeka";
  return n;
}

const ROBOT_DISPLAY_NAMES: Record<string, string> = {
  trademate: "TradeMate Premium",
  darkroom: "DarkRoom Premium",
  highway: "Highway Premium",
  fabrika: "Fabrika Premium",
  trademate_self: "TradeMate Self-Service",
  darkroom_self: "DarkRoom Self-Service",
  highway_self: "Highway Self-Service",
  fabrika_self: "Fabrika Self-Service",
  classic: "BorsaZeka Classic",
  kripttozeka: "KriptoZeka",
  kripttozeka_self: "KriptoZeka Ascent Premium",
  kripttozeka_ascent: "KriptoZeka Self-Service",
  forexzeka: "ForexZeka",
};

export default async function ServersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userEmail = session.user.email ?? "";

  // Aktif sunucuları BorsaZeka dispatch (MyServers) API'sinden çek
  let myServers: any[] = [];
  try {
    const response = await apiFetch("/dispatch", {
      method: "POST",
      body: JSON.stringify({
        mail: userEmail,
        isNotification: false,
        method: "MyServers",
        data: {},
      }),
    });

    if (response.ok) {
      const json = await response.json().catch(() => null);
      if (json?.success && json?.data?.servers) {
        const brokerAccounts = await prisma.brokerAccount.findMany({
          where: { userId: session.user.id }
        });

        myServers = json.data.servers.map((srv: any) => {
          const robotId = getRobotNormalizedId(srv.robotName || "");
          const robotDisplayName = ROBOT_DISPLAY_NAMES[robotId] || srv.robotName || "-";
          
          const matchedAccount = brokerAccounts.find((acc: any) => {
            const accRobotId = getRobotNormalizedId(acc.robotName || "");
            return accRobotId === robotId;
          });

          return {
            id:      srv.accountManagerId || srv.code,
            name:    srv.displayName || srv.robotName || "Sunucu",
            ip:      srv.ipAddress || "-",
            latency: srv.robotName || "-",
            status:  srv.isActive ? "online" : "offline",
            load:    srv.robotServerCode || "Aktif",
            robotDisplayName,
            brokerName: srv.brokerName || srv.institution || matchedAccount?.institution || "",
            accountNo: srv.accountNo || srv.brokerAccountNo || matchedAccount?.accountNo || "",
          };
        });
      }
    }
  } catch (error) {
    console.error("Error fetching MyServers:", error);
  }

  // Stripe URL'lerini server-side oluştur, sonra client'a geç
  const packages = SERVER_PACKAGES.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    priceEUR: pkg.priceEUR,
    stripeBaseUrl: pkg.stripeBaseUrl,
    stripeUrl: getPrefilledStripeLink(pkg.stripeBaseUrl, userEmail),
  }));

  return <ServersClient myServers={myServers} packages={packages} />;
}
