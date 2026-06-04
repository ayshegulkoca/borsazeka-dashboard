"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Calendar, Clock, ArrowLeft
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import styles from "./blog.module.css";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  desc: string;
  content: string;
  readTime: string;
  date: string;
  author: string;
  imageUrl: string;
  themeColor?: string;
  glowColor?: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Borsa İstanbul'da Algoritmik Ticaretin Temelleri",
    category: "Piyasa Analizi",
    desc: "Yapay zeka modellerinin finansal piyasalardaki karar mekanizmalarını, risk yönetimini ve otomasyon süreçlerini sıfırdan keşfedin.",
    content: `
      <h2>Finansal Piyasalarda Yeni Bir Dönem: Algoritmalar</h2>
      <p>Son yıllarda finansal piyasalarda işlem yapma biçimi köklü bir değişim geçirdi. Geleneksel yöntemlerle ekran başında saatlerce analiz yapıp manuel emir giren yatırımcıların yerini, milisaniyeler düzeyinde kararlar alabilen algoritmik sistemler almaya başladı. Borsa İstanbul (BIST) da bu dijital dönüşümün en aktif yaşandığı pazarlardan biri konumunda.</p>
      
      <blockquote>"Algoritmik ticaret, duygulardan arındırılmış, tamamen matematiksel verilere ve istatistiksel olasılıklara dayanan disiplinli bir yatırım disiplinidir."</blockquote>

      <h2>Neden Algoritmik Ticaret?</h2>
      <p>Yatırımcıların en büyük düşmanı çoğu zaman kendi duygularıdır: panik, hırs, sabırsızlık ve kaybetme korkusu. Bir işlem robotu ise duygulardan tamamen arındırılmıştır. Önceden tanımlanmış kurallara (giriş seviyesi, stop-loss, kar al seviyesi) sadık kalarak, piyasa koşulları ne olursa olsun disiplinli bir şekilde emirleri iletir.</p>
      
      <h3>1. Hız ve Tutarlılık</h3>
      <p>Piyasadaki anlık fiyat hareketlerini insan gözüyle takip etmek ve saniyeler içinde karar almak neredeyse imkansızdır. Algoritmalar, milisaniyeler içinde binlerce veri noktasını tarayıp en uygun fiyatlardan pozisyona girebilir.</p>

      <h3>2. 7/24 Takip ve Tarama</h3>
      <p>Bir insan günde sadece birkaç saatini piyasaya odaklanarak geçirebilir. İşlem robotları ise seans açılışından kapanışına kadar, hatta kripto para piyasalarında 7/24 hiç yorulmadan tarama yapmaya devam eder.</p>

      <h2>BorsaZeka Algoritma Altyapısı</h2>
      <p>BorsaZeka olarak geliştirdiğimiz robotlar, sadece basit teknik indikatör kesişimleriyle çalışmaz. Gelişmiş veri madenciliği yöntemleri ve geçmişe dönük 10+ yıllık veri desenleriyle beslenen makine öğrenimi modelleri kullanılarak tasarlanmıştır. Bu sayede piyasadaki sahte gürültü filtrelenerek yüksek olasılıklı trendler tespit edilir.</p>
    `,
    readTime: "6 dk",
    date: "04 Haziran 2026",
    author: "Semih Arslan",
    imageUrl: "/images/blog_featured.png",
    themeColor: "rgba(99, 102, 241, 0.4)",
    glowColor: "rgba(99, 102, 241, 0.05)",
  },
  {
    id: "post-2",
    title: "Yapay Zeka ile Gap Trading Stratejisi",
    category: "Strateji",
    desc: "Borsa İstanbul seans açılışlarındaki boşluklardan (gap) istatistiksel olasılıklarla kazanç elde etmenin püf noktaları.",
    content: `
      <h2>Açılış Boşlukları (Gap) Nedir?</h2>
      <p>Borsa İstanbul seans kapanışı ile bir sonraki günün seans açılışı arasında geçen sürede, şirket haberleri, global piyasalardaki hareketler veya makroekonomik gelişmeler nedeniyle hisse fiyatlarında boşluklar (gap) oluşur. Bu boşluklar, doğru analiz edildiğinde son derece yüksek olasılıklı kazanç fırsatları barındırır.</p>

      <blockquote>"Gap Trading, piyasanın açılış anındaki dengesizlikleri ve fiyat boşluklarını matematiksel modellerle değerlendiren bir yaklaşımdır."</blockquote>

      <h2>DarkRoom Robotunun İstatistiksel DNA'sı</h2>
      <p>BorsaZeka bünyesindeki DarkRoom Self-Service ve Premium robotları, tamamen bu gap ve momentum yapısı üzerine inşa edilmiştir. Sistemde RSI, MACD veya hareketli ortalamalar gibi gecikmeli teknik göstergeler kullanılmaz. Bunun yerine:</p>
      <ul>
        <li>Akşam seans kapanışına yakın (karanlık oda saatlerinde) yapay zeka analiz motoru çalışır.</li>
        <li>Geçmiş binlerce seans gününe ait desenleri tarayarak ertesi sabah yukarı yönlü gap up yapma ihtimali en yüksek hisseleri tespit eder.</li>
        <li>Akşamdan pozisyon açılır, ertesi sabah seans açılışında ise pozisyonlar milisaniyeler içinde otomatik olarak kapatılır.</li>
      </ul>

      <h2>Risk Kontrolünün Önemi</h2>
      <p>Her finansal stratejide olduğu gibi Gap Trading'de de risk yönetimi başarının anahtarıdır. DarkRoom algoritması, tek bir hisseye tüm bütçeyi bağlamak yerine portföyü otomatik olarak hisseler arasında dağıtır. Bu sayede beklenmedik bir piyasa dönüşünde sermaye korunmuş olur.</p>
    `,
    readTime: "4 dk",
    date: "02 Haziran 2026",
    author: "Semih Arslan",
    imageUrl: "/images/blog_strategy.png",
    themeColor: "rgba(168, 85, 247, 0.4)",
    glowColor: "rgba(168, 85, 247, 0.05)",
  },
  {
    id: "post-3",
    title: "Kripto Varlık Yönetiminde Risk Kontrolü",
    category: "Risk Yönetimi",
    desc: "Kripto para piyasalarının yüksek volatilitesinde sermayenizi koruyarak istikrarlı getiri sağlamanın altın kuralları.",
    content: `
      <h2>Kripto Dünyasında Volatilitenin Çift Tarafı</h2>
      <p>Kripto para piyasaları, sunduğu muazzam getiri potansiyelinin yanı sıra çok yüksek volatilite ve risk barındırır. Bir gün içinde %20-30 hareketlerin sıradan olduğu bu ekosistemde, sermayesini doğru yönetemeyen yatırımcılar kısa sürede büyük kayıplarla karşılaşabilirler.</p>

      <h2>KriptoZeka Güvenlik ve Risk Yaklaşımı</h2>
      <p>KriptoZeka ve Ascent robotlarımız, Binance Global üzerinde API entegrasyonuyla çalışırken en yüksek güvenlik ve risk standartlarını uygular:</p>
      
      <h3>1. Transfer Yetkisi Kısıtlaması</h3>
      <p>Oluşturulan API bağlantılarında para çekme/transfer yetkisi tamamen kapalıdır. Robot sadece alım ve satım emri gönderebilir. Varlıklarınız her an kendi Binance hesabınızda güvendedir.</p>

      <h3>2. Dinamik Stop-Loss (Zarar Durdur)</h3>
      <p>Robot, piyasa tersine döndüğünde pozisyonda ısrarcı olmak yerine önceden tanımlanmış stop kurallarına uyarak pozisyondan disiplinli biçimde çıkar. Bu sayede büyük düşüş dalgalarından korunursunuz.</p>

      <h3>3. Çoklu Varlık Dağılımı</h3>
      <p>Tek bir coin yerine, sistem korelasyonu düşük birden fazla coin üzerinde dağılım sağlayarak riski böler.</p>
    `,
    readTime: "5 dk",
    date: "28 Mayıs 2026",
    author: "Semih Arslan",
    imageUrl: "/images/blog_crypto.png",
    themeColor: "rgba(16, 185, 129, 0.4)",
    glowColor: "rgba(16, 185, 129, 0.05)",
  },
  {
    id: "post-4",
    title: "Borsa İstanbul'da Trend Takip Algoritmaları",
    category: "Piyasa Analizi",
    desc: "Highway robotunun çalışma prensiplerini, çoklu zaman periyodu kontrolünü ve trend takip algoritmalarını inceleyin.",
    content: `
      <h2>Trend Takibi: Piyasanın Rüzgarını Arkaya Almak</h2>
      <p>Finans dünyasında en bilinen kurallardan biri "Trend is your friend" (Trend dostunuzdur) ilkesidir. Bir hisse yükseliş trendindeyse, o yönde pozisyon alıp trend bitene kadar taşımak en yüksek kârlılığa sahip yaklaşımlardan biridir. Ancak trendin ne zaman başladığını ve ne zaman bittiğini doğru tayin etmek uzmanlık gerektirir.</p>

      <h2>Highway Algoritmasının Çok Katmanlı Yapısı</h2>
      <p>Highway robotu seans içinde aktif olarak BIST hisselerini tarar. Klasik trend takipçilerinden farkı, tek bir zaman dilimine bağlı kalmamasıdır:</p>
      <ul>
        <li><b>Çoklu Zaman Dilimi Kontrolü:</b> Hem kısa vadeli mini trendleri hem de orta vadeli makro trendleri aynı anda izler. Çifte onay almadan pozisyona girmez.</li>
        <li><b>İzleyen Stop (Trailing Stop):</b> Pozisyon kâra geçtikçe stop seviyesini yukarı taşır. Böylece trend sürdüğü sürece kârı büyütür, beklenmedik düşüşlerde ise kârı koruyarak çıkar.</li>
        <li><b>Endeks Filtresi:</b> BIST 100 endeksinin genel gücünü izler. Rüzgar tersse yelken açmaz, yani endeks zayıfsa alımlarını azaltır veya durdurur.</li>
      </ul>
    `,
    readTime: "5 dk",
    date: "20 Mayıs 2026",
    author: "Semih Arslan",
    imageUrl: "/images/blog_risk.png",
    themeColor: "rgba(14, 165, 233, 0.4)",
    glowColor: "rgba(14, 165, 233, 0.05)",
  }
];

