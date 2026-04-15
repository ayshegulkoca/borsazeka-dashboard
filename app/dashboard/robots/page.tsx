import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ROBOT_CATALOG } from "@/lib/robots";
import { apiGet } from "@/lib/api";
import RobotsClient from "./RobotsClient";

export default async function RobotsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // Kullanıcının sahip olduğu robotları API'den çek (Prisma yerine)
  const apiRobots = await apiGet<any[]>("/user/robots");
  const userRobots = apiRobots ?? [];

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
