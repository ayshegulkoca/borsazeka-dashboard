import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SERVER_PACKAGES } from "@/src/data/products";
import { getPrefilledStripeLink } from "@/lib/stripe";
import { apiGet, apiFetch } from "@/lib/api";
import ServersClient from "./ServersClient";

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
        myServers = json.data.servers.map((srv: any) => ({
          id:      srv.accountManagerId || srv.code,
          name:    srv.displayName || srv.robotName || "Sunucu",
          ip:      srv.ipAddress || "-",
          latency: srv.robotName || "-",
          status:  srv.isActive ? "online" : "offline",
          load:    srv.robotServerCode || "Aktif",
        }));
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
