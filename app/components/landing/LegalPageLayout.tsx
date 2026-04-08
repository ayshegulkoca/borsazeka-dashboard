"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import s from "./legal.module.css";

interface Section {
  id: string;
  title: string;
  content: string;
  items?: string[];
}

interface LegalPageLayoutProps {
  type: "privacy" | "terms";
}

export default function LegalPageLayout({ type }: LegalPageLayoutProps) {
  const { t } = useTranslation("common");
  const [activeSection, setActiveSection] = useState<string>("");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Access the structured data from common.json
  // We use type casting because t() usually returns string, but we organized it as an object
  const legalData = t(`legal.${type}`, { returnObjects: true }) as any;
  const sections: Section[] = legalData?.sections || [];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!legalData || sections.length === 0) {
    return <div className={s.legalPage}>Loading...</div>;
  }

  return (
    <div className={s.legalPage}>
      <div className={s.container}>
        {/* Sidebar / ToC */}
        <aside className={s.sidebar}>
          <Link href="/" className={s.backButton}>
            <ArrowLeft size={16} /> {t("wizard.backHome")}
          </Link>

          <div className={s.tocTitle}>İçindekiler</div>
          <ul className={s.tocList}>
            {sections.map((section) => (
              <li
                key={section.id}
                className={`${s.tocItem} ${activeSection === section.id ? s.tocItemActive : ""}`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.title}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className={s.content}>
          <div className={s.header}>
            <h1 className={s.title}>{legalData.title}</h1>
            <div className={s.lastUpdated}>
              Son Güncelleme: {legalData.lastUpdated}
            </div>
          </div>

          <div className={s.sections}>
            {sections.map((section) => (
              <section key={section.id} id={section.id} className={s.section}>
                <h2 className={s.sectionTitle}>{section.title}</h2>
                <div className={s.sectionContent}>
                  <p>{section.content}</p>
                  {section.items && section.items.length > 0 && (
                    <ul className={s.list}>
                      {section.items.map((item, idx) => (
                        <li key={idx} className={s.listItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
