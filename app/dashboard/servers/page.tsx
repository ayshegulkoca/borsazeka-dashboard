import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Server, Activity, ArrowRight, ServerCog } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default async function ServersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // Kullanıcının sunucularını DB'den çek
  const userServers = await prisma.server.findMany({
    where: { 
      userId: session.user.id,
      isActive: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const hasServers = userServers.length > 0;

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Sunucu Durumu</h1>
        <p className={styles.subtitle}>İşlem ve analiz sunucularınızın durumunu anlık olarak takip edin.</p>
      </div>

      {!hasServers ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <ServerCog size={48} />
          </div>
          <h2 className={styles.emptyTitle}>Aktif çalışan sunucunuz bulunmamaktadır</h2>
          <p className={styles.emptyDesc}>
            Bir robot kurulumu tamamladığınızda, o robotun bağlı olduğu teknik sunucu bilgileri otomatik olarak burada görünecektir.
          </p>
          <Link href="/dashboard" className={styles.emptyCta}>
            Kuruluma Git <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className={styles.serverList}>
          {userServers.map(server => (
            <div key={server.id} className={styles.serverCard}>
              <div className={styles.serverInfo}>
                <div className={styles.serverIcon}>
                  <Server size={24} />
                </div>
                <div className={styles.serverDetails}>
                  <span className={styles.serverName}>{server.name}</span>
                  <span className={styles.serverIp}>IP: {server.ip}</span>
                </div>
              </div>

              <div className={styles.serverStatus}>
                <div className={`${styles.statusBadge} ${server.status === 'online' ? styles.statusOnline : styles.statusOffline}`}>
                  <span className={styles.statusDot}></span>
                  {server.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                </div>
                {server.status === 'online' && (
                  <div className={styles.loadMetric}>
                    <Activity size={12} /> Yük: {server.load} | Gecikme: {server.latency}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
