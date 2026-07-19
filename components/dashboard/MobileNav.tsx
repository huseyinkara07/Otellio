"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { dashboard } from "@/lib/content";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-button text-navy"
        aria-expanded={isOpen}
        aria-controls="dashboard-mobile-menu"
        aria-label={isOpen ? dashboard.closeMenuLabel : dashboard.openMenuLabel}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          id="dashboard-mobile-menu"
          className="absolute inset-x-0 top-full z-40 border-t border-black/5 bg-white px-4 py-3 shadow-sm"
        >
          <DashboardNav variant="mobile" onNavigate={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
