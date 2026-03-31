"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { type PlanType } from "@/lib/plans";

/**
 * Kullanıcının aboneliğini veritabanına kaydeder (upsert),
 * ardından /dashboard'a yönlendirir.
 */
export async function activateSubscription(planType: PlanType) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;
  const billingDate = new Date();
  billingDate.setMonth(billingDate.getMonth() + 1);

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

  redirect("/dashboard");
}
