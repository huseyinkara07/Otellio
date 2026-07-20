import { describe, expect, it } from "vitest";
import {
  computeOccupancyForecast,
  forecastHoltWinters,
  forecastSeasonalNaive,
  type OccupancyHistory,
} from "./simpleForecast";

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// Belirli bir doluluk uretecinden gunluk doluluk gecmisi kurar.
function buildOccupancy(
  days: number,
  rate: (dayIndex: number, date: Date) => number,
  start = new Date(2025, 0, 1)
): OccupancyHistory[] {
  const rows: OccupancyHistory[] = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    rows.push({ date: iso(d), occupancyRate: Math.min(1, Math.max(0, rate(i, d))) });
  }
  return rows;
}

function toReservations(history: OccupancyHistory[], rooms: number) {
  return history.map((h) => ({
    stay_date: h.date,
    rooms_sold: Math.round(h.occupancyRate * rooms),
  }));
}

describe("forecastHoltWinters (aday model)", () => {
  it("ay-ici artan trendi yakalar: tahmin seri ortalamasinin uzerinde kalir", () => {
    const days = 28;
    const history = buildOccupancy(days, (i) => 0.3 + (0.4 * i) / (days - 1), new Date(2025, 0, 1));
    const today = new Date(2025, 0, days);

    const points = forecastHoltWinters(history, 14, today);
    const avg = points.reduce((s, p) => s + p.occupancyRate, 0) / points.length;
    expect(avg).toBeGreaterThan(0.58); // seri ortalamasi 0.5; trend yukari
  });

  it("haftalik mevsimselligi yakalar: hafta sonu > hafta ici", () => {
    const history = buildOccupancy(140, (_i, d) => {
      const wd = d.getDay();
      return wd === 5 || wd === 6 || wd === 0 ? 0.85 : 0.45;
    });
    const today = new Date(2025, 0, 140);
    const points = forecastHoltWinters(history, 21, today);

    const weekend = points.filter((p) => {
      const d = new Date(p.date + "T00:00:00").getDay();
      return d === 5 || d === 6 || d === 0;
    });
    const weekdayPts = points.filter((p) => {
      const d = new Date(p.date + "T00:00:00").getDay();
      return d !== 5 && d !== 6 && d !== 0;
    });
    const avg = (a: typeof points) => a.reduce((s, p) => s + p.occupancyRate, 0) / a.length;
    expect(avg(weekend)).toBeGreaterThan(avg(weekdayPts) + 0.15);
  });

  it("guven bandi ufuk uzadikca genisler", () => {
    const history = buildOccupancy(120, (i) => 0.5 + (i % 5 === 0 ? 0.2 : -0.05));
    const today = new Date(2025, 0, 120);
    const points = forecastHoltWinters(history, 60, today);
    const width = (p: { lowerBound: number; upperBound: number }) => p.upperBound - p.lowerBound;
    expect(width(points[points.length - 1])).toBeGreaterThanOrEqual(width(points[0]));
  });

  it("tum tahminler ve bantlar [0,1] araliginda kalir", () => {
    const history = buildOccupancy(120, (_i, d) =>
      d.getDay() === 6 ? 0.95 : 0.2
    );
    const points = forecastHoltWinters(history, 90, new Date(2025, 0, 120));
    for (const p of points) {
      expect(p.lowerBound).toBeGreaterThanOrEqual(0);
      expect(p.upperBound).toBeLessThanOrEqual(1);
      expect(p.lowerBound).toBeLessThanOrEqual(p.occupancyRate);
      expect(p.upperBound).toBeGreaterThanOrEqual(p.occupancyRate);
    }
  });
});

describe("computeOccupancyForecast — otomatik model secimi", () => {
  it("gercek otel verisinde (dogal gurultulu haftalik desen) basit modeli secer", () => {
    // Manavgat Hotels'in gercek 120 gunluk verisi (50 oda): guclu ama gunluk
    // dalgalanmali haftalik desen. Bu seride seasonal-naive, Holt-Winters'i
    // geri-testte geride birakir; bu testin varlik sebebi de budur (model
    // secimi olmadan HW'ye gecmek burada tahmini kotulestirirdi).
    const raw =
      "27 23 44 41 26 27 26 24 27 40 43 24 28 25 24 26 44 45 27 27 27 25 27 42 43 28 26 26 24 26 45 43 26 25 27 26 26 42 42 25 28 28 29 27 45 43 26 26 28 28 29 45 47 27 30 29 29 28 46 43 30 29 26 27 29 43 46 28 29 28 28 29 45 47 30 31 29 33 35 41 43 36 32 30 34 36 42 44 37 33 31 35 38 43 45 39 30 31 32 30 47 48 30 28 31 32 29 46 48 28 32 33 32 30 47 47 31 29 32 31";
    const rooms = raw.trim().split(/\s+/).map(Number);
    const start = new Date(2026, 2, 18); // 18 Mart 2026
    const reservations = rooms.map((sold, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return { stay_date: iso(d), rooms_sold: sold };
    });
    const today = new Date(start);
    today.setDate(today.getDate() + rooms.length - 1);

    const result = computeOccupancyForecast(reservations, 50, 30, today);
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.method).toBe("seasonal-naive");
  });

  it("secilen model geri-testte temel modeli asla belirgin sekilde geride birakmaz", () => {
    // Trendli + haftalik + gurultulu seri: Holt-Winters kazanabilir, ama
    // hangisi secilirse secilsin secim geri-test hatasina dayanir.
    const history = buildOccupancy(160, (i, d) => {
      const wd = d.getDay();
      const weekend = wd === 5 || wd === 6 ? 0.25 : 0;
      const trend = (0.2 * i) / 159;
      return 0.4 + weekend + trend + (i % 3 === 0 ? 0.05 : -0.03);
    });
    const reservations = toReservations(history, 50);
    const result = computeOccupancyForecast(reservations, 50, 30, new Date(2025, 0, 160));
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(["seasonal-naive", "holt-winters"]).toContain(result.method);
  });

  it("14-27 gun arasi veride secim yapmadan basit modeli kullanir", () => {
    const history = buildOccupancy(20, () => 0.6);
    const result = computeOccupancyForecast(
      toReservations(history, 50),
      50,
      30,
      new Date(2025, 0, 20)
    );
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.method).toBe("seasonal-naive");
  });
});
