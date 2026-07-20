// Doluluk tahmini motoru — otele gore OTOMATIK MODEL SECIMI.
//
// Iki aday model vardir:
//   1. seasonal-naive: haftanin gunu ortalamasi x aylik sezon endeksi x trend
//      katsayisi. Basit, saglam; duzenli/durgun serilerde cok iyi calisir.
//   2. holt-winters: sonumlu-trendli uclu ustel duzeltme (ETS(A,Ad,A)).
//      Seviye + trend + haftalik mevsim; trend/dinamigin belirgin oldugu
//      serilerde one gecer, katsayilarini otele gore ogrenir.
//
// Hangisinin kullanilacagi VERIYLE KARARLASTIRILIR: son gunler geri-test
// (hold-out) icin ayrilir, iki model de bu pencereyi tahmin eder, gercek
// degere daha yakin olan secilir. Beraberlik/marj altinda basit model
// (seasonal-naive) tercih edilir; boylece secim, temel modele gore asla
// belirgin sekilde geri gitmez. Yeterli veri yoksa dogrudan seasonal-naive
// kullanilir.
//
// Bu tasarim, PRD'de kurucu notu olarak gecen SARIMA hedefinin pratik ve
// dürüst bir muadilidir: tek bir "daha karmasik model her zaman daha iyidir"
// varsayimi yerine, her tesis icin olcülü en iyi modeli secer. Daha ileri bir
// aday (ör. gercek SARIMA) eklenmek istenirse CANDIDATES listesine bir fonksiyon
// eklenir; cagiran sayfa kodunun (app/dashboard/tahmin) haberi olmaz.

export type ForecastMethod = "seasonal-naive" | "holt-winters";

export type ForecastPoint = {
  date: string;
  occupancyRate: number;
  lowerBound: number;
  upperBound: number;
};

export type ForecastResult =
  | { status: "insufficient_data"; daysOfHistory: number }
  | { status: "ok"; method: ForecastMethod; points: ForecastPoint[] };

export type OccupancyHistory = { date: string; occupancyRate: number };

const MIN_HISTORY_DAYS = 14;
// Model secimi icin geri-test yapmak yeterli veri gerektirir; altinda dogrudan
// basit model kullanilir.
const BACKTEST_WINDOW = 14;
const MIN_DAYS_FOR_SELECTION = MIN_HISTORY_DAYS + BACKTEST_WINDOW;
// Holt-Winters ancak temel modeli bu oranin altinda bir hatayla gecerse secilir
// (aksi halde basit model tercih edilir).
const SELECTION_MARGIN = 0.98;

const MIN_INTERVAL = 0.05;

// --- seasonal-naive parametreleri ---
const RECENT_WINDOW_DAYS = 28;
const MIN_TREND_FACTOR = 0.7;
const MAX_TREND_FACTOR = 1.3;

// --- Holt-Winters parametreleri ---
const SEASON_LENGTH = 7;
const TREND_DAMPING = 0.98;
const INTERVAL_Z = 1;
const INTERVAL_GROWTH = 0.15;
const ALPHA_GRID = [0.1, 0.2, 0.35, 0.5];
const BETA_GRID = [0.02, 0.05, 0.1, 0.2];
const GAMMA_GRID = [0.1, 0.2, 0.35, 0.5];

// --- aylik sezon endeksi parametreleri ---
const MIN_MONTH_POINTS = 8;
const MIN_MONTH_FACTOR = 0.5;
const MAX_MONTH_FACTOR = 1.6;

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
  return Math.sqrt(average(values.map((v) => (v - avg) ** 2)));
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

// Yeterli gozlemi olan aylar icin ay ortalamasi / genel ortalama orani; veri
// olmayan/az olan aylar notr (1) kalir. Iki model de bunu paylasir.
function buildMonthIndex(history: OccupancyHistory[]): number[] {
  const overallAvg = average(history.map((h) => h.occupancyRate));
  const byMonth: number[][] = Array.from({ length: 12 }, () => []);
  for (const point of history) {
    byMonth[parseISODate(point.date).getMonth()].push(point.occupancyRate);
  }
  return byMonth.map((values) => {
    if (values.length < MIN_MONTH_POINTS || overallAvg <= 0.01) return 1;
    return clamp(average(values) / overallAvg, MIN_MONTH_FACTOR, MAX_MONTH_FACTOR);
  });
}

