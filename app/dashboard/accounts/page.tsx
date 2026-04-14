import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountsView from "./AccountsView";

export default async function AccountsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userId = session.user.id;

  // Fetch real accounts from database
  const accounts = await prisma.brokerAccount.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Fetch user's active robots (to filter dropdown in the integration form)
  const userRobots = await prisma.userRobot.findMany({
    where: { userId, isActive: true },
    select: { robotId: true },
  });

  const ownedRobotIds = userRobots.map(r => r.robotId);

  return <AccountsView initialAccounts={accounts} ownedRobotIds={ownedRobotIds} />;
}
