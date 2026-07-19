import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getActiveHotelContext } from "@/lib/activeHotel";
import { hotelSettings } from "@/lib/content";
import HotelSettingsForm from "@/components/dashboard/HotelSettingsForm";

// ?yeni=1 ile gelindiginde form yeni tesis olusturma modunda calisir
// (Kurumsal paketin coklu tesis destegi); aksi halde aktif tesis duzenlenir.
export default async function HotelSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ yeni?: string }>;
}) {
  const { yeni } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { hotel } = user
    ? await getActiveHotelContext(supabase, user.id)
    : { hotel: null };

  const isNewMode = yeni === "1" && hotel !== null;
  const targetHotel = isNewMode ? null : hotel;

  return (
    <div className="mx-auto max-w-xl">
      <HotelSettingsForm
        key={isNewMode ? "yeni" : (targetHotel?.id ?? "ilk")}
        hotelId={targetHotel?.id ?? null}
        initialName={targetHotel?.name ?? ""}
        initialRoomCount={targetHotel ? String(targetHotel.room_count) : ""}
        initialBasePrice={targetHotel ? String(targetHotel.base_price) : ""}
        isFirstRun={!hotel}
        isNewMode={isNewMode}
      />

      {hotel && !isNewMode && (
        <div className="mt-4 text-right">
          <Link
            href="/dashboard/ayarlar?yeni=1"
            className="text-sm font-medium text-navy underline hover:text-accent"
          >
            {hotelSettings.newHotelCta}
          </Link>
        </div>
      )}
    </div>
  );
}
