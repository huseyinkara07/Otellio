import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getHotelForUser } from "@/lib/hotels";
import { upsertReservations, type ReservationInput } from "@/lib/reservations";
import { MAX_ROWS } from "@/lib/reservationParsing";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidRow(row: unknown): row is ReservationInput {
  if (!row || typeof row !== "object") return false;
  const r = row as Record<string, unknown>;
  if (typeof r.stayDate !== "string" || !DATE_REGEX.test(r.stayDate)) return false;
  if (
    typeof r.roomsSold !== "number" ||
    !Number.isInteger(r.roomsSold) ||
    r.roomsSold < 0
  ) {
    return false;
  }
  if (
    r.revenue !== null &&
    (typeof r.revenue !== "number" || !Number.isFinite(r.revenue) || r.revenue < 0)
  ) {
    return false;
  }
  return true;
}

// Middleware /api/* rotalarini korumaz (yalnizca /dashboard*); bu yuzden
// yetkilendirme burada bagimsiz olarak dogrulanir.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }

  const hotel = await getHotelForUser(supabase, user.id);
  if (!hotel) {
    return NextResponse.json(
      { success: false, message: "hotel_not_found" },
      { status: 400 }
    );
  }

  let body: { rows?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "invalid_json" },
      { status: 400 }
    );
  }

  const rawRows = Array.isArray(body.rows) ? body.rows : [];
  if (rawRows.length === 0) {
    return NextResponse.json(
      { success: false, message: "no_rows" },
      { status: 400 }
    );
  }
  if (rawRows.length > MAX_ROWS) {
    return NextResponse.json(
      { success: false, message: "too_many_rows" },
      { status: 400 }
    );
  }

  // Istemci tarafi ayristirma/dogrulama zaten yapildi (lib/reservationParsing.ts),
  // ama istemciye asla guvenilmez: sekil/aralik kontrolu burada tekrarlanir.
  const validRows = rawRows.filter(isValidRow);
  if (validRows.length === 0) {
    return NextResponse.json(
      { success: false, message: "no_valid_rows" },
      { status: 400 }
    );
  }

  try {
    const savedCount = await upsertReservations(supabase, hotel.id, validRows);
    return NextResponse.json({ success: true, savedCount });
  } catch (error) {
    console.error("reservations upsert hatasi:", error);
    return NextResponse.json(
      { success: false, message: "server_error" },
      { status: 500 }
    );
  }
}
