import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { buildWeeklyReport } from "@/lib/email/weeklyReport";

// Haftalik rapor cron rotasi. Zamanlanmis gorev (ör. Vercel Cron,
// vercel.json'daki tanim) tarafindan "Authorization: Bearer <CRON_SECRET>"
// basligiyla cagrilir; Vercel, CRON_SECRET ortam degiskeni tanimliysa bu
// basligi otomatik ekler.
//
// Tum otellerin verisi okunmasi gerektigi icin RLS'li supabase-js istemcisi
// degil, dogrudan Postgres baglantisi (lib/db.ts) kullanilir; rota disaridan
// yalnizca CRON_SECRET ile cagrilabilir.

type HotelRow = {
  id: string;
  name: string;
  room_count: number;
  base_price: string | number; // numeric kolonu pg'den string gelebilir
  email: string;
};

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.REPORT_FROM_EMAIL;

  if (!cronSecret || !resendApiKey || !fromEmail) {
    return NextResponse.json(
      { success: false, message: "not_configured" },
      { status: 503 }
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://otellio.com";

  try {
    const { rows: hotels } = await pool.query<HotelRow>(
      `select h.id, h.name, h.room_count, h.base_price, u.email
         from hotels h
         join auth.users u on u.id = h.user_id
        where u.email is not null`
    );

    const results: { hotel: string; status: string }[] = [];

    for (const hotel of hotels) {
      const { rows: reservations } = await pool.query<{
        stay_date: string;
        rooms_sold: number;
      }>(
        `select to_char(stay_date, 'YYYY-MM-DD') as stay_date, rooms_sold
           from reservations
          where hotel_id = $1
          order by stay_date`,
        [hotel.id]
      );

      const report = buildWeeklyReport({
        hotelName: hotel.name,
        roomCount: hotel.room_count,
        basePrice: Number(hotel.base_price),
        reservations,
        baseUrl,
      });

      // Tahmin icin yeterli verisi olmayan otele bos rapor gonderilmez.
      if (!report) {
        results.push({ hotel: hotel.name, status: "skipped_insufficient_data" });
        continue;
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: hotel.email,
          subject: report.subject,
          html: report.html,
        }),
      });

      if (response.ok) {
        results.push({ hotel: hotel.name, status: "sent" });
      } else {
        const errorBody = await response.text().catch(() => "");
        console.error(
          `haftalik rapor gonderilemedi (${hotel.name}):`,
          response.status,
          errorBody
        );
        results.push({ hotel: hotel.name, status: "failed" });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("haftalik rapor cron hatasi:", error);
    return NextResponse.json(
      { success: false, message: "server_error" },
      { status: 500 }
    );
  }
}
