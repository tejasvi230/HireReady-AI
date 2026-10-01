import { LoaderCircle } from "lucide-react";
import { cn } from "../lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle className={cn("h-4 w-4 animate-spin", className)} />;
}

export function PageSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-400">
      <Spinner className="h-6 w-6 text-indigo-400" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
