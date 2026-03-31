import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ROBOT_CATALOG } from "@/lib/robots";
import RobotsClient from "./RobotsClient";

export default async function RobotsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // Kullanıcının sahip olduğu robotları DB'den çek
  const userRobots = await prisma.userRobot.findMany({
    where: { userId: session.user.id },
  });

  // Set: hangi robotid'ler aktif?
  const activeRobotIds: string[] = userRobots
    .filter((r) => r.isActive)
    .map((r) => r.robotId);


  return (
    <RobotsClient
      catalog={ROBOT_CATALOG}
      activeRobotIds={Array.from(activeRobotIds)}
    />
  );
}
