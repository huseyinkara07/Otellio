import { Check } from "lucide-react";
import { pricing, demoAnchor } from "@/lib/content";

export default function Pricing() {
  return (
    <section id="fiyatlandirma" className="bg-white py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
          {pricing.title}
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {pricing.plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-card p-8 shadow-sm ${
                plan.highlighted
                  ? "border-2 border-accent bg-white md:-translate-y-2 md:shadow-lg"
                  : "border border-black/10 bg-sand"
              }`}
            >
              {plan.badge && (
                <span className="mb-3 inline-block w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-navy">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-xl font-bold text-navy">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.target}</p>
              <p className="mt-4 text-2xl font-bold text-navy">{plan.price}</p>
              <p className="mt-1 text-xs text-muted">{pricing.note}</p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-teal"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-ink">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={demoAnchor}
                className={`mt-8 inline-flex h-12 items-center justify-center rounded-button px-6 text-sm font-semibold ${
                  plan.highlighted
                    ? "bg-accent text-navy hover:brightness-110"
                    : "border border-navy text-navy hover:bg-navy hover:text-white"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
