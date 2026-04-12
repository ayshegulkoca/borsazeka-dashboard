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
    where: { 
      userId: session.user.id,
      isActive: true
    },
  });

  const activeRobotIds = userRobots.map((r) => r.robotId);

  // SADECE kullanıcının sahip olduğu robotları katalogdan filtrele
  const ownedRobots = ROBOT_CATALOG.filter(robot => 
    activeRobotIds.includes(robot.id)
  );

  return (
    <RobotsClient
      ownedRobots={ownedRobots}
      hasOwnedRobots={ownedRobots.length > 0}
    />
  );
}
