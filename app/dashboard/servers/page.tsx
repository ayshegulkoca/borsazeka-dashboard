"use client";

import { Server, Activity, Database, ServerCog } from "lucide-react";
import styles from "./page.module.css";

const SERVERS = [
  {
    id: 1,
    name: "Ana İşlem Sunucusu (TR)",
    ip: "192.168.1.100",
    status: "online",
    load: "34%",
    latency: "12ms"
  },
  {
    id: 2,
    name: "Yapay Zeka Analiz (EU)",
    ip: "142.250.184.206",
    status: "online",
    load: "78%",
    latency: "45ms"
  },
  {
    id: 3,
    name: "Veritabanı Kümesi (Kripto)",
    ip: "10.0.0.15",
    status: "offline",
    load: "0%",
    latency: "-"
  }
];

export default function ServersPage() {
  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Sunucu Durumu</h1>
        <p className={styles.subtitle}>İşlem ve analiz sunucularınızın durumunu anlık olarak takip edin.</p>
      </div>

      <div className={styles.serverList}>
        {SERVERS.map(server => (
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
    </div>
  );
}