// ---------------------------------------------------------------------------
// Aday 1: seasonal-naive (haftanin gunu ortalamasi x aylik endeks x trend)
// ---------------------------------------------------------------------------
export function forecastSeasonalNaive(
  history: OccupancyHistory[],
  horizonDays: number,
  today: Date
): ForecastPoint[] {
  const byWeekday: number[][] = [[], [], [], [], [], [], []];
  for (const point of history) {
    byWeekday[parseISODate(point.date).getDay()].push(point.occupancyRate);
  }

  const overallAvg = average(history.map((h) => h.occupancyRate));
  const monthIndex = buildMonthIndex(history);

  const recentCutoff = new Date(today);
  recentCutoff.setDate(recentCutoff.getDate() - RECENT_WINDOW_DAYS);
  const priorCutoff = new Date(today);
  priorCutoff.setDate(priorCutoff.getDate() - RECENT_WINDOW_DAYS * 2);

  const recentPoints = history.filter((h) => parseISODate(h.date) > recentCutoff);
  const priorPoints = history.filter((h) => {
    const d = parseISODate(h.date);
    return d > priorCutoff && d <= recentCutoff;
  });

  // Trend, sezon endeksinden arindirilmis degerlerle olculur; yoksa mevsim
  // gecisi trend olarak iki kez sayilirdi.
  const deseasonalized = (h: OccupancyHistory) =>
    h.occupancyRate / monthIndex[parseISODate(h.date).getMonth()];

  let trendFactor = 1;
  if (recentPoints.length >= 5 && priorPoints.length >= 5) {
    const recentAvg = average(recentPoints.map(deseasonalized));
    const priorAvg = average(priorPoints.map(deseasonalized));
    if (priorAvg > 0.01) {
      trendFactor = clamp(recentAvg / priorAvg, MIN_TREND_FACTOR, MAX_TREND_FACTOR);
    }
  }

  const points: ForecastPoint[] = [];
  for (let i = 1; i <= horizonDays; i += 1) {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + i);
    const weekdayValues = byWeekday[futureDate.getDay()];

    const baseline =
      weekdayValues.length >= 2 ? average(weekdayValues) : overallAvg;
    const occupancyRate = clamp01(
      baseline * monthIndex[futureDate.getMonth()] * trendFactor
    );

    const spread = weekdayValues.length >= 3 ? stddev(weekdayValues) : 0;
    const interval = Math.max(spread, MIN_INTERVAL);

    points.push({
      date: toISODate(futureDate),
      occupancyRate,
      lowerBound: clamp01(occupancyRate - interval),
      upperBound: clamp01(occupancyRate + interval),
    });
  }
  return points;
}

// ---------------------------------------------------------------------------
// Aday 2: sonumlu-trendli Holt-Winters (uclu ustel duzeltme)
// ---------------------------------------------------------------------------
type Observation = { weekday: number; month: number; value: number };

type HoltWintersFit = {
  level: number;
  trend: number;
  seasonal: number[];
  residualStd: number;
};

// Mevsim, dizideki konuma degil gercek haftanin gunune gore indekslenir;
// boylece seride eksik gunler olsa da haftalik desen kaymaz.
function fitHoltWinters(
  series: Observation[],
  alpha: number,
  beta: number,
  gamma: number
): HoltWintersFit {
  const initWindow = series.slice(0, Math.min(series.length, 3 * SEASON_LENGTH));
  const initValues = initWindow.map((o) => o.value);

  let level = average(initValues);

  const half = Math.max(1, Math.floor(initWindow.length / 2));
  const firstHalf = average(initValues.slice(0, half));
  const secondHalf = average(initValues.slice(half));
  let trend = (secondHalf - firstHalf) / half;

  const seasonal = new Array<number>(SEASON_LENGTH).fill(0);
  for (let w = 0; w < SEASON_LENGTH; w += 1) {
    const dayValues = initWindow.filter((o) => o.weekday === w).map((o) => o.value);
    seasonal[w] = dayValues.length > 0 ? average(dayValues) - level : 0;
  }

  const squaredErrors: number[] = [];
  for (let t = 0; t < series.length; t += 1) {
    const { weekday, value } = series[t];

    const forecast = level + TREND_DAMPING * trend + seasonal[weekday];
    if (t >= SEASON_LENGTH) {
      squaredErrors.push((value - forecast) ** 2);
    }

    const prevLevel = level;
    level =
      alpha * (value - seasonal[weekday]) +
      (1 - alpha) * (level + TREND_DAMPING * trend);
    trend = beta * (level - prevLevel) + (1 - beta) * TREND_DAMPING * trend;
    seasonal[weekday] = gamma * (value - level) + (1 - gamma) * seasonal[weekday];
  }

  const residualStd =
    squaredErrors.length > 0 ? Math.sqrt(average(squaredErrors)) : 0;
  return { level, trend, seasonal, residualStd };
}

