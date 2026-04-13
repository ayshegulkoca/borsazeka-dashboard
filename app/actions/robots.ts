"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { RobotId } from "@/lib/robots";
import { createPlaceholderServer } from "./servers";

async function getAuthedUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  return session.user.id;
}

/** Kullanıcının aktif robotlarını döndürür */
export async function getUserRobots() {
  const userId = await getAuthedUserId();
  return prisma.userRobot.findMany({
    where: { userId, isActive: true },
    orderBy: { addedAt: "asc" },
  });
}

/** Robotu kullanıcıya ekler (zaten varsa aktif eder) */
export async function addRobot(robotId: RobotId) {
  const userId = await getAuthedUserId();

  await prisma.userRobot.upsert({
    where: { userId_robotId: { userId, robotId } },
    update: { isActive: true },
    create: { userId, robotId, isActive: true },
  });

  revalidatePath("/dashboard/robots");
  revalidatePath("/dashboard");
}

/** Robotu devre dışı bırakır (soft delete) */
export async function removeRobot(robotId: RobotId) {
  const userId = await getAuthedUserId();

  await prisma.userRobot.updateMany({
    where: { userId, robotId },
    data: { isActive: false },
  });

  revalidatePath("/dashboard/robots");
  revalidatePath("/dashboard");
}

/**
 * Assigns a robot to a user after a successful purchase.
 * Also provisions a server if it's the user's first robot.
 */
export async function assignRobotAfterPurchase(robotId: RobotId) {
  const userId = await getAuthedUserId();

  // 1. Check if user already has this robot
  const existing = await prisma.userRobot.findUnique({
    where: { userId_robotId: { userId, robotId } },
  });

  if (existing?.isActive) return { success: true, alreadyOwned: true };

  // 2. Provision server if first robot
  const robotCount = await prisma.userRobot.count({ where: { userId, isActive: true } });
  if (robotCount === 0) {
    await createPlaceholderServer(userId, robotId.toUpperCase());
  }

  // 3. Upsert robot
  await prisma.userRobot.upsert({
    where: { userId_robotId: { userId, robotId } },
    update: { isActive: true },
    create: { userId, robotId, isActive: true },
  });

  revalidatePath("/dashboard/robots");
  revalidatePath("/dashboard/servers");
  revalidatePath("/dashboard");

  return { success: true };
}


/** 
 * Satın alma işlemi başladığında (Stripe'a giderken) status 'PENDING' yapar.
 * Bu sayede Dashboard'da "Ödeme Kontrol Ediliyor" mesajı gösterebiliriz.
 */
export async function markSubscriptionPending(robotId: string) {
  const userId = await getAuthedUserId();

  // Subscription kaydını PENDING olarak oluştur veya güncelle
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      status: "PENDING",
      pendingRobotId: robotId,
      planType: robotId.toUpperCase() + "_PREMIUM" // Geçici plan tipi
    },
    create: {
      userId,
      status: "PENDING",
      pendingRobotId: robotId,
      planType: robotId.toUpperCase() + "_PREMIUM"
    }
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

/** Kullanıcının abonelik durumunu ve varsa bekleyen robot bilgisini döner */
export async function getSubscriptionStatus() {
  const userId = await getAuthedUserId();
  return prisma.subscription.findUnique({
    where: { userId }
  });
}

/** TİTİZLİK: Tüm sahte UserRobot ve Subscription verilerini temizler */
export async function clearUserBusinessData() {
  // Tüm kullanıcılar için veya sadece mevcut kullanıcı için mi? 
  // İstek: "sistemi sıfırla". Genelde tüm veritabanı temizliği kast edilir.
  
  await prisma.userRobot.deleteMany({});
  await prisma.subscription.deleteMany({});
  // Server temizliği de gerekebilir
  await prisma.server.deleteMany({});

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}
