import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Giriş Yap akıllı yönlendirme:
 * - Aktif aboneliği olan kullanıcı: /dashboard
 * - Aboneliği olmayan kullanıcı: /checkout
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const isSubscribed =
    subscription &&
    subscription.status === "ACTIVE" &&
    subscription.planType !== "FREE";

  if (isSubscribed) {
    redirect("/dashboard");
  } else {
    redirect("/robotlar");
  }
}
