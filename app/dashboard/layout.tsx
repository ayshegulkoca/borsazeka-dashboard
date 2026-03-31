import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PLAN_LABELS } from "@/lib/plans";
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

  // Abonelik bilgisini çek
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const planLabel = subscription?.planType
    ? (PLAN_LABELS[subscription.planType] ?? subscription.planType)
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
