import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { apiGet, getMyRobots } from "@/lib/api";
import { getRobotNormalizedId } from "@/lib/robots";
import AccountsView from "./AccountsView";

export default async function AccountsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userEmail = session.user.email ?? "";

  // Fetch real accounts from API (Prisma yerine)
  const apiAccounts = await apiGet<any[]>("/user/broker-accounts");
  const accounts = apiAccounts ?? [];

  // Fetch user's active robots from API (Prisma yerine)
  const apiRobots = await getMyRobots(userEmail);
  const ownedRobotIds = (apiRobots ?? []).map(r => getRobotNormalizedId(r.robotName));

  return (
    <AccountsView 
      userEmail={session.user.email ?? undefined}
      initialAccounts={accounts} 
      ownedRobotIds={ownedRobotIds} 
    />
  );
}
