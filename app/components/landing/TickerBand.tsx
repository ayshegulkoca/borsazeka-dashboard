"use client";

import { useEffect, useRef, useState } from "react";
import s from "./ticker-band.module.css";

/* ─── Ticker Data ─────────────────────────────────────────────────────────── */
const TICKERS = [
  { symbol: "BIST 100",  value: "9.847,22",  change: "+1.24" },
  { symbol: "USD/TRY",   value: "32,4810",   change: "-0.31" },
  { symbol: "EUR/TRY",   value: "34,9260",   change: "+0.18" },
  { symbol: "ALTIN/GR",  value: "2.814,50",  change: "+0.95" },
  { symbol: "BTC/USDT",  value: "67.412",    change: "+2.41" },
  { symbol: "ETH/USDT",  value: "3.248,90",  change: "+1.87" },
  { symbol: "XAU/USD",   value: "2.338,40",  change: "+0.63" },
  { symbol: "GARAN",     value: "104,75",    change: "+3.12" },
  { symbol: "THYAO",     value: "289,40",    change: "-0.68" },
  { symbol: "ASELS",     value: "62,30",     change: "+1.55" },
];

/* Simüle edilmiş küçük fiyat dalgalanmaları */
function useLiveValues(initial: typeof TICKERS) {
  const [items, setItems] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => {
          const drift = (Math.random() - 0.49) * 0.08;
          const raw = parseFloat(item.value.replace(/\./g, "").replace(",", "."));
          const next = raw + raw * drift;
          const changed = parseFloat(item.change) + (Math.random() - 0.48) * 0.05;
          return {
            ...item,
            value: next.toLocaleString("tr-TR", {
              minimumFractionDigits: item.value.includes(",") ? 2 : 0,
              maximumFractionDigits: 2,
            }),
            change: (changed >= 0 ? "+" : "") + changed.toFixed(2),
          };
        })
      );
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return items;
}

/* ─── Single Tick Item ────────────────────────────────────────────────────── */
function TickItem({ symbol, value, change }: { symbol: string; value: string; change: string }) {
  const up = !change.startsWith("-");
  return (
    <div className={s.tickItem}>
      <span className={s.tickSymbol}>{symbol}</span>
      <span className={s.tickValue}>{value}</span>
      <span className={`${s.tickChange} ${up ? s.tickUp : s.tickDown}`}>
        {up ? "▲" : "▼"} {change}%
      </span>
      <span className={s.tickDot} aria-hidden="true">•</span>
    </div>
  );
}

/* ─── Main Ticker Band ────────────────────────────────────────────────────── */
export default function TickerBand() {
  const items = useLiveValues(TICKERS);
  // Duplicate 3× for seamless loop
  const repeated = [...items, ...items, ...items];

  return (
    <div className={s.band} aria-label="Canlı piyasa verileri" role="marquee">
      {/* Left / Right fade masks */}
      <div className={s.fadeMaskLeft}  aria-hidden="true" />
      <div className={s.fadeMaskRight} aria-hidden="true" />

      <div className={s.track}>
        {repeated.map((item, i) => (
          <TickItem key={`${item.symbol}-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}
