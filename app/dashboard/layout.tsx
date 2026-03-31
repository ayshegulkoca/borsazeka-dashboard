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

  // Giriş yapılmamışsa landing'e yönlendir
  if (!session?.user) {
    redirect("/");
  }

  // User ID'yi session veya email üzerinden bul
  // (JWT'de id yoksa email ile kullanıcıyı bul)
  let userId = session.user.id;

  if (!userId && session.user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    userId = dbUser?.id;
  }

  if (!userId) {
    redirect("/");
  }

  // Abonelik bilgisini çek
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  // Aboneliği yoksa checkout'a yönlendir
  if (!subscription || subscription.status !== "ACTIVE") {
    redirect("/checkout");
  }

  const planLabel = PLAN_LABELS[subscription.planType] ?? subscription.planType;

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
