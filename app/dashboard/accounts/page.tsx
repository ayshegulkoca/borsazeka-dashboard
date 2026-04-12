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

  return <AccountsView initialAccounts={accounts} />;
}
