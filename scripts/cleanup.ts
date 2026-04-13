import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

// .env.local dosyasını yükle
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  console.log("🧹 Veri temizliği başlıyor...");

  try {
    const robots = await prisma.userRobot.deleteMany({});
    console.log(`✅ ${robots.count} adet UserRobot silindi.`);

    const subs = await prisma.subscription.deleteMany({});
    console.log(`✅ ${subs.count} adet Subscription silindi.`);

    const servers = await prisma.server.deleteMany({});
    console.log(`✅ ${servers.count} adet Server silindi.`);

    console.log("✨ Temizlik tamamlandı. Sistem %0 durumuna döndü.");
  } catch (error) {
    console.error("❌ Temizlik sırasında hata oluştu:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
