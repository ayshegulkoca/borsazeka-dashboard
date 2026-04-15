import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PLAN_LABELS } from "@/lib/plans";
import { ROBOT_BY_ID } from "@/lib/robots";
import { apiGet } from "@/lib/api";
import DashboardHomeClient from "./DashboardHomeClient";

export default async function DashboardHome() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userId = session.user.id;

  // Gerçek veriler — API'den çek (Prisma yerine)
  const [subscription, apiRobots, dashboardSummary] = await Promise.all([
    apiGet<any>("/user/subscription"),
    apiGet<any[]>("/user/robots"),
    apiGet<any>("/user/dashboard-summary"),
  ]);

  const userRobots = apiRobots ?? [];

  const brokerAccountsCount = dashboardSummary?.brokerAccountsCount ?? 0;

  const planLabel = subscription?.planType
    ? (PLAN_LABELS[subscription.planType] ?? subscription.planType)
    : "Ücretsiz";

  const activeRobotCount = userRobots.length;

  const robotsWithMeta = userRobots.map((ur) => ({
    ...ur,
    meta: ROBOT_BY_ID[ur.robotId as keyof typeof ROBOT_BY_ID] ?? null,
  }));

  const displayName = session.user.name?.split(" ")[0] ?? "Yatırımcı";

  return (
    <DashboardHomeClient
      displayName={displayName}
      activeRobotCount={activeRobotCount}
      robots={robotsWithMeta}
      hasRobots={userRobots.length > 0}
      hasBrokerAccounts={brokerAccountsCount > 0}
      subscriptionStatus={subscription?.status}
    />
  );
}
