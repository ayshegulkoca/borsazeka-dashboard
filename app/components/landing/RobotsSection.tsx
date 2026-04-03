"use client";

import { Bot, TrendingUp, BarChart2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./landing.module.css";

export default function RobotsSection() {
  const { t } = useTranslation("common");

  const robots = [
    { icon: TrendingUp, nameKey: "robotsSection.robot1Name", descKey: "robotsSection.robot1Desc" },
    { icon: BarChart2,  nameKey: "robotsSection.robot2Name", descKey: "robotsSection.robot2Desc" },
    { icon: Bot,        nameKey: "robotsSection.robot3Name", descKey: "robotsSection.robot3Desc" },
  ];

  return (
    <section id="robots" className={`${styles.section} ${styles.robotsSection}`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>{t("robotsSection.sectionTag")}</span>
          <h2 className={styles.sectionTitle}>{t("robotsSection.sectionTitle")}</h2>
          <p className={styles.sectionSubtitle}>{t("robotsSection.sectionSubtitle")}</p>
        </div>

        <div className={styles.robotGrid} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {robots.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.nameKey} className={styles.robotCard}>
                <div className={styles.robotIconWrap}>
                  <Icon size={26} color="var(--accent-primary)" />
                </div>
                <div className={styles.robotName}>{t(r.nameKey)}</div>
                <div className={styles.robotDesc}>{t(r.descKey)}</div>
                <span className={styles.robotBadge}>{t("robotsSection.badgeActive")}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
