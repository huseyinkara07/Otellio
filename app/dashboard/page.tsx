import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getActiveHotelContext } from "@/lib/activeHotel";
import { getReservationsForHotel } from "@/lib/reservations";
import {
  computeOccupancyForecast,
  type ForecastPoint,
} from "@/lib/forecast/simpleForecast";
import { computePriceSuggestions } from "@/lib/forecast/priceSuggestion";
import { overview, forecastPage } from "@/lib/content";
import OccupancyChart from "@/components/dashboard/OccupancyChart";

const OVERVIEW_HORIZON_DAYS = 30;
const WEEK_HORIZON_DAYS = 7;
// Otelcinin aksiyon almasi gereken gunler: cok dolu gorunen gunlerde fiyat
// firsati, cok sakin gorunen gunlerde satis riski vardir. Esikler tahmin
// dilimleriyle (priceSuggestion) uyumlu secildi.
const BUSY_THRESHOLD = 0.8;
const QUIET_THRESHOLD = 0.5;
const MAX_HIGHLIGHT_DAYS = 3;

function formatDayLong(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hotel = user
    ? (await getActiveHotelContext(supabase, user.id)).hotel
    : null;
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
    OVERVIEW_HORIZON_DAYS
  );

  const weekPoints =
    forecast.status === "ok"
      ? forecast.points.slice(0, WEEK_HORIZON_DAYS)
      : [];

  const weekAvgOccupancy =
    weekPoints.length > 0
      ? Math.round(
          (weekPoints.reduce((sum, p) => sum + p.occupancyRate, 0) /
            weekPoints.length) *
            100
        )
      : null;

  const avgSuggestedPrice =
    weekPoints.length > 0
      ? Math.round(
          computePriceSuggestions(weekPoints, hotel.base_price).reduce(
            (sum, p) => sum + p.suggestedPrice,
            0
          ) / weekPoints.length
        )
      : null;

  const lastUploadTimestamp = reservations.reduce(
    (latest, r) => (r.created_at > latest ? r.created_at : latest),
    reservations[0].created_at
  );
  const lastUploadDisplay = new Date(lastUploadTimestamp).toLocaleDateString(
    "tr-TR"
  );

  const priceByDate = new Map(
    forecast.status === "ok"
      ? computePriceSuggestions(forecast.points, hotel.base_price).map((p) => [
          p.date,
          p.suggestedPrice,
        ])
      : []
  );

  const busyDays =
    forecast.status === "ok"
      ? forecast.points
          .filter((p) => p.occupancyRate >= BUSY_THRESHOLD)
          .sort((a, b) => b.occupancyRate - a.occupancyRate)
          .slice(0, MAX_HIGHLIGHT_DAYS)
      : [];

  const quietDays =
    forecast.status === "ok"
      ? forecast.points
          .filter((p) => p.occupancyRate <= QUIET_THRESHOLD)
          .sort((a, b) => a.occupancyRate - b.occupancyRate)
          .slice(0, MAX_HIGHLIGHT_DAYS)
      : [];

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

      {forecast.status === "ok" ? (
        <div className="mt-6 space-y-6">
          <div className="rounded-card bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-navy">
                {overview.forecastCardTitle}
              </h2>
              <Link
                href="/dashboard/tahmin"
                className="text-sm font-medium text-navy underline hover:text-accent"
              >
                {overview.forecastDetailLink}
              </Link>
            </div>
            <div className="mt-4">
              <OccupancyChart points={forecast.points} />
            </div>
          </div>

          {(busyDays.length > 0 || quietDays.length > 0) && (
            <section>
              <h2 className="text-lg font-semibold text-navy">
                {overview.highlightsTitle}
              </h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {busyDays.length > 0 && (
                  <HighlightCard
                    title={overview.busyTitle}
                    hint={overview.busyHint}
                    days={busyDays}
                    priceByDate={priceByDate}
                    tone="busy"
                  />
                )}
                {quietDays.length > 0 && (
                  <HighlightCard
                    title={overview.quietTitle}
                    hint={overview.quietHint}
                    days={quietDays}
                    priceByDate={priceByDate}
                    tone="quiet"
                  />
                )}
              </div>
              <p className="mt-3 text-xs text-muted">
                {overview.highlightsDisclaimer}
              </p>
            </section>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-card bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-navy">
            {forecastPage.insufficientDataTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            {forecastPage.insufficientDataBody}
          </p>
          <Link
            href="/dashboard/veri-yukle"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110"
          >
            {overview.uploadCta}
          </Link>
        </div>
      )}
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

function HighlightCard({
  title,
  hint,
  days,
  priceByDate,
  tone,
}: {
  title: string;
  hint: string;
  days: ForecastPoint[];
  priceByDate: Map<string, number>;
  tone: "busy" | "quiet";
}) {
  return (
    <div className="rounded-card bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            tone === "busy" ? "bg-accent" : "bg-teal"
          }`}
        />
        <h3 className="font-semibold text-navy">{title}</h3>
      </div>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      <ul className="mt-4 space-y-3">
        {days.map((day) => (
          <li
            key={day.date}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-black/5 pb-3 last:border-b-0 last:pb-0"
          >
            <span className="font-medium text-ink">
              {formatDayLong(day.date)}
            </span>
            <span className="text-sm text-muted">
              {overview.occupancyLabel}:{" "}
              <span className="font-semibold text-navy">
                %{Math.round(day.occupancyRate * 100)}
              </span>
              {" · "}
              {overview.suggestedPriceLabel}:{" "}
              <span className="font-semibold text-navy">
                {priceByDate.get(day.date)} TL
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
