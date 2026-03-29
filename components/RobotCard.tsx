import { Shield, Zap, ArrowRight, Star } from "lucide-react";
import styles from "./RobotCard.module.css";

interface RobotCardProps {
  id: string;
  name: string;
  rating: number;
  followers: string;
  monthlyReturn: string;
  description: string;
  tags: string[];
  iconType: 'shield' | 'zap';
  onDetailClick: (id: string) => void;
}

export default function RobotCard({
  id,
  name,
  rating,
  followers,
  monthlyReturn,
  description,
  tags,
  iconType,
  onDetailClick
}: RobotCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconTitleGroup}>
          <div className={`${styles.icon} ${iconType === 'zap' ? styles.iconPurple : ''}`}>
            {iconType === 'shield' ? <Shield size={24} /> : <Zap size={24} />}
          </div>
          <div>
            <div className={styles.title}>{name}</div>
            <div className={styles.rating}>
              <Star size={12} className={styles.star} fill="currentColor" />
              {rating} ({followers} Takipçi)
            </div>
          </div>
        </div>
        <div className={styles.returnBlock}>
          <div className={styles.returnLabel}>Aylık Getiri</div>
          <div className={styles.returnValue}>{monthlyReturn}</div>
        </div>
      </div>
      
      <div className={styles.description}>"{description}"</div>
      
      <div className={styles.tags}>
        {tags.map((tag, idx) => (
          <span key={idx} className={styles.tag}>{tag}</span>
        ))}
      </div>
      
      <div className={styles.actionArea}>
        <button className={styles.detailBtn} onClick={() => onDetailClick(id)}>
          İncele <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
