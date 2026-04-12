"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Fetches all active servers for the logged-in user.
 */
export async function getUserServers() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.server.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Creates a placeholder server for a user.
 * Usually called automatically when a user gets their first robot.
 */
export async function createPlaceholderServer(userId: string, robotName: string) {
  return prisma.server.create({
    data: {
      userId,
      name: `İşlem Sunucusu (${robotName})`,
      ip: "192.168.1.1" + Math.floor(Math.random() * 99),
      status: "online",
      load: "12%",
      latency: "15ms",
    },
  });
}

/**
 * Toggles a server's active status.
 */
export async function toggleServerStatus(serverId: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.server.update({
    where: { id: serverId, userId: session.user.id },
    data: { isActive },
  });

  revalidatePath("/dashboard/servers");
}
