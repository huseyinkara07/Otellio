// Basit istatistiksel doluluk tahmini motoru: haftanin gunune gore mevsimsel
// ortalama (seasonal-naive) + son donem/onceki donem karsilastirmasindan
// gelen bir trend katsayisi. Gercek bir zaman serisi modeline (ör. SARIMA,
// bkz. PRD'deki kurucu notu) gecilmek istenirse yalnizca bu dosyanin
// export ettigi computeOccupancyForecast fonksiyonu degistirilir; cagiran
// sayfa kodunun (app/dashboard/tahmin) haberi olmaz.

export type ForecastPoint = {
  date: string;
  occupancyRate: number;
  lowerBound: number;
  upperBound: number;
};

export type ForecastResult =
  | { status: "insufficient_data"; daysOfHistory: number }
  | { status: "ok"; points: ForecastPoint[] };

const MIN_HISTORY_DAYS = 14;
const RECENT_WINDOW_DAYS = 28;
const MIN_TREND_FACTOR = 0.7;
const MAX_TREND_FACTOR = 1.3;
const MIN_INTERVAL = 0.05;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function stddev(values: number[]): number {
  const avg = average(values);
  const variance = average(values.map((v) => (v - avg) ** 2));
  return Math.sqrt(variance);
}

function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function computeOccupancyForecast(
  reservations: { stay_date: string; rooms_sold: number }[],
  roomCount: number,
  horizonDays: number,
  today: Date = new Date()
): ForecastResult {
  if (roomCount <= 0) {
    return { status: "insufficient_data", daysOfHistory: 0 };
  }

  const history = reservations
    .map((r) => ({
      date: r.stay_date,
      occupancyRate: clamp01(r.rooms_sold / roomCount),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (history.length < MIN_HISTORY_DAYS) {
    return { status: "insufficient_data", daysOfHistory: history.length };
  }

  // JS Date.getDay(): 0=Pazar ... 6=Cumartesi
  const byWeekday: number[][] = [[], [], [], [], [], [], []];
  for (const point of history) {
    byWeekday[parseISODate(point.date).getDay()].push(point.occupancyRate);
  }

  const overallAvg = average(history.map((h) => h.occupancyRate));

  const recentCutoff = new Date(today);
  recentCutoff.setDate(recentCutoff.getDate() - RECENT_WINDOW_DAYS);
  const priorCutoff = new Date(today);
  priorCutoff.setDate(priorCutoff.getDate() - RECENT_WINDOW_DAYS * 2);

  const recentPoints = history.filter(
    (h) => parseISODate(h.date) > recentCutoff
  );
  const priorPoints = history.filter((h) => {
    const d = parseISODate(h.date);
    return d > priorCutoff && d <= recentCutoff;
  });

  let trendFactor = 1;
  if (recentPoints.length >= 5 && priorPoints.length >= 5) {
    const recentAvg = average(recentPoints.map((p) => p.occupancyRate));
    const priorAvg = average(priorPoints.map((p) => p.occupancyRate));
    if (priorAvg > 0.01) {
      trendFactor = clamp(
        recentAvg / priorAvg,
        MIN_TREND_FACTOR,
        MAX_TREND_FACTOR
      );
    }
  }

  const points: ForecastPoint[] = [];
  for (let i = 1; i <= horizonDays; i += 1) {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + i);
    const weekdayValues = byWeekday[futureDate.getDay()];

    const baseline =
      weekdayValues.length >= 2 ? average(weekdayValues) : overallAvg;
    const occupancyRate = clamp01(baseline * trendFactor);

    const spread = weekdayValues.length >= 3 ? stddev(weekdayValues) : 0;
    const interval = Math.max(spread, MIN_INTERVAL);

    points.push({
      date: toISODate(futureDate),
      occupancyRate,
      lowerBound: clamp01(occupancyRate - interval),
      upperBound: clamp01(occupancyRate + interval),
    });
  }

  return { status: "ok", points };
}
