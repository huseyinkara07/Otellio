import { BarChart3, CircleDollarSign, LineChart, Mail } from "lucide-react";
import { features } from "@/lib/content";

const icons = [BarChart3, CircleDollarSign, LineChart, Mail];

export default function Features() {
  return (
    <section id="ozellikler" className="bg-sand py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
          {features.title}
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <div
                key={item.title}
                className="rounded-card bg-white p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-muted">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
