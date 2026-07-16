import { Facebook, Instagram, Linkedin } from "lucide-react";
import { footer, siteConfig } from "@/lib/content";

const socialLinks = [
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "LinkedIn", href: "#", Icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-xl font-bold text-white">
              {siteConfig.name}
            </div>
            <p className="mt-3 max-w-xs text-sm">{footer.tagline}</p>
          </div>

          <nav aria-label="Footer gezinme" className="flex flex-col gap-3">
            {footer.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div>
            <a
              href={`mailto:${footer.email}`}
              className="text-sm hover:text-white"
            >
              {footer.email}
            </a>
            <div className="mt-4 flex gap-4">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row sm:justify-between">
          <p>{footer.copyright}</p>
          <div className="flex gap-6">
            {footer.legalLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
