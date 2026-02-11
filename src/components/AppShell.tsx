"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DemoBadge from "./DemoBadge";

interface AppShellProps {
  title: string;
  subtitle: string;
  accentColor: string;
  children: React.ReactNode;
}

export default function AppShell({ title, subtitle, accentColor, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <DemoBadge />
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-40 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Portale</span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div>
            <h1 className="text-lg font-bold" style={{ color: accentColor }}>
              {title}
            </h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
