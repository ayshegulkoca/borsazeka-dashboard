"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { RobotId } from "@/lib/robots";

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
