import Link from "next/link";
import { siteConfig } from "@/lib/content";
import type { LegalPageContent } from "@/lib/legalContent";

// KVKK ve Gizlilik sayfalarinin ortak sablonu (app/kvkk, app/gizlilik).
export default function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <main className="min-h-screen bg-sand px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-navy">
            {siteConfig.name}
          </Link>
        </div>

        <article className="rounded-card bg-white p-8 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold text-navy">{content.title}</h1>
          <p className="mt-2 text-sm text-muted">{content.updatedAt}</p>
          <p className="mt-6 text-ink">{content.intro}</p>

          {content.sections.map((section) => (
            <section key={section.heading} className="mt-8">
              <h2 className="text-xl font-semibold text-navy">
                {section.heading}
              </h2>
              {section.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-6 text-ink">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-ink">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-navy underline hover:text-accent"
          >
            ← {content.backToHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
