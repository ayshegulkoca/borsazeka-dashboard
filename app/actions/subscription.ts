"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { type PlanType } from "@/lib/plans";
import { PLAN_DEFAULT_ROBOTS } from "@/lib/robots";

/**
 * Kullanıcının aboneliğini veritabanına kaydeder,
 * pakete bağlı robotları otomatik ekler,
 * ardından /dashboard'a yönlendirir.
 */
export async function activateSubscription(planType: PlanType) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userId = session.user.id;
  const billingDate = new Date();
  billingDate.setMonth(billingDate.getMonth() + 1);

  // 1. Aboneliği kaydet veya güncelle
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      planType,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      nextBillingDate: billingDate,
      cancelAtPeriodEnd: false,
    },
    create: {
      userId,
      planType,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      nextBillingDate: billingDate,
    },
  });

  // 2. Pakete bağlı robotları otomatik ekle
  const robotsToAdd = PLAN_DEFAULT_ROBOTS[planType] ?? [];
  for (const robotId of robotsToAdd) {
    await prisma.userRobot.upsert({
      where: { userId_robotId: { userId, robotId } },
      update: { isActive: true },
      create: { userId, robotId, isActive: true },
    });
  }

  redirect("/dashboard");
}
