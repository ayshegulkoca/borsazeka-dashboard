"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Smart login: aktif aboneliği varsa /dashboard'a,
 * yoksa /checkout'a yönlendir.
 */
export async function smartLogin(callbackUrl?: string) {
  // Zaten giriş yapılmışsa kontrol et
  const session = await auth();
  if (session?.user?.id) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });
    const isSubscribed =
      subscription && subscription.status === "ACTIVE" && subscription.planType !== "FREE";
    redirect(isSubscribed ? "/dashboard" : (callbackUrl ?? "/checkout"));
  }
  // Giriş yapılmamışsa Google ile giriş yaptır
  await signIn("google", { redirectTo: callbackUrl ?? "/checkout" });
}
