import { createClient } from "@/lib/supabase/server";
import { getHotelForUser } from "@/lib/hotels";
import HotelSettingsForm from "@/components/dashboard/HotelSettingsForm";

export default async function HotelSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hotel = user ? await getHotelForUser(supabase, user.id) : null;

  return (
    <div className="mx-auto max-w-xl">
      <HotelSettingsForm
        initialName={hotel?.name ?? ""}
        initialRoomCount={hotel ? String(hotel.room_count) : ""}
        initialBasePrice={hotel ? String(hotel.base_price) : ""}
        isFirstRun={!hotel}
      />
    </div>
  );
}
