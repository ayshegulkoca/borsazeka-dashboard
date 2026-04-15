import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { apiGet } from "@/lib/api";
import AccountsView from "./AccountsView";

export default async function AccountsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // Fetch real accounts from API (Prisma yerine)
  const apiAccounts = await apiGet<any[]>("/user/broker-accounts");
  const accounts = apiAccounts ?? [];

  // Fetch user's active robots from API (Prisma yerine)
  const apiRobots = await apiGet<any[]>("/user/robots");
  const ownedRobotIds = (apiRobots ?? []).map(r => r.robotId);

  return <AccountsView initialAccounts={accounts} ownedRobotIds={ownedRobotIds} />;
}
