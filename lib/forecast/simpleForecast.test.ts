import { describe, expect, it } from "vitest";
import { computeOccupancyForecast } from "./simpleForecast";

// Sezonlu sentetik veri: yaz aylari (Haz-Eyl) yuksek, gecis aylari orta,
// kis dusuk; Cuma/Cumartesi hafif yuksek. Antalya profiline benzer.
function seasonalHistory(days: number, start = new Date(2024, 6, 1)) {
  const rows: { stay_date: string; rooms_sold: number }[] = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const m = d.getMonth();
    let base = m >= 5 && m <= 8 ? 0.85 : m === 4 || m === 9 ? 0.6 : 0.35;
    if (d.getDay() === 5 || d.getDay() === 6) base += 0.08;
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    rows.push({ stay_date: iso, rooms_sold: Math.round(Math.min(1, base) * 50) });
  }
  return rows;
}

function monthlyAverages(points: { date: string; occupancyRate: number }[]) {
  const byMonth = new Map<number, number[]>();
  for (const p of points) {
    const m = Number(p.date.split("-")[1]);
    byMonth.set(m, [...(byMonth.get(m) ?? []), p.occupancyRate]);
  }
  const avg = new Map<number, number>();
  for (const [m, values] of byMonth) {
    avg.set(m, values.reduce((s, v) => s + v, 0) / values.length);
  }
  return avg;
}

describe("computeOccupancyForecast", () => {
  it("iki yillik sezonlu veride ay sirasini dogru tahmin eder", () => {
    const result = computeOccupancyForecast(
      seasonalHistory(730),
      50,
      150,
      new Date(2026, 5, 30)
    );
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;

    const avg = monthlyAverages(result.points);
    // Yaz > gecis ayi > kis; mutlak seviyeler de kabaca dogru olmali.
    expect(avg.get(7)!).toBeGreaterThan(avg.get(10)!);
    expect(avg.get(10)!).toBeGreaterThan(avg.get(11)!);
    expect(avg.get(7)!).toBeGreaterThan(0.7);
    expect(avg.get(11)!).toBeLessThan(0.55);
  });

  it("tahmin ve guven araligi her zaman 0-1 arasinda kalir", () => {
    const result = computeOccupancyForecast(
      seasonalHistory(730),
      50,
      90,
      new Date(2026, 5, 30)
    );
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;

    for (const p of result.points) {
      expect(p.lowerBound).toBeGreaterThanOrEqual(0);
      expect(p.upperBound).toBeLessThanOrEqual(1);
      expect(p.lowerBound).toBeLessThanOrEqual(p.occupancyRate);
      expect(p.upperBound).toBeGreaterThanOrEqual(p.occupancyRate);
    }
  });

  it("14 gunden az veriyle insufficient_data doner", () => {
    const result = computeOccupancyForecast(seasonalHistory(10), 50, 30);
    expect(result).toEqual({ status: "insufficient_data", daysOfHistory: 10 });
  });

  it("tek aya sigan kisa veriyle de calisir (sezon endeksi notr kalir)", () => {
    const result = computeOccupancyForecast(
      seasonalHistory(20),
      50,
      30,
      new Date(2024, 6, 21)
    );
    expect(result.status).toBe("ok");
  });

  it("oda sayisi 0 veya negatifse insufficient_data doner", () => {
    expect(computeOccupancyForecast(seasonalHistory(60), 0, 30).status).toBe(
      "insufficient_data"
    );
    expect(computeOccupancyForecast(seasonalHistory(60), -5, 30).status).toBe(
      "insufficient_data"
    );
  });
});
