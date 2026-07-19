import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { dashboard } from "@/lib/content";
import DashboardNav from "@/components/dashboard/DashboardNav";
import MobileNav from "@/components/dashboard/MobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware zaten korumayi uyguluyor; bu ikinci kontrol, layout'un
  // dogrudan/farkli bir yoldan render edildigi durumlar icin savunma
  // katmanidir (bkz. Next.js + Supabase SSR onerilen deseni).
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-sand">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy text-white md:flex">
        <div className="px-6 py-6 text-xl font-bold">{dashboard.brand}</div>
        <div className="flex-1">
          <DashboardNav variant="sidebar" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="relative flex items-center justify-between border-b border-black/5 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <MobileNav />
            <div className="text-lg font-semibold text-navy md:hidden">
              {dashboard.brand}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-muted sm:inline">
              {dashboard.welcomePrefix}, {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-button border border-navy px-4 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {dashboard.logoutLabel}
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
