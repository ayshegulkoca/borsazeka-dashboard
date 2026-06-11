"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { apiPost, getMyRobots } from "@/lib/api";


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
      "KriptoZeka Ascent Premium": "kripttozeka_self",
      "KriptoZeka Self-Service":       "kripttozeka_ascent",
      "ForexZeka":               "forexzeka",
    };
    const robotId = DISPLAY_TO_ROBOT_ID[params.robotName] ?? params.robotName.toLocaleLowerCase('en-US');

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

/**
 * Fetches the active brokers from the live API dispatcher
 */
export async function getBrokersAction() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
    const response = await apiPost<{
      success: boolean;
      data?: {
        brokers?: Array<{
          name: string;
          imkbBackOffice: string;
          viopBackOffice: string;
          loginType: number;
        }>;
      };
      error?: string;
    }>("/dispatch", {
      mail: session.user.email,
      isNotification: false,
      method: "Brokers",
      data: {},
    });

    return response;
  } catch (error) {
    console.error("[getBrokersAction Error]:", error);
    return null;
  }
}

/**
 * Connects/updates a broker account on the live API dispatcher
 * and synchronizes it with the local database.
 */
export async function setBrokerAccountAction(params: {
  subscriptionCode: string;
  brokerName: string;
  accountNo: string;
  subAccountNo?: string;
  viopEnabled: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
    const response = await apiPost<{
      success: boolean;
      data?: {
        status: string;
        code: string;
        pushedToAccountManager: boolean;
        accountManagerError: string | null;
      };
      error?: string;
    }>("/dispatch", {
      mail: session.user.email,
      isNotification: false,
      method: "SetBrokerAccount",
      data: {
        subscriptionCode: params.subscriptionCode,
        brokerName: params.brokerName,
        accountNo: params.accountNo,
        subAccountNo: params.subAccountNo || "",
        viopEnabled: params.viopEnabled,
      },
    });

    if (response?.success && response?.data?.status === "success") {
      // Find the robot matching this subscription code/id to save its display name
      const apiRobots = await getMyRobots(session.user.email);
      const matchedRobot = apiRobots?.find(
        (r: any) => r.subscriptionCode === params.subscriptionCode || r.subscriptionId === params.subscriptionCode
      );
      const robotName = matchedRobot?.robotName || "BIST Robot";

      // Sync with local Prisma database
      await prisma.brokerAccount.create({
        data: {
          userId: session.user.id,
          accountType: "BIST",
          institution: params.brokerName,
          accountNo: params.accountNo,
          robotName: robotName,
          isActive: true,
        },
      });

      // Clear cache to reflect changes immediately
      revalidatePath("/dashboard/hesaplarim");
      revalidatePath("/dashboard");
    }

    return response;
  } catch (error) {
    console.error("[setBrokerAccountAction Error]:", error);
    return null;
  }
}

