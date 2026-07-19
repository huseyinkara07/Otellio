import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getHotelForUser } from "@/lib/hotels";
import { getReservationsForHotel } from "@/lib/reservations";
import { computeOccupancyForecast } from "@/lib/forecast/simpleForecast";
import { computePriceSuggestions } from "@/lib/forecast/priceSuggestion";
import { overview } from "@/lib/content";

const WEEK_HORIZON_DAYS = 7;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hotel = user ? await getHotelForUser(supabase, user.id) : null;
  const reservations = hotel
    ? await getReservationsForHotel(supabase, hotel.id)
    : [];

  if (!hotel || reservations.length === 0) {
    return (
      <div className="rounded-card bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-navy">
          {overview.noDataTitle}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">{overview.noDataBody}</p>
        <Link
          href="/dashboard/veri-yukle"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110"
        >
          {overview.uploadCta}
        </Link>
      </div>
    );
  }

  const forecast = computeOccupancyForecast(
    reservations,
    hotel.room_count,
    WEEK_HORIZON_DAYS
  );

  const weekAvgOccupancy =
    forecast.status === "ok"
      ? Math.round(
          (forecast.points.reduce((sum, p) => sum + p.occupancyRate, 0) /
            forecast.points.length) *
            100
        )
      : null;

  const avgSuggestedPrice =
    forecast.status === "ok"
      ? Math.round(
          computePriceSuggestions(forecast.points, hotel.base_price).reduce(
            (sum, p) => sum + p.suggestedPrice,
            0
          ) / forecast.points.length
        )
      : null;

  const lastUploadTimestamp = reservations.reduce(
    (latest, r) => (r.created_at > latest ? r.created_at : latest),
    reservations[0].created_at
  );
  const lastUploadDisplay = new Date(lastUploadTimestamp).toLocaleDateString(
    "tr-TR"
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">{overview.title}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={overview.statRoomCount}
          value={String(hotel.room_count)}
        />
        <StatCard
          label={overview.statLastUpload}
          value={lastUploadDisplay}
        />
        <StatCard
          label={overview.statAvgOccupancy}
          value={weekAvgOccupancy !== null ? `%${weekAvgOccupancy}` : "—"}
        />
        <StatCard
          label={overview.statAvgPrice}
          value={avgSuggestedPrice !== null ? `${avgSuggestedPrice} TL` : "—"}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-white p-6 shadow-sm">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-2 text-2xl font-bold text-navy">{value}</div>
    </div>
  );
}
