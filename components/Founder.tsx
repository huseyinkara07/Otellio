import { User } from "lucide-react";
import { founder } from "@/lib/content";

export default function Founder() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy text-white">
          <User className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-navy sm:text-3xl">
          {founder.title}
        </h2>
        <p className="mt-4 text-lg text-muted">{founder.body}</p>
      </div>
    </section>
  );
}
