"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Zap, Scale, Globe } from 'lucide-react';
import Navbar from '@/app/components/landing/Navbar';
import GlobalFooter from '@/app/components/landing/GlobalFooter';
import styles from '@/app/components/landing/forex.module.css';

const features = [
  {
    title: "Kurumsal Güven",
    description: "2014'ten bu yana FCA, CySEC ve FSA lisanslarıyla denetlenen, global ölçekte regüle edilmiş şeffaf yatırım ortamı.",
    icon: <Shield size={24} />
  },
  {
    title: "Maliyet Avantajı",
    description: "Sıfıra yakın spread oranları ve piyasa standartlarının altında komisyon yapılarıyla kârlılığınızı maksimize edin.",
    icon: <Zap size={24} />
  },
  {
    title: "Esnek Kaldıraç & İslami Hesap",
    description: "1:500'e kadar özelleştirilebilir kaldıraç seçenekleri ve swap ödemesi içermeyen İslami hesap alternatifi.",
    icon: <Scale size={24} />
  }
];

export default function ForexPage() {
  return (
    <main className={styles.forexPage}>
      <Navbar />

      {/* ── Background Glows ── */}
      <div className={`${styles.bgGlow} ${styles.glowTopLeft}`} />
      <div className={`${styles.bgGlow} ${styles.glowBottomRight}`} />

      {/* ── Hero Section ── */}
      <section className={styles.hero}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.heroTitle}
        >
          Global Piyasalara <br /> 
          Profesyonel Bir Adım Atın
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className={styles.heroSubtitle}
        >
          BorsaZeka algoritmalarıyla tam uyumlu, düşük komisyonlu ve güvenilir Tickmill altyapısında forex hesabınızı dakikalar içinde oluşturun.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a 
            href="https://t.co/kUUMsLhRJZ?amp=1" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.btnCTA}
          >
            Hemen Hesap Aç
          </a>
        </motion.div>

        {/* ── Visual Orb ── */}
        <div className={styles.orbContainer}>
          <div className={styles.glassOrb} />
        </div>
      </section>

      {/* ── Features Bento Grid ── */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={styles.featureCard}
            >
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <GlobalFooter />
    </main>
  );
}
