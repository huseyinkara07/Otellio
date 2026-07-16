import { CheckCircle2 } from "lucide-react";
import { hero, demoAnchor } from "@/lib/content";

export default function Hero() {
  return (
    <section id="hero" className="bg-navy">
      <div className="mx-auto flex max-w-content flex-col items-center gap-12 px-4 py-20 sm:px-6 md:flex-row md:py-28">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-[3.5rem]">
            {hero.title}
          </h1>
          <p className="mt-6 text-lg text-white/80">{hero.subtitle}</p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-teal md:justify-start">
            <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{hero.trustLine}</span>
          </div>

          <div className="mt-8">
            <a
              href={demoAnchor}
              className="inline-flex h-12 items-center justify-center rounded-button bg-accent px-8 text-base font-semibold text-navy hover:brightness-110"
            >
              {hero.cta}
            </a>
          </div>
        </div>

        <div className="flex-1">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="mx-auto w-full max-w-md"
      aria-hidden="true"
    >
      <rect
        x="20"
        y="20"
        width="360"
        height="260"
        rx="16"
        fill="#0B3B4A"
      />
      {/* takvim ızgarası */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={45 + col * 55}
            y={50 + row * 45}
            width="40"
            height="30"
            rx="4"
            fill="#F7F4EF"
            opacity={0.12}
          />
        ))
      )}
      {/* yükselen doluluk çubukları */}
      <rect x="60" y="200" width="30" height="60" rx="4" fill="#4FA69A" />
      <rect x="110" y="170" width="30" height="90" rx="4" fill="#4FA69A" />
      <rect x="160" y="140" width="30" height="120" rx="4" fill="#E86A33" />
      <rect x="210" y="110" width="30" height="150" rx="4" fill="#E86A33" />
      <rect x="260" y="90" width="30" height="170" rx="4" fill="#E86A33" />
      <polyline
        points="75,195 125,165 175,135 225,105 275,85"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
