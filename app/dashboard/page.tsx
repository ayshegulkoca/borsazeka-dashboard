import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PLAN_LABELS } from "@/lib/plans";
import { ROBOT_BY_ID } from "@/lib/robots";
import DashboardHomeClient from "./DashboardHomeClient";

export default async function DashboardHome() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userId = session.user.id;

  // Gerçek veriler — DB'den çek
  const [subscription, userRobots, brokerAccountsCount] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.userRobot.findMany({ where: { userId, isActive: true }, orderBy: { addedAt: "asc" } }),
    prisma.brokerAccount.count({ where: { userId } }),
  ]);

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
