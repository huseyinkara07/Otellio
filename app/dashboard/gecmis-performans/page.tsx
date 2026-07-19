import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getHotelForUser } from "@/lib/hotels";
import { getReservationsForHotel } from "@/lib/reservations";
import {
  summarizeMonthlyPerformance,
  type MonthlyPerformanceRow,
} from "@/lib/performance";
import { performancePage } from "@/lib/content";

// Cok uzun gecmisi olan otellerde tablo okunabilir kalsin diye son 24 ay
// gosterilir; daha eski aylar tahmin motorunda kullanilmaya devam eder.
const MAX_MONTHS = 24;

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(value: number): string {
  return `${Math.round(value).toLocaleString("tr-TR")} TL`;
}

export default async function PerformanceRoutePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const hotel = user ? await getHotelForUser(supabase, user.id) : null;
  const reservations = hotel
    ? await getReservationsForHotel(supabase, hotel.id)
    : [];

  const rows = hotel
    ? summarizeMonthlyPerformance(reservations, hotel.room_count).slice(
        0,
        MAX_MONTHS
      )
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">{performancePage.title}</h1>
      <p className="mt-2 text-sm text-muted">{performancePage.subtitle}</p>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-card bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-navy">
            {performancePage.emptyTitle}
          </h2>
          <p className="mt-2 text-muted">{performancePage.emptyBody}</p>
          <Link
            href="/dashboard/veri-yukle"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110"
          >
            {performancePage.uploadCta}
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-card bg-white p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-muted">
                    <th className="py-2 pr-4">{performancePage.columnMonth}</th>
                    <th className="py-2 pr-4">{performancePage.columnDays}</th>
                    <th className="py-2 pr-4">
                      {performancePage.columnOccupancy}
                    </th>
                    <th className="py-2 pr-4">
                      {performancePage.columnRoomsSold}
                    </th>
                    <th className="py-2 pr-4">
                      {performancePage.columnRevenue}
                    </th>
                    <th className="py-2 pr-4">
                      {performancePage.columnRevenuePerRoom}
                    </th>
                    <th className="py-2 pr-4">{performancePage.columnYoY}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <PerformanceRow key={row.monthKey} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-muted">{performancePage.revenueNote}</p>
        </div>
      )}
    </div>
  );
}

function PerformanceRow({ row }: { row: MonthlyPerformanceRow }) {
  const occupancyPct = Math.round(row.avgOccupancy * 100);

  const yoyDeltaPoints =
    row.prevYearAvgOccupancy !== null
      ? Math.round((row.avgOccupancy - row.prevYearAvgOccupancy) * 100)
      : null;

  // Yon bilgisi +/- isaretiyle tasinir; teal beyaz zeminde kucuk metin icin
  // WCAG AA kontrastini saglamadigindan pozitif delta navy ile gosterilir.
  const yoyClassName =
    yoyDeltaPoints !== null && yoyDeltaPoints > 0
      ? "font-semibold text-navy"
      : yoyDeltaPoints !== null && yoyDeltaPoints < 0
        ? "font-semibold text-error"
        : "text-muted";

  return (
    <tr className="border-b border-black/5 text-ink">
      <td className="py-3 pr-4 font-medium">
        {formatMonthLabel(row.monthKey)}
      </td>
      <td className="py-3 pr-4">{row.daysWithData}</td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <div
            aria-hidden="true"
            className="h-2 w-20 shrink-0 overflow-hidden rounded-full bg-sand"
          >
            <div
              className="h-full rounded-full bg-teal"
              style={{ width: `${occupancyPct}%` }}
            />
          </div>
          <span className="font-semibold text-navy">%{occupancyPct}</span>
        </div>
      </td>
      <td className="py-3 pr-4">{row.totalRoomsSold.toLocaleString("tr-TR")}</td>
      <td className="py-3 pr-4">
        {row.totalRevenue !== null ? formatCurrency(row.totalRevenue) : "—"}
      </td>
      <td className="py-3 pr-4">
        {row.revenuePerRoomSold !== null
          ? formatCurrency(row.revenuePerRoomSold)
          : "—"}
      </td>
      <td className="py-3 pr-4">
        {yoyDeltaPoints === null ? (
          "—"
        ) : (
          <span className={yoyClassName}>
            {yoyDeltaPoints > 0 ? "+" : ""}
            {yoyDeltaPoints} {performancePage.yoyPointsSuffix}
          </span>
        )}
      </td>
    </tr>
  );
}
