"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { classroom } from "@/data/mock/feed";
import type { CurrentUser } from "@/utils/supabase/user";

export function NavShell({ children, user }: { children: ReactNode; user: CurrentUser | null }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    if (!drawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-linen bg-card px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={drawerOpen}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] text-cocoa"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <div className="flex items-center gap-[10px]">
          <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] text-white">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </div>
          <div>
            <div className="font-display text-[15px] leading-none font-semibold text-cocoa">
              OpenDayCare
            </div>
            <div className="text-[10.5px] text-sand">{classroom.name}</div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-[248px] flex-none flex-col border-r border-linen bg-card lg:flex">
          <Sidebar user={user} />
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          drawerOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-cocoa/40 transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className={`absolute inset-y-0 left-0 flex w-[248px] flex-col border-r border-linen bg-card transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar user={user} />
        </div>
      </div>
    </div>
  );
}
