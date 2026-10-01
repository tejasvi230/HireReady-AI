import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "soft";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-indigo-500 text-white hover:bg-indigo-400 shadow-sm shadow-indigo-500/20 disabled:hover:bg-indigo-500",
  secondary:
    "bg-white/5 text-slate-100 ring-1 ring-white/10 hover:bg-white/10",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
  danger: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/20 hover:bg-rose-500/25",
  soft: "bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-400/20 hover:bg-indigo-500/25",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-5 text-base rounded-xl gap-2",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
