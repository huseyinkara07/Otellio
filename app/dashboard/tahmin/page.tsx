import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getHotelForUser } from "@/lib/hotels";
import { getReservationsForHotel } from "@/lib/reservations";
import { computeOccupancyForecast } from "@/lib/forecast/simpleForecast";
import { forecastPage } from "@/lib/content";
import OccupancyChart from "@/components/dashboard/OccupancyChart";

const RANGE_OPTIONS = [
  { value: "30", days: 30, label: forecastPage.range30 },
  { value: "60", days: 60, label: forecastPage.range60 },
  { value: "90", days: 90, label: forecastPage.range90 },
];

export default async function ForecastRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const horizonDays =
    RANGE_OPTIONS.find((option) => option.value === range)?.days ?? 30;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hotel = user ? await getHotelForUser(supabase, user.id) : null;
  const reservations = hotel
    ? await getReservationsForHotel(supabase, hotel.id)
    : [];

  const forecast = hotel
    ? computeOccupancyForecast(reservations, hotel.room_count, horizonDays)
    : ({ status: "insufficient_data", daysOfHistory: 0 } as const);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">{forecastPage.title}</h1>
      <p className="mt-2 text-sm text-muted">{forecastPage.subtitle}</p>

      {forecast.status === "insufficient_data" ? (
        <div className="mt-8 rounded-card bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-navy">
            {forecastPage.insufficientDataTitle}
          </h2>
          <p className="mt-2 text-muted">{forecastPage.insufficientDataBody}</p>
          <Link
            href="/dashboard/veri-yukle"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110"
          >
            {forecastPage.uploadCta}
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="flex gap-2">
            {RANGE_OPTIONS.map((option) => (
              <Link
                key={option.value}
                href={`/dashboard/tahmin?range=${option.value}`}
                className={`inline-flex h-10 items-center justify-center rounded-button border px-4 text-sm font-semibold ${
                  horizonDays === option.days
                    ? "border-navy bg-navy text-white"
                    : "border-black/15 text-navy hover:bg-sand"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>

          <div className="rounded-card bg-white p-6 shadow-sm">
            <OccupancyChart points={forecast.points} />
          </div>

          <div className="rounded-card bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-navy">
              {forecastPage.tableTitle}
            </h2>
            <div className="mt-4 max-h-96 overflow-y-auto overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-muted">
                    <th className="py-2 pr-4">{forecastPage.columnDate}</th>
                    <th className="py-2 pr-4">{forecastPage.columnOccupancy}</th>
                    <th className="py-2 pr-4">{forecastPage.columnRange}</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.points.map((p) => (
                    <tr
                      key={p.date}
                      className="border-b border-black/5 text-ink"
                    >
                      <td className="py-2 pr-4">{p.date}</td>
                      <td className="py-2 pr-4">
                        {Math.round(p.occupancyRate * 100)}%
                      </td>
                      <td className="py-2 pr-4">
                        {Math.round(p.lowerBound * 100)}%–
                        {Math.round(p.upperBound * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-muted">{forecastPage.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
