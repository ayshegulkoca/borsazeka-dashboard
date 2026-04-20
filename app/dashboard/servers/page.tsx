import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SERVER_PACKAGES } from "@/src/data/products";
import { getPrefilledStripeLink } from "@/lib/stripe";
import { apiGet } from "@/lib/api";
import ServersClient from "./ServersClient";

export default async function ServersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userEmail = session.user.email ?? "";

  // Aktif sunucuları API'den çek
  const apiServers = await apiGet<any[]>("/user/servers");
  const myServers = (apiServers ?? []).map((srv: any) => ({
    id: srv.id,
    name: srv.name,
    ip: srv.ip,
    latency: srv.latency,
    status: srv.status,
    load: srv.load,
  }));

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
