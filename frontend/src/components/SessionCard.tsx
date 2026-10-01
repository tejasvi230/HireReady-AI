import { Trash2 } from "lucide-react";
import type { Session } from "../types";
import { categories, categoryStyles, labelForExperience, questionCount } from "../lib/constants";
import { formatDate } from "../lib/utils";
import { Badge } from "./Badge";

export function SessionCard({
  session,
  onOpen,
  onDelete,
}: {
  session: Session;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const Icon = categories.find((item) => item.value === session.category)?.icon;
  const count = questionCount(session.questions);

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/8 bg-[#12192a] p-5 transition-colors hover:border-indigo-400/30">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${categoryStyles[session.category] ?? "bg-white/10 text-slate-300"}`}>
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="rounded-lg p-2 text-slate-500 opacity-100 transition-colors hover:bg-rose-500/10 hover:text-rose-300 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Delete session"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <button type="button" onClick={onOpen} className="flex flex-1 flex-col text-left">
        <h3 className="text-base font-semibold text-white">{session.title}</h3>
        <p className="mt-1 text-sm text-slate-400">{session.jobRole}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="bg-white/6 text-slate-300">{labelForExperience(session.experienceLevel)}</Badge>
          <Badge className="bg-white/6 text-slate-300">{count} questions</Badge>
        </div>
        <p className="mt-auto pt-4 text-xs text-slate-500">{formatDate(session.createdAt)}</p>
      </button>
    </article>
  );
}
