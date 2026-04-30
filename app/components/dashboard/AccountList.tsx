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
            backgroundColor: "#0A0A0A",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "24px",
            padding: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(55, 48, 163, 0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(55, 48, 163, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: acc.accountType === "BIST" ? "#3730A3" : "#fbbf24",
                border: "1px solid rgba(55, 48, 163, 0.1)"
              }}
            >
              {acc.accountType === "BIST" ? <Wallet size={20} strokeWidth={1.5} /> : <Globe size={20} strokeWidth={1.5} />}
            </div>
            
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 200, color: "#ffffff", letterSpacing: '0.02em' }}>
                  {acc.institution}
                </h4>
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "100px",
                    backgroundColor: acc.isActive ? "rgba(55, 48, 163, 0.1)" : "rgba(251, 191, 36, 0.1)",
                    color: acc.isActive ? "#3730A3" : "#fbbf24",
                    border: "1px solid " + (acc.isActive ? "rgba(55, 48, 163, 0.2)" : "rgba(251, 191, 36, 0.2)"),
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}
                >
                  <CheckCircle2 size={10} />
                  {acc.isActive ? "Aktif" : "Beklemede"}
                </div>
                {acc.robotName && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 200, color: "#71717A", background: "rgba(255,255,255,0.03)", padding: "0.15rem 0.5rem", borderRadius: "100px", border: '1px solid rgba(255,255,255,0.05)' }}>
                    {acc.robotName}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "0.85rem", fontWeight: 200, color: "#71717A", marginTop: "0.2rem" }}>
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
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#3730A3" }}>
              <ShieldCheck size={16} strokeWidth={1.5} />
              <span style={{ fontSize: "0.75rem", fontWeight: 400 }}>Güvenli</span>
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
