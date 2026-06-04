import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ROBOT_CATALOG, getRobotNormalizedId } from "@/lib/robots";
import { getMyRobots } from "@/lib/api";
import RobotsClient from "./RobotsClient";

export default async function RobotsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const userEmail = session.user.email ?? "";

  // Kullanıcının sahip olduğu robotları BorsaZeka dispatch (MyRobots) API'sinden çek
  const apiRobots = await getMyRobots(userEmail);
  const userRobots = apiRobots ?? [];

  const activeRobotIds = userRobots.map((r) => getRobotNormalizedId(r.robotName));

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
