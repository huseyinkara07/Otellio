import type { SupabaseClient } from "@supabase/supabase-js";

export type Reservation = {
  id: string;
  hotel_id: string;
  stay_date: string;
  rooms_sold: number;
  revenue: number | null;
  created_at: string;
};

export type ReservationInput = {
  stayDate: string;
  roomsSold: number;
  revenue: number | null;
};

export async function getReservationsForHotel(
  supabase: SupabaseClient,
  hotelId: string
): Promise<Reservation[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("hotel_id", hotelId)
    .order("stay_date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// Supabase/PostgREST tek istekte cok fazla satiri kabul etmeyebilir; buyuk
// yuklemeleri kucuk partiler halinde gonderiyoruz.
const UPSERT_BATCH_SIZE = 500;

export async function upsertReservations(
  supabase: SupabaseClient,
  hotelId: string,
  rows: ReservationInput[]
): Promise<number> {
  let saved = 0;
  for (let i = 0; i < rows.length; i += UPSERT_BATCH_SIZE) {
    const batch = rows.slice(i, i + UPSERT_BATCH_SIZE).map((row) => ({
      hotel_id: hotelId,
      stay_date: row.stayDate,
      rooms_sold: row.roomsSold,
      revenue: row.revenue,
    }));

    const { error } = await supabase
      .from("reservations")
      .upsert(batch, { onConflict: "hotel_id,stay_date" });

    if (error) throw error;
    saved += batch.length;
  }
  return saved;
}
