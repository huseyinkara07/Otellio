// Yuklenen rezervasyon verisinden aylik performans ozeti cikarir: ortalama
// doluluk, satilan oda, toplam gelir ve oda basina ortalama gelir. Gelir
// sutunu istege bagli oldugundan (lib/reservationParsing.ts) gelir alanlari
// yalnizca gelir girilen satirlar uzerinden hesaplanir; hic gelir verisi
// olmayan aylarda null doner. Fonksiyon saf tutulmustur (UI/DB bagimliligi
// yok) ki bagimsiz test edilebilsin.

export type MonthlyPerformanceRow = {
  monthKey: string; // "2026-07"
  daysWithData: number;
  avgOccupancy: number; // 0..1
  totalRoomsSold: number;
  totalRevenue: number | null;
  revenuePerRoomSold: number | null;
  // Ayni ayin bir onceki yildaki ortalama dolulugu (veri varsa); otelcinin
  // "bu Temmuz gecen Temmuz'dan iyi mi?" sorusuna cevap verir.
  prevYearAvgOccupancy: number | null;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function summarizeMonthlyPerformance(
  reservations: {
    stay_date: string;
    rooms_sold: number;
    revenue: number | null;
  }[],
  roomCount: number
): MonthlyPerformanceRow[] {
  if (roomCount <= 0) return [];

  type Bucket = {
    days: number;
    occupancySum: number;
    roomsSold: number;
    revenueSum: number;
    revenueRoomsSold: number;
    hasRevenue: boolean;
  };

  const byMonth = new Map<string, Bucket>();
  for (const r of reservations) {
    const monthKey = r.stay_date.slice(0, 7);
    const bucket = byMonth.get(monthKey) ?? {
      days: 0,
      occupancySum: 0,
      roomsSold: 0,
      revenueSum: 0,
      revenueRoomsSold: 0,
      hasRevenue: false,
    };
    bucket.days += 1;
    bucket.occupancySum += clamp01(r.rooms_sold / roomCount);
    bucket.roomsSold += r.rooms_sold;
    if (r.revenue !== null) {
      bucket.revenueSum += r.revenue;
      bucket.revenueRoomsSold += r.rooms_sold;
      bucket.hasRevenue = true;
    }
    byMonth.set(monthKey, bucket);
  }

  const avgOccupancyByMonth = new Map<string, number>();
  for (const [monthKey, bucket] of byMonth) {
    avgOccupancyByMonth.set(monthKey, bucket.occupancySum / bucket.days);
  }

  const rows: MonthlyPerformanceRow[] = [];
  for (const [monthKey, bucket] of byMonth) {
    const [year, month] = monthKey.split("-");
    const prevYearKey = `${Number(year) - 1}-${month}`;
    rows.push({
      monthKey,
      daysWithData: bucket.days,
      avgOccupancy: bucket.occupancySum / bucket.days,
      totalRoomsSold: bucket.roomsSold,
      totalRevenue: bucket.hasRevenue ? bucket.revenueSum : null,
      revenuePerRoomSold:
        bucket.hasRevenue && bucket.revenueRoomsSold > 0
          ? bucket.revenueSum / bucket.revenueRoomsSold
          : null,
      prevYearAvgOccupancy: avgOccupancyByMonth.get(prevYearKey) ?? null,
    });
  }

  // En yeni ay en ustte gosterilir.
  return rows.sort((a, b) => b.monthKey.localeCompare(a.monthKey));
}
