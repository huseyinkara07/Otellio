import type { SupabaseClient } from "@supabase/supabase-js";

export type Hotel = {
  id: string;
  user_id: string;
  name: string;
  room_count: number;
  base_price: number;
  created_at: string;
};

export async function getHotelForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Hotel | null> {
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertHotel(
  supabase: SupabaseClient,
  userId: string,
  input: { name: string; roomCount: number; basePrice: number }
): Promise<Hotel> {
  const { data, error } = await supabase
    .from("hotels")
    .upsert(
      {
        user_id: userId,
        name: input.name,
        room_count: input.roomCount,
        base_price: input.basePrice,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
