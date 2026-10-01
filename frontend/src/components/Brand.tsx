import { Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export function Brand({ compact = false, to = "/" }: { compact?: boolean; to?: string }) {
  return (
    <Link to={to} className="flex min-w-0 items-center gap-2.5 text-white">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500">
        <Brain className="h-5 w-5" />
      </span>
      <span className={cn("min-w-0", compact && "hidden sm:block")}>
        <span className="block truncate text-sm font-semibold leading-none">InterviewAI</span>
        <span className="mt-1 block text-[11px] leading-none text-slate-400">Prep studio</span>
      </span>
    </Link>
  );
}
