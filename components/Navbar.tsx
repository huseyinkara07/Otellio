"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  navLinks,
  ctaLabel,
  demoAnchor,
  loginLabel,
  loginHref,
  siteConfig,
} from "@/lib/content";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-surface/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6"
        aria-label="Ana gezinme"
      >
        <a href="#" className="text-xl font-bold text-navy">
          {siteConfig.name}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-accent"
            >
              {link.label}
            </a>
          ))}
          <Link
            href={loginHref}
            className="inline-flex h-12 items-center justify-center rounded-button border border-navy px-5 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
          >
            {loginLabel}
          </Link>
          <a
            href={demoAnchor}
            className="inline-flex h-12 items-center justify-center rounded-button bg-accent px-5 text-sm font-semibold text-navy hover:brightness-110"
          >
            {ctaLabel}
          </a>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-button text-navy md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      {isOpen && (
        <div
          id="mobile-menu"
          className="flex flex-col gap-1 border-t border-black/5 bg-surface px-4 pb-4 md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-button px-2 py-3 text-base font-medium text-ink hover:bg-sand"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href={loginHref}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-button border border-navy px-5 text-base font-semibold text-navy hover:bg-navy hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            {loginLabel}
          </Link>
          <a
            href={demoAnchor}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-button bg-accent px-5 text-base font-semibold text-navy hover:brightness-110"
            onClick={() => setIsOpen(false)}
          >
            {ctaLabel}
          </a>
        </div>
      )}
    </header>
  );
}
