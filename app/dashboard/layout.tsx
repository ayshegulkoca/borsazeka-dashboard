import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PLAN_LABELS } from "@/lib/plans";
import { apiGet } from "@/lib/api";
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

  // User ID API'den veya fallback olarak session'dan gelir
  const userId = session.user.id;
  if (!userId) {
    redirect("/");
  }

  // Abonelik bilgisini API'den çek (Prisma yerine)
  const subscription = await apiGet<any>("/user/subscription");

  // Sadece AKTİF ve ÜCRETLİ (non-FREE) aboneliği olan kullanıcılar için plan etiketi göster
  const planLabel =
    subscription?.status === "ACTIVE" && subscription.planType !== "FREE"
      ? (PLAN_LABELS[subscription.planType] ?? subscription.planType)
      : "";

  return (
    <DashboardShell
      userName={session.user.name ?? "Kullanıcı"}
      userEmail={session.user.email ?? undefined}
      userImage={session.user.image ?? undefined}
      planLabel={planLabel}
    >
      {children}
    </DashboardShell>
  );
}
