import { describe, expect, it } from "vitest";
import { buildWeeklyReport } from "./weeklyReport";

function seasonalHistory(days: number, start = new Date(2025, 6, 1)) {
  const rows: { stay_date: string; rooms_sold: number }[] = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const m = d.getMonth();
    let base = m >= 5 && m <= 8 ? 0.9 : 0.35;
    if (d.getDay() === 5 || d.getDay() === 6) base += 0.05;
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    rows.push({ stay_date: iso, rooms_sold: Math.round(Math.min(1, base) * 50) });
  }
  return rows;
}

const baseInput = {
  hotelName: "Deniz Manzara Otel",
  roomCount: 50,
  basePrice: 2000,
  reservations: seasonalHistory(365),
  baseUrl: "https://otellio.com",
  today: new Date(2026, 5, 30),
};

describe("buildWeeklyReport", () => {
  it("konu ve panel linki iceren bir rapor uretir", () => {
    const report = buildWeeklyReport(baseInput);
    expect(report).not.toBeNull();
    expect(report!.subject).toContain("Otellio Haftalık Özet");
    expect(report!.subject).toContain("Deniz Manzara Otel");
    expect(report!.html).toContain("https://otellio.com/dashboard");
  });

  it("baseUrl sonundaki egik cizgiyi tekillestirir", () => {
    const report = buildWeeklyReport({ ...baseInput, baseUrl: "https://otellio.com/" });
    expect(report!.html).toContain("https://otellio.com/dashboard");
    expect(report!.html).not.toContain("com//dashboard");
  });

  it("otel adindaki HTML karakterlerini kacislar (XSS)", () => {
    const report = buildWeeklyReport({
      ...baseInput,
      hotelName: 'Deniz <script>alert(1)</script> & "Otel"',
    });
    expect(report!.html).not.toContain("<script>");
    expect(report!.html).toContain(
      "Deniz &lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;Otel&quot;"
    );
  });

  it("yaz sezonunda yogun gunleri raporlar", () => {
    const report = buildWeeklyReport(baseInput);
    expect(report!.html).toContain("Yoğun görünen günler");
  });

  it("yetersiz veriyle null doner (bos rapor gonderilmez)", () => {
    const report = buildWeeklyReport({
      ...baseInput,
      reservations: seasonalHistory(5),
    });
    expect(report).toBeNull();
  });
});
