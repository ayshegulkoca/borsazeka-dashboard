import { NextRequest, NextResponse } from "next/server";

// ─── Lead Payload Type ───────────────────────────────────────────────────────
export interface LeadPayload {
  // Sihirbaz Seçimleri
  market: "BIST" | "CRYPTO" | "FOREX";
  subMarket?: string;
  managementType: "PREMIUM" | "SELF_SERVICE";
  robotId: string;
  robotName: string;

  // Bütçe
  budgetValue: number;
  budgetCurrency: "TRY" | "USD";

  // Hesaplanan Fiyatlandırma
  setupFeeEUR: number;
  serverCostEUR: number;
  profitSharePercent: number;
  totalMonthlyCostEUR: number;

  // İletişim (opsiyonel — ilerleyen aşamada form eklenir)
  name?: string;
  email?: string;
  phone?: string;

  // Meta
  timestamp: string;
  source: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadPayload = await req.json();

    // ── Temel doğrulama ───────────────────────────────────────────────────────
    if (!body.market || !body.robotId || !body.budgetValue) {
      return NextResponse.json(
        { error: "Eksik alan: market, robotId veya budgetValue gerekli." },
        { status: 400 }
      );
    }

    const payload: LeadPayload = {
      ...body,
      timestamp: new Date().toISOString(),
      source: "wizard",
    };

    // ── Konsol logu (geliştirme aşaması) ──────────────────────────────────────
    console.log("[BorsaZeka Lead]", JSON.stringify(payload, null, 2));

    // ── TODO: Google Sheets API buraya bağlanacak ────────────────────────────
    // const sheetsId = process.env.GOOGLE_SHEETS_ID;
    // const serviceKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    // if (sheetsId && serviceKey) {
    //   await appendToSheet(sheetsId, serviceKey, payload);
    // }

    // ── TODO: N8N Webhook tetiklenecek ───────────────────────────────────────
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nUrl) {
      try {
        await fetch(n8nUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (webhookErr) {
        // webhook hatası lead kaydını engellemez
        console.warn("[N8N Webhook] İstek başarısız:", webhookErr);
      }
    }

    // ── TODO: Stripe ödeme oturumu burada oluşturulacak ──────────────────────
    // const stripeSession = await stripe.checkout.sessions.create({ ... });
    // return NextResponse.json({ checkoutUrl: stripeSession.url });

    return NextResponse.json(
      {
        success: true,
        message: "Lead kaydedildi.",
        // checkoutUrl: "/checkout" // Stripe entegrasyonunda bu dolu olacak
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/leads] Hata:", err);
    return NextResponse.json(
      { error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
