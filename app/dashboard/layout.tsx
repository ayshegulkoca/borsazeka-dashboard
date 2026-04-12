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

  // Abonelik bilgisini çek — ama Dashboard erişimini ENGELLEME
  // Kurulum tamamlanmamış kullanıcılar da Dashboard'a girebilmeli
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  // Sadece AKTİF ve ÜCRETLİ (non-FREE) aboneliği olan kullanıcılar için plan etiketi göster
  const planLabel =
    subscription?.status === "ACTIVE" && subscription.planType !== "FREE"
      ? (PLAN_LABELS[subscription.planType] ?? subscription.planType)
      : "";

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
