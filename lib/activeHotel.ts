// Server component'ler icin aktif tesis yardimcisi. next/headers'a bagimli
// oldugundan route handler'larda KULLANILMAZ; onlar cookie'yi request
// uzerinden okuyup pickActiveHotel'i dogrudan cagirir
// (bkz. app/api/reservations/route.ts).

import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ACTIVE_HOTEL_COOKIE,
  getHotelsForUser,
  pickActiveHotel,
  type Hotel,
} from "./hotels";

export type ActiveHotelContext = {
  hotels: Hotel[];
  hotel: Hotel | null;
};

export async function getActiveHotelContext(
  supabase: SupabaseClient,
  userId: string
): Promise<ActiveHotelContext> {
  const hotels = await getHotelsForUser(supabase, userId);
  const cookieStore = await cookies();
  const hotel = pickActiveHotel(
    hotels,
    cookieStore.get(ACTIVE_HOTEL_COOKIE)?.value
  );
  return { hotels, hotel };
}
