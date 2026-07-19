import { describe, expect, it } from "vitest";
import { summarizeMonthlyPerformance } from "./performance";

// Tem 2025 (gelirli) + Tem 2026 (gelirsiz) + Agu 2026 (karisik gelir)
function sampleData() {
  const rows: { stay_date: string; rooms_sold: number; revenue: number | null }[] = [];
  for (let d = 1; d <= 31; d += 1) {
    const day = String(d).padStart(2, "0");
    rows.push({ stay_date: `2025-07-${day}`, rooms_sold: 40, revenue: 40 * 100 });
    rows.push({ stay_date: `2026-07-${day}`, rooms_sold: 45, revenue: null });
  }
  for (let d = 1; d <= 10; d += 1) {
    const day = String(d).padStart(2, "0");
    rows.push({
      stay_date: `2026-08-${day}`,
      rooms_sold: 20,
      revenue: d <= 5 ? 20 * 150 : null,
    });
  }
  return rows;
}

describe("summarizeMonthlyPerformance", () => {
  it("aylari en yeniden eskiye siralar", () => {
    const rows = summarizeMonthlyPerformance(sampleData(), 50);
    expect(rows.map((r) => r.monthKey)).toEqual(["2026-08", "2026-07", "2025-07"]);
  });

  it("doluluk, oda ve gun sayilarini dogru toplar", () => {
    const [aug, jul26, jul25] = summarizeMonthlyPerformance(sampleData(), 50);
    expect(aug.daysWithData).toBe(10);
    expect(aug.avgOccupancy).toBeCloseTo(0.4, 9);
    expect(aug.totalRoomsSold).toBe(200);
    expect(jul26.avgOccupancy).toBeCloseTo(0.9, 9);
    expect(jul25.totalRoomsSold).toBe(31 * 40);
  });

  it("gelir alanlarini yalnizca gelir girilen gunler uzerinden hesaplar", () => {
    const [aug, jul26, jul25] = summarizeMonthlyPerformance(sampleData(), 50);
    // Agu: ilk 5 gun gelirli (5 x 3000), oda basina 150 TL.
    expect(aug.totalRevenue).toBe(15000);
    expect(aug.revenuePerRoomSold).toBeCloseTo(150, 9);
    // Tem 2026: hic gelir yok -> null.
    expect(jul26.totalRevenue).toBeNull();
    expect(jul26.revenuePerRoomSold).toBeNull();
    // Tem 2025: tamami gelirli.
    expect(jul25.totalRevenue).toBe(31 * 4000);
    expect(jul25.revenuePerRoomSold).toBeCloseTo(100, 9);
  });

  it("gecen yilin ayni ayinin dolulugunu esler", () => {
    const [aug, jul26] = summarizeMonthlyPerformance(sampleData(), 50);
    expect(aug.prevYearAvgOccupancy).toBeNull(); // Agu 2025 verisi yok
    expect(jul26.prevYearAvgOccupancy).toBeCloseTo(0.8, 9); // Tem 2025: 40/50
  });

  it("bos veri veya gecersiz oda sayisinda bos liste doner", () => {
    expect(summarizeMonthlyPerformance([], 50)).toEqual([]);
    expect(summarizeMonthlyPerformance(sampleData(), 0)).toEqual([]);
  });
});
