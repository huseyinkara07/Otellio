import { Upload, TrendingUp, Tag } from "lucide-react";
import { howItWorks } from "@/lib/content";

const icons = [Upload, TrendingUp, Tag];

export default function HowItWorks() {
  return (
    <section id="nasil-calisir" className="bg-white py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
          {howItWorks.title}
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {howItWorks.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <div
                key={step.number}
                className="rounded-card bg-sand p-8 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="mt-4 text-sm font-semibold text-navy">
                  Adım {step.number}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-muted">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
