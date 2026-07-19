import type { SupabaseClient } from "@supabase/supabase-js";

export type Hotel = {
  id: string;
  user_id: string;
  name: string;
  room_count: number;
  base_price: number;
  created_at: string;
};

// Panelin o an hangi tesisi gosterdigi bu cookie ile tutulur (0003
// migration'i ile kullanici basina birden fazla tesis destekleniyor).
// Cookie yalnizca sunucu tarafinda okunur/yazilir (httpOnly).
export const ACTIVE_HOTEL_COOKIE = "otellio-aktif-tesis";

export async function getHotelsForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// Cookie'deki tesis artik mevcut degilse (silinmis/baska kullanicinin
// cookie'si) sessizce ilk tesise duser; hic tesis yoksa null doner ve
// middleware kullaniciyi onboarding'e yonlendirir.
export function pickActiveHotel(
  hotels: Hotel[],
  activeHotelId: string | null | undefined
): Hotel | null {
  return hotels.find((h) => h.id === activeHotelId) ?? hotels[0] ?? null;
}

export async function createHotel(
  supabase: SupabaseClient,
  userId: string,
  input: { name: string; roomCount: number; basePrice: number }
): Promise<Hotel> {
  const { data, error } = await supabase
    .from("hotels")
    .insert({
      user_id: userId,
      name: input.name,
      room_count: input.roomCount,
      base_price: input.basePrice,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHotel(
  supabase: SupabaseClient,
  hotelId: string,
  input: { name: string; roomCount: number; basePrice: number }
): Promise<Hotel> {
  // RLS sahiplik disindaki satirlari gormez; baska kullanicinin tesisi
  // hedeflenirse guncelleme 0 satir etkiler ve single() hata firlatir.
  const { data, error } = await supabase
    .from("hotels")
    .update({
      name: input.name,
      room_count: input.roomCount,
      base_price: input.basePrice,
    })
    .eq("id", hotelId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
