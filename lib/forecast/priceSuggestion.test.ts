import { describe, expect, it } from "vitest";
import { computePriceSuggestions } from "./priceSuggestion";

function priceFor(occupancyRate: number, basePrice = 1000): number {
  return computePriceSuggestions([{ date: "2026-07-20", occupancyRate }], basePrice)[0]
    .suggestedPrice;
}

describe("computePriceSuggestions", () => {
  it("doluluk dilimlerine gore dogru carpani uygular (sinir degerler dahil)", () => {
    expect(priceFor(0)).toBe(900); // ≤0.4 -> 0.9x
    expect(priceFor(0.4)).toBe(900);
    expect(priceFor(0.41)).toBe(1000); // ≤0.7 -> 1.0x
    expect(priceFor(0.7)).toBe(1000);
    expect(priceFor(0.71)).toBe(1100); // ≤0.9 -> 1.1x
    expect(priceFor(0.9)).toBe(1100);
    expect(priceFor(0.91)).toBe(1200); // >0.9 -> 1.2x
    expect(priceFor(1)).toBe(1200);
  });

  it("fiyati tam sayiya yuvarlar", () => {
    expect(priceFor(0.3, 1555)).toBe(Math.round(1555 * 0.9));
  });

  it("tarih ve doluluk bilgisini korur", () => {
    const [point] = computePriceSuggestions(
      [{ date: "2026-08-01", occupancyRate: 0.85 }],
      2000
    );
    expect(point.date).toBe("2026-08-01");
    expect(point.occupancyRate).toBe(0.85);
  });
});
