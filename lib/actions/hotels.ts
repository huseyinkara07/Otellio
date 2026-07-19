"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  ACTIVE_HOTEL_COOKIE,
  createHotel,
  updateHotel,
} from "@/lib/hotels";
import {
  validateHotelSettings,
  type HotelSettingsInput,
  type HotelSettingsErrors,
} from "@/lib/validation";
import { hotelSettings } from "@/lib/content";

const ACTIVE_HOTEL_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

async function setActiveHotelCookie(hotelId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_HOTEL_COOKIE, hotelId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: ACTIVE_HOTEL_COOKIE_MAX_AGE,
  });
}

export type SaveHotelSettingsResult =
  | { success: true }
  | { success: false; errors?: HotelSettingsErrors; message?: string };

// hotelId null ise yeni tesis olusturulur (ilk kayit/onboarding ve "Yeni
// Tesis Ekle" akisi) ve aktif tesis olarak secilir; doluysa mevcut tesis
// guncellenir. Sahiplik dogrulamasi RLS'e dayanir (lib/hotels.ts notlari).
export async function saveHotelSettings(
  hotelId: string | null,
  input: HotelSettingsInput
): Promise<SaveHotelSettingsResult> {
  const errors = validateHotelSettings(input);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: hotelSettings.errors.generic };
  }

  const values = {
    name: input.name.trim(),
    roomCount: Number(input.roomCount.trim()),
    basePrice: Number(input.basePrice.trim()),
  };

  try {
    if (hotelId) {
      await updateHotel(supabase, hotelId, values);
    } else {
      const hotel = await createHotel(supabase, user.id, values);
      await setActiveHotelCookie(hotel.id);
    }
  } catch {
    return { success: false, message: hotelSettings.errors.generic };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export type SetActiveHotelResult = { success: boolean };

export async function setActiveHotel(
  hotelId: string
): Promise<SetActiveHotelResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false };
  }

  // RLS yalnizca kullanicinin kendi tesislerini gorunur kilar; kayit
  // donmezse hotelId ya baskasina ait ya da mevcut degil demektir.
  const { data: hotel } = await supabase
    .from("hotels")
    .select("id")
    .eq("id", hotelId)
    .maybeSingle();

  if (!hotel) {
    return { success: false };
  }

  await setActiveHotelCookie(hotel.id);
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
