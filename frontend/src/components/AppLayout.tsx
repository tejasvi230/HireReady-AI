import type { ReactNode } from "react";
import { ArrowLeft, BookOpen, Menu, Pin, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { AppTab } from "../types";
import { Brand } from "./Brand";
import { Button } from "./Button";
import { cn } from "../lib/utils";

const navItems: { id: AppTab; label: string; icon: typeof BookOpen }[] = [
  { id: "generate", label: "Generate interview", icon: Sparkles },
  { id: "sessions", label: "Saved sessions", icon: BookOpen },
  { id: "pinned", label: "Pinned questions", icon: Pin },
];

interface AppLayoutProps {
  tab: AppTab;
  onTabChange: (tab: AppTab) => void;
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
  sessionCount: number;
  pinnedCount: number;
  children: ReactNode;
}

export function AppLayout({
  tab,
  onTabChange,
  sidebarOpen,
  onSidebarOpenChange,
  sessionCount,
  pinnedCount,
  children,
}: AppLayoutProps) {
  const counts: Record<AppTab, number | null> = {
    generate: null,
    sessions: sessionCount,
    pinned: pinnedCount,
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/8 px-4">
        <Brand to="/" />
        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"
          onClick={() => onSidebarOpenChange(false)}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onTabChange(item.id);
                onSidebarOpenChange(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                active
                  ? "bg-indigo-500/15 text-white ring-1 ring-indigo-400/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 font-medium">{item.label}</span>
              {counts[item.id] != null && (
                <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] text-slate-300">
                  {counts[item.id]}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-white/8 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => onSidebarOpenChange(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-white/8 bg-[#0c1220] transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {sidebar}
      </aside>
      <div className="lg:pl-72">
        <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/8 bg-[#070b14]/85 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"
            onClick={() => onSidebarOpenChange(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">Interview studio</p>
            <p className="truncate text-xs text-slate-500">Generate, review, pin, and revisit sessions</p>
          </div>
          <Button size="sm" onClick={() => onTabChange("generate")}>
            New session
          </Button>
        </div>
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
