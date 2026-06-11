import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { apiGet, getMyRobots } from "@/lib/api";
import { getRobotNormalizedId } from "@/lib/robots";
import HesaplarimView from "./HesaplarimView";

export default async function HesaplarimPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userEmail = session.user.email ?? "";

  // Fetch connected accounts and user's active robots in parallel from live API
  const [apiAccounts, apiRobots] = await Promise.all([
    apiGet<any[]>("/user/broker-accounts"),
    getMyRobots(userEmail),
  ]);

  const accounts = apiAccounts ?? [];
  const userRobots = apiRobots ?? [];

  // Filter for active Borsa Istanbul (BIST) robot subscriptions
  const activeBistRobots = userRobots
    .filter((r: any) => {
      const normId = getRobotNormalizedId(r.robotName);
      // Exclude Crypto (KriptoZeka) and Forex (ForexZeka) robots
      return normId !== "kripttozeka" && normId !== "forexzeka" && r.isActive !== false;
    })
    .map((r: any) => ({
      subscriptionCode: r.subscriptionCode || r.subscriptionId || getRobotNormalizedId(r.robotName).toUpperCase(),
      robotName: r.robotName,
    }));

  return (
    <HesaplarimView
      userEmail={userEmail}
      initialAccounts={accounts}
      activeBistRobots={activeBistRobots}
    />
  );
}
