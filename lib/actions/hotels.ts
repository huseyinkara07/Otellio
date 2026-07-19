"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { upsertHotel } from "@/lib/hotels";
import {
  validateHotelSettings,
  type HotelSettingsInput,
  type HotelSettingsErrors,
} from "@/lib/validation";
import { hotelSettings } from "@/lib/content";

export type SaveHotelSettingsResult =
  | { success: true }
  | { success: false; errors?: HotelSettingsErrors; message?: string };

export async function saveHotelSettings(
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

  try {
    await upsertHotel(supabase, user.id, {
      name: input.name.trim(),
      roomCount: Number(input.roomCount.trim()),
      basePrice: Number(input.basePrice.trim()),
    });
  } catch {
    return { success: false, message: hotelSettings.errors.generic };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/ayarlar");
  return { success: true };
}
