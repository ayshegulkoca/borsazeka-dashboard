import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  // Fetch subscription for the plan badge
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const planLabel =
    subscription?.planType === "PRO"
      ? "Pro"
      : subscription?.planType === "ENTERPRISE"
      ? "Kurumsal"
      : subscription?.planType === "STARTER"
      ? "Başlangıç"
      : "Ücretsiz";

  return (
    <DashboardShell
      userName={session.user.name ?? "Kullanıcı"}
      userImage={session.user.image ?? undefined}
      planLabel={planLabel}
    >
      {children}
    </DashboardShell>
  );
}