export function forecastHoltWinters(
  history: OccupancyHistory[],
  horizonDays: number,
  today: Date
): ForecastPoint[] {
  const monthIndex = buildMonthIndex(history);

  // Aylik mevsimsellikten arindirilmis seri (Holt-Winters bunun uzerinde calisir).
  const series: Observation[] = history.map((h) => {
    const d = parseISODate(h.date);
    const month = d.getMonth();
    return {
      weekday: d.getDay(),
      month,
      value: h.occupancyRate / monthIndex[month],
    };
  });

  let best: HoltWintersFit | null = null;
  let bestError = Infinity;
  for (const alpha of ALPHA_GRID) {
    for (const beta of BETA_GRID) {
      for (const gamma of GAMMA_GRID) {
        const fit = fitHoltWinters(series, alpha, beta, gamma);
        if (fit.residualStd < bestError) {
          bestError = fit.residualStd;
          best = fit;
        }
      }
    }
  }
  if (!best) return forecastSeasonalNaive(history, horizonDays, today);

  const { level, trend, seasonal, residualStd } = best;

  const points: ForecastPoint[] = [];
  for (let k = 1; k <= horizonDays; k += 1) {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + k);
    const weekday = futureDate.getDay();
    const month = futureDate.getMonth();

    // Sonumlu trend: phi + phi^2 + ... + phi^k (geometrik toplam).
    const dampSum = (TREND_DAMPING * (1 - TREND_DAMPING ** k)) / (1 - TREND_DAMPING);
    const deseasonForecast = level + dampSum * trend + seasonal[weekday];
    const occupancyRate = clamp01(deseasonForecast * monthIndex[month]);

    const growth = Math.sqrt(1 + (k - 1) * INTERVAL_GROWTH);
    const interval = Math.max(
      MIN_INTERVAL,
      INTERVAL_Z * residualStd * growth * monthIndex[month]
    );

    points.push({
      date: toISODate(futureDate),
      occupancyRate,
      lowerBound: clamp01(occupancyRate - interval),
      upperBound: clamp01(occupancyRate + interval),
    });
  }
  return points;
}

// ---------------------------------------------------------------------------
// Model secimi (geri-test) + surucu
// ---------------------------------------------------------------------------
type Candidate = (
  history: OccupancyHistory[],
  horizonDays: number,
  today: Date
) => ForecastPoint[];

// Bir modelin son BACKTEST_WINDOW gunundeki ortalama mutlak hatasi (doluluk
// biriminde). Egitim, pencereyi haric tutan gecmisle yapilir; tahmin, gizlenen
// gunlerle tarih bazinda eslestirilir. Eslesme yoksa (ör. bosluklar) Infinity.
function backtestError(
  candidate: Candidate,
  history: OccupancyHistory[],
  window: number
): number {
  const train = history.slice(0, history.length - window);
  const holdout = history.slice(history.length - window);
  if (train.length < MIN_HISTORY_DAYS) return Infinity;

  const trainToday = parseISODate(train[train.length - 1].date);
  const forecast = candidate(train, window, trainToday);
  const byDate = new Map(forecast.map((p) => [p.date, p.occupancyRate]));

  const errors: number[] = [];
  for (const actual of holdout) {
    const predicted = byDate.get(actual.date);
    if (predicted === undefined) continue;
    errors.push(Math.abs(predicted - actual.occupancyRate));
  }
  return errors.length > 0 ? average(errors) : Infinity;
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

  const history: OccupancyHistory[] = reservations
    .map((r) => ({
      date: r.stay_date,
      occupancyRate: clamp01(r.rooms_sold / roomCount),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (history.length < MIN_HISTORY_DAYS) {
    return { status: "insufficient_data", daysOfHistory: history.length };
  }

  // Yeterli veri varsa iki modeli geri-testle karsilastir; yoksa basit modeli
  // kullan. Holt-Winters yalnizca temel modeli belirgin marjla geride birakirsa
  // secilir (beraberlik/gurultu durumunda basit model kazanir).
  let method: ForecastMethod = "seasonal-naive";
  if (history.length >= MIN_DAYS_FOR_SELECTION) {
    const naiveError = backtestError(forecastSeasonalNaive, history, BACKTEST_WINDOW);
    const hwError = backtestError(forecastHoltWinters, history, BACKTEST_WINDOW);
    if (Number.isFinite(hwError) && hwError < naiveError * SELECTION_MARGIN) {
      method = "holt-winters";
    }
  }

  const candidate =
    method === "holt-winters" ? forecastHoltWinters : forecastSeasonalNaive;
  const points = candidate(history, horizonDays, today);

  return { status: "ok", method, points };
}
