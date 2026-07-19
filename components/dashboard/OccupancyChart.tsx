import type { ForecastPoint } from "@/lib/forecast/simpleForecast";

const WIDTH = 800;
const HEIGHT = 240;
const PADDING_X = 16;
const PADDING_Y = 16;

function formatDayMonth(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${day}.${month}`;
}

export default function OccupancyChart({ points }: { points: ForecastPoint[] }) {
  if (points.length === 0) return null;

  const innerWidth = WIDTH - PADDING_X * 2;
  const innerHeight = HEIGHT - PADDING_Y * 2;
  const stepX = points.length > 1 ? innerWidth / (points.length - 1) : 0;

  const xAt = (index: number) => PADDING_X + index * stepX;
  const yAt = (rate: number) => PADDING_Y + innerHeight * (1 - rate);

  const linePath = points
    .map(
      (p, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(p.occupancyRate).toFixed(1)}`
    )
    .join(" ");

  const bandPath =
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(p.upperBound).toFixed(1)}`)
      .join(" ") +
    " " +
    [...points]
      .reverse()
      .map(
        (p, i) =>
          `L ${xAt(points.length - 1 - i).toFixed(1)} ${yAt(p.lowerBound).toFixed(1)}`
      )
      .join(" ") +
    " Z";

  const tickEvery = Math.max(1, Math.ceil(points.length / 6));

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full"
      role="img"
      aria-label={`${points[0].date} ile ${points[points.length - 1].date} arasi tahmini doluluk grafigi; asagidaki tabloda gunluk detaylar yer alir.`}
    >
      {[0, 0.5, 1].map((fraction) => (
        <g key={fraction}>
          <line
            x1={PADDING_X}
            x2={WIDTH - PADDING_X}
            y1={yAt(fraction)}
            y2={yAt(fraction)}
            stroke="#5B6672"
            strokeOpacity={0.15}
          />
          <text x={2} y={yAt(fraction) - 3} fontSize={11} fill="#5B6672">
            {Math.round(fraction * 100)}%
          </text>
        </g>
      ))}

      <path d={bandPath} fill="#4FA69A" fillOpacity={0.15} stroke="none" />
      <path d={linePath} fill="none" stroke="#0F2A43" strokeWidth={2} />

      {points.map((p, i) =>
        i % tickEvery === 0 ? (
          <text
            key={p.date}
            x={xAt(i)}
            y={HEIGHT - 2}
            fontSize={11}
            fill="#5B6672"
            textAnchor="middle"
          >
            {formatDayMonth(p.date)}
          </text>
        ) : null
      )}
    </svg>
  );
}
