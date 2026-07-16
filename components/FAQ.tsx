"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faq } from "@/lib/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="sss" className="bg-sand py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
          {faq.title}
        </h2>

        <div className="mt-10 space-y-4">
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <div
                key={item.question}
                className="rounded-card bg-white shadow-sm"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-navy"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-6 pb-5 text-muted"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
