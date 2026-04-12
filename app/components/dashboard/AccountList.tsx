"use client";

import { CheckCircle2, MoreVertical, ShieldCheck, Wallet, Globe } from "lucide-react";

interface BrokerAccount {
  id: string;
  accountType: string;
  institution: string;
  accountNo: string;
  robotName: string;
  isActive: boolean;
  createdAt: Date;
}

interface Props {
  initialAccounts: BrokerAccount[];
}

export default function AccountList({ initialAccounts }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {initialAccounts.map((acc) => (
        <div
          key={acc.id}
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.2s",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: acc.accountType === "BIST" ? "#10b981" : "#fbbf24"
              }}
            >
              {acc.accountType === "BIST" ? <Wallet size={24} /> : <Globe size={24} />}
            </div>
            
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {acc.institution}
                </h4>
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "0.15rem 0.4rem",
                    borderRadius: "4px",
                    backgroundColor: acc.isActive ? "rgba(16, 185, 129, 0.1)" : "rgba(251, 191, 36, 0.1)",
                    color: acc.isActive ? "#10b981" : "#fbbf24",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem"
                  }}
                >
                  <CheckCircle2 size={10} />
                  {acc.isActive ? "Aktif" : "Beklemede"}
                </div>
                {acc.robotName && (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                    {acc.robotName}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Hesap No: {acc.accountNo}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ textAlign: "right", display: "none" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Bağlanma Tarihi</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                {new Date(acc.createdAt).toLocaleDateString("tr-TR")}
              </p>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981" }}>
              <ShieldCheck size={18} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Güvenli</span>
            </div>

            <button style={{ color: "var(--text-muted)", padding: "0.5rem" }}>
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      ))}

      {initialAccounts.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", border: "1px dashed var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
          <p style={{ color: "var(--text-muted)" }}>Henüz bir hesap bağlamadınız.</p>
        </div>
      )}
    </div>
  );
}
