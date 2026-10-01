import { Brand } from "./Brand";

export function Footer() {
  return (
    <footer className="border-t border-white/8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6">
        <Brand />
        <p className="text-sm text-slate-500">
          Interview practice for real roles — questions stay in your saved sessions.
        </p>
      </div>
    </footer>
  );
}
