"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface SyncBrokerParams {
  accountType: "BIST" | "BINANCE";
  institution: string;
  accountNo: string;
  robotName: string;
}

/**
 * Synchronizes broker account metadata with the database and activates the selected robot.
 * Sensitive data is NOT handled here (sent via client-side webhook instead).
 */
export async function syncBrokerAccount(params: SyncBrokerParams) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    // 1. Save Broker Account Metadata
    await prisma.brokerAccount.create({
      data: {
        userId,
        accountType: params.accountType,
        institution: params.institution,
        accountNo: params.accountNo,
        robotName: params.robotName,
        isActive: true,
      },
    });

    // 2. Activate/Update User Robot
    // Map display names → robotId (must match UserRobot.robotId in DB)
    const DISPLAY_TO_ROBOT_ID: Record<string, string> = {
      "DarkRoom Premium":        "darkroom",
      "Highway Premium":         "highway",
      "TradeMate Premium":       "trademate",
      "Fabrika Premium":         "fabrika",
      "DarkRoom Self-Service":   "darkroom_self",
      "Highway Self-Service":    "highway_self",
      "TradeMate Self-Service":  "trademate_self",
      "Fabrika Self-Service":    "fabrika_self",
      "BorsaZeka Classic":       "classic",
      "KriptoZeka":              "kripttozeka",
      "KriptoZeka Ascent Self":  "kripttozeka_self",
      "KriptoZeka Ascent":       "kripttozeka_ascent",
      "ForexZeka":               "forexzeka",
    };
    const robotId = DISPLAY_TO_ROBOT_ID[params.robotName] ?? params.robotName.toLowerCase();

    await prisma.userRobot.upsert({
      where: {
        userId_robotId: {
          userId,
          robotId,
        },
      },
      update: {
        isActive: true,
      },
      create: {
        userId,
        robotId,
        isActive: true,
      },
    });

    // 3. Clear cache to reflect changes immediately
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/accounts");

    return { success: true };
  } catch (error) {
    console.error("[SyncBrokerAccount Error]:", error);
    return { success: false, error: "Veritabanı senkronizasyonu başarısız oldu." };
  }
}
