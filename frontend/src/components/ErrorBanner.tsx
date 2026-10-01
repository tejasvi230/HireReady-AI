import { X } from "lucide-react";

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
      <p className="flex-1 leading-6">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-lg p-1 text-rose-200/80 hover:bg-rose-500/20 hover:text-white"
        aria-label="Dismiss error"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
