import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getHotelForUser } from "@/lib/hotels";
import { getReservationsForHotel } from "@/lib/reservations";
import { computeOccupancyForecast } from "@/lib/forecast/simpleForecast";
import { computePriceSuggestions } from "@/lib/forecast/priceSuggestion";
import { priceSuggestionPage } from "@/lib/content";

const HORIZON_DAYS = 30;

export default async function PriceSuggestionRoutePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hotel = user ? await getHotelForUser(supabase, user.id) : null;
  const reservations = hotel
    ? await getReservationsForHotel(supabase, hotel.id)
    : [];

  const forecast = hotel
    ? computeOccupancyForecast(reservations, hotel.room_count, HORIZON_DAYS)
    : ({ status: "insufficient_data", daysOfHistory: 0 } as const);

  const showEmptyState = !hotel || forecast.status === "insufficient_data";

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">
        {priceSuggestionPage.title}
      </h1>
      <p className="mt-2 text-sm text-muted">{priceSuggestionPage.subtitle}</p>

      {showEmptyState || forecast.status !== "ok" || !hotel ? (
        <div className="mt-8 rounded-card bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-navy">
            {priceSuggestionPage.insufficientDataTitle}
          </h2>
          <p className="mt-2 text-muted">
            {priceSuggestionPage.insufficientDataBody}
          </p>
          <Link
            href="/dashboard/veri-yukle"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110"
          >
            {priceSuggestionPage.uploadCta}
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted">
            {priceSuggestionPage.basePriceLabel}:{" "}
            <span className="font-semibold text-navy">
              {hotel.base_price} TL
            </span>{" "}
            <Link
              href="/dashboard/ayarlar"
              className="underline hover:text-accent"
            >
              {priceSuggestionPage.editBasePriceLink}
            </Link>
          </p>

          <div className="rounded-card bg-white p-6 shadow-sm">
            <div className="max-h-96 overflow-y-auto overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-muted">
                    <th className="py-2 pr-4">
                      {priceSuggestionPage.columnDate}
                    </th>
                    <th className="py-2 pr-4">
                      {priceSuggestionPage.columnOccupancy}
                    </th>
                    <th className="py-2 pr-4">
                      {priceSuggestionPage.columnSuggestedPrice}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {computePriceSuggestions(
                    forecast.points,
                    hotel.base_price
                  ).map((p) => (
                    <tr
                      key={p.date}
                      className="border-b border-black/5 text-ink"
                    >
                      <td className="py-2 pr-4">{p.date}</td>
                      <td className="py-2 pr-4">
                        {Math.round(p.occupancyRate * 100)}%
                      </td>
                      <td className="py-2 pr-4 font-semibold">
                        {p.suggestedPrice} TL
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-muted">{priceSuggestionPage.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
