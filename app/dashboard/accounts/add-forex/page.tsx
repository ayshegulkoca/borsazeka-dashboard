"use client";

import ForexAccountForm from "./ForexAccountForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AddForexPage() {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem 0" }}>
      <Link 
        href="/dashboard/accounts" 
        style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "0.4rem", 
          fontSize: "0.85rem", 
          color: "var(--text-muted)",
          textDecoration: "none",
          marginBottom: "1.5rem",
          transition: "color 0.2s"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
      >
        <ChevronLeft size={16} />
        Hesaplarıma Geri Dön
      </Link>

      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "20px",
        padding: "2rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
      }}>
        <ForexAccountForm />
      </div>
    </div>
  );
}
