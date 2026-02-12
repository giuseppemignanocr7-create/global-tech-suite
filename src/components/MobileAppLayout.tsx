"use client";

import { useState, ReactNode } from "react";
import { Menu, X } from "lucide-react";
import DemoBadge from "./DemoBadge";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Props {
  navItems: NavItem[];
  activePage: string;
  onPageChange: (id: string) => void;
  accentColor: string;
  appName: string;
  sidebar: ReactNode;
  children: ReactNode;
}

export default function MobileAppLayout({
  navItems,
  activePage,
  onPageChange,
  accentColor,
  appName,
  sidebar,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <DemoBadge />

      {/* ── Mobile top header ── */}
      <header className="lg:hidden sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border px-4 py-2.5 flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 -ml-1 hover:bg-muted rounded-lg transition-colors"
          aria-label="Apri menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold truncate" style={{ color: accentColor }}>
          {appName}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {navItems.find((n) => n.id === activePage)?.label ?? ""}
        </span>
      </header>

      {/* ── Mobile sidebar overlay ── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-card border-r border-border flex flex-col h-full overflow-y-auto z-10">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted z-20 transition-colors"
              aria-label="Chiudi menu"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card/50 flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        {sidebar}
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border safe-area-bottom">
        <div className="flex justify-around items-center py-1.5 px-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0 ${
                  active ? "scale-105" : "text-muted-foreground"
                }`}
                style={active ? { color: accentColor } : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-medium truncate max-w-[56px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
