// Doluluk tahminine dayali basit fiyat onerisi: taban fiyata, tahmini
// doluluk dilimine gore bir carpan uygular. PRD Bolum 4.4 notuyla uyumlu
// olarak bu bir "oneri"dir; "garanti/optimum" gibi kesinlik iddiasi
// tasimaz — kullanici arayuzunde de bu cerceve korunmalidir.

export type PriceSuggestionPoint = {
  date: string;
  occupancyRate: number;
  suggestedPrice: number;
};

const OCCUPANCY_TIERS: { maxOccupancy: number; multiplier: number }[] = [
  { maxOccupancy: 0.4, multiplier: 0.9 },
  { maxOccupancy: 0.7, multiplier: 1.0 },
  { maxOccupancy: 0.9, multiplier: 1.1 },
  { maxOccupancy: 1.01, multiplier: 1.2 },
];

function multiplierFor(occupancyRate: number): number {
  const tier = OCCUPANCY_TIERS.find((t) => occupancyRate <= t.maxOccupancy);
  return tier ? tier.multiplier : OCCUPANCY_TIERS[OCCUPANCY_TIERS.length - 1].multiplier;
}

export function computePriceSuggestions(
  forecastPoints: { date: string; occupancyRate: number }[],
  basePrice: number
): PriceSuggestionPoint[] {
  return forecastPoints.map((point) => ({
    date: point.date,
    occupancyRate: point.occupancyRate,
    suggestedPrice: Math.round(basePrice * multiplierFor(point.occupancyRate)),
  }));
}
