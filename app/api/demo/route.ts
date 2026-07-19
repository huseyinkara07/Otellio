import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { validateDemoForm, type DemoFormInput } from "@/lib/validation";

// PRD Bolum 8-B: sunucu tarafi validation, rate limiting, bot korumasi ve
// verinin guvenli sekilde saklanmasi burada karsilaniyor.
//
// Rate limit: bellek ici (in-memory) sayac. Tek instance icin yeterli;
// birden fazla sunucu instance'i (ör. Vercel serverless, coklu region)
// arasinda paylasilmaz. Ileride olcek gerekirse Redis/Upstash gibi paylasimli
// bir store'a tasinmali.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

// Penceresi dolmus IP kayitlari haritadan tamamen silinir; aksi halde her
// yeni IP kalici bir girdi birakir ve bellek zamanla sinirsiz buyur.
function pruneStaleEntries(now: number): void {
  for (const [ip, timestamps] of requestLog) {
    if (timestamps.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
      requestLog.delete(ip);
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneStaleEntries(now);
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

type DemoRequestBody = DemoFormInput & { company?: string };

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "rate_limited" },
      { status: 429 }
    );
  }

  let body: DemoRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "invalid_json" },
      { status: 400 }
    );
  }

  // Honeypot: gercek kullanicilar bu alani gormez/doldurmaz. Doluysa
  // botlara ipucu vermeden basariliymis gibi sessizce yok sayilir.
  if (body.company) {
    return NextResponse.json({ success: true });
  }

  const values: DemoFormInput = {
    hotelName: typeof body.hotelName === "string" ? body.hotelName : "",
    roomCount: typeof body.roomCount === "string" ? body.roomCount : "",
    email: typeof body.email === "string" ? body.email : "",
    phone: typeof body.phone === "string" ? body.phone : "",
    message: typeof body.message === "string" ? body.message : "",
    kvkk: body.kvkk === true,
  };

  const errors = validateDemoForm(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  try {
    await pool.query(
      `INSERT INTO demo_talepleri (otel_adi, oda_sayisi, email, telefon, mesaj, kvkk_onay)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        values.hotelName.trim(),
        Number(values.roomCount.trim()),
        values.email.trim(),
        values.phone.trim(),
        values.message.trim() || null,
        values.kvkk,
      ]
    );
  } catch (error) {
    console.error("demo_talepleri insert hatasi:", error);
    return NextResponse.json(
      { success: false, message: "server_error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
