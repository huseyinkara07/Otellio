import { XCircle, CheckCircle2 } from "lucide-react";
import { problemSolution } from "@/lib/content";

export default function ProblemSolution() {
  return (
    <section className="bg-sand py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-navy sm:text-4xl">
          {problemSolution.title}
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-card bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-muted">
              {problemSolution.problemTitle}
            </h3>
            <ul className="mt-6 space-y-4">
              {problemSolution.problems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-muted"
                    aria-hidden="true"
                  />
                  <span className="text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border-2 border-teal/30 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-navy">
              {problemSolution.solutionTitle}
            </h3>
            <ul className="mt-6 space-y-4">
              {problemSolution.solutions.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-teal"
                    aria-hidden="true"
                  />
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
