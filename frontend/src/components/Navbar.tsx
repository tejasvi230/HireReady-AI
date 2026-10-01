import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Brand } from "./Brand";
import { Button } from "./Button";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/app?tab=generate", label: "Generate" },
  { href: "/app?tab=sessions", label: "Sessions" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const onLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#070b14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand />
        <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/app?tab=generate" className="hidden sm:block">
            <Button size="sm">{onLanding ? "Open studio" : "New interview"}</Button>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-300 hover:bg-white/5 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/8 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link to="/app?tab=generate" onClick={() => setOpen(false)}>
              <Button className="w-full">Open studio</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