export default function BlogPage() {
  const { t } = useTranslation("common");
  
  // State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Hepsi");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Load posts from localStorage or defaults
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("borsazeka_blog_posts");
      if (saved) {
        try {
          setPosts(JSON.parse(saved));
        } catch {
          setPosts(DEFAULT_POSTS);
        }
      } else {
        setPosts(DEFAULT_POSTS);
        window.localStorage.setItem("borsazeka_blog_posts", JSON.stringify(DEFAULT_POSTS));
      }
    }
  }, []);

  // Filter posts
  const categories = ["Hepsi", "Piyasa Analizi", "Strateji", "Risk Yönetimi"];
  const filteredPosts = activeCategory === "Hepsi" 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const featuredPost = posts.find(p => p.id === "post-1") || posts[0];
  const regularPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>
          <span className={styles.sectionTag}>
            <BookOpen size={12} />
            BorsaZeka Blog
          </span>
          <h1 className={styles.heroTitle}>
            Yapay Zeka & <span>Finansal Teknoloji</span> Günlüğü
          </h1>
          <p className={styles.heroSubtitle}>
            Semih Arslan'ın kaleminden algoritmik ticaret rehberleri, piyasa analizleri ve borsa robotları strateji notları.
          </p>
        </div>
      </header>

      {/* Action Bar (Filters) */}
      <section className={styles.actionBar}>
        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Layout Grid */}
      <main className={styles.layout}>
        {/* Featured Post (Big Card) */}
        {featuredPost && activeCategory === "Hepsi" && (
          <article className={styles.featuredCard}>
            <div 
              className={styles.featuredImageArea}
              style={{ backgroundImage: `url(${featuredPost.imageUrl})` }}
            >
              <div className={styles.featuredGlow} />
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.metaRow}>
                <span className={styles.categoryBadge}>{featuredPost.category}</span>
                <span className={styles.readTime}>
                  <Clock size={12} />
                  {featuredPost.readTime}
                </span>
              </div>
              <h2 className={styles.cardTitle}>
                <button 
                  className="bg-transparent border-none text-left p-0 font-bold text-white text-3xl cursor-pointer hover:text-indigo-300 transition-colors"
                  onClick={() => setSelectedPost(featuredPost)}
                >
                  {featuredPost.title}
                </button>
              </h2>
              <p className={styles.cardDesc}>{featuredPost.desc}</p>
              
              <div className={styles.authorRow}>
                <div className={styles.avatar}>SA</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{featuredPost.author}</span>
                  <span className={styles.publishDate}>{featuredPost.date}</span>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* Regular Posts Grid */}
        <section className={styles.grid}>
          {regularPosts.map(post => (
            <article 
              key={post.id} 
              className={styles.card}
              style={{
                "--card-glow-color": post.themeColor || "rgba(16, 185, 129, 0.3)",
                "--card-glow-color-light": post.glowColor || "rgba(16, 185, 129, 0.05)"
              } as React.CSSProperties}
              onClick={() => setSelectedPost(post)}
            >
              <div 
                className={styles.cardImage} 
                style={{ backgroundImage: `url(${post.imageUrl})` }}
              />
              <div className={styles.cardBody}>
                <div className={styles.metaRow} style={{ marginBottom: "0.85rem" }}>
                  <span className={styles.categoryBadge}>{post.category}</span>
                  <span className={styles.readTime}>
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.cardDesc}>{post.desc}</p>
                <div className={styles.authorRow}>
                  <div className={styles.avatar} style={{ width: 28, height: 28, fontSize: "0.75rem" }}>SA</div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName} style={{ fontSize: "0.75rem" }}>{post.author}</span>
                    <span className={styles.publishDate} style={{ fontSize: "0.65rem" }}>{post.date}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      {/* Reader View Modal */}
      {selectedPost && (
        <div className={styles.readerOverlay}>
          <div className={styles.readerHeader}>
            <button className={styles.readerBackBtn} onClick={() => setSelectedPost(null)}>
              <ArrowLeft size={16} />
              Geri Dön
            </button>
            <span className={styles.categoryBadge}>{selectedPost.category}</span>
          </div>

          <article className={styles.readerContainer}>
            <div className={styles.metaRow} style={{ marginBottom: "1.5rem" }}>
              <span className={styles.readTime}>
                <Clock size={14} />
                {selectedPost.readTime} Okuma Süresi
              </span>
              <span>•</span>
              <span className={styles.readTime}>
                <Calendar size={14} />
                {selectedPost.date}
              </span>
            </div>

            <h1 className={styles.readerTitle}>{selectedPost.title}</h1>

            <div className={styles.authorRow} style={{ marginBottom: "3rem" }}>
              <div className={styles.avatar} style={{ width: 44, height: 44, fontSize: "1rem" }}>SA</div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName} style={{ fontSize: "1rem" }}>{selectedPost.author}</span>
                <span className={styles.publishDate}>BorsaZeka Kurucusu</span>
              </div>
            </div>

            <div 
              className={styles.readerImage}
              style={{ backgroundImage: `url(${selectedPost.imageUrl})` }}
            />

            <div 
              className={styles.readerBody}
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
          </article>
        </div>
      )}
    </div>
  );
}
