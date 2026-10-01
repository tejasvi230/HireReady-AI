import { ChevronDown, Pin, Sparkles, Trash2 } from "lucide-react";
import type { Question } from "../types";
import { categoryStyles, difficultyStyles } from "../lib/constants";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { cn } from "../lib/utils";

export function QuestionCard({
  question,
  expanded,
  explaining,
  onToggle,
  onPin,
  onDelete,
  onExplain,
  compact = false,
}: {
  question: Question;
  expanded: boolean;
  explaining?: boolean;
  onToggle: () => void;
  onPin: () => void;
  onDelete?: () => void;
  onExplain?: () => void;
  compact?: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/8 bg-[#12192a]">
      <div className="flex items-start gap-3 p-4 sm:p-5">
        <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-left">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge className={difficultyStyles[question.difficulty] ?? "bg-white/8 text-slate-300"}>
              {question.difficulty}
            </Badge>
            <Badge className={categoryStyles[question.category] ?? "bg-white/8 text-slate-300"}>
              {question.category}
            </Badge>
            {question.isPinned && (
              <Badge className="bg-indigo-500/15 text-indigo-200">
                <Pin className="h-3 w-3" />
                Pinned
              </Badge>
            )}
          </div>
          <h3 className="text-[15px] font-medium leading-6 text-white">{question.question}</h3>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onPin}
            className={cn(
              "rounded-lg p-2 transition-colors",
              question.isPinned
                ? "bg-indigo-500 text-white"
                : "text-slate-400 hover:bg-white/8 hover:text-white"
            )}
            aria-label={question.isPinned ? "Unpin question" : "Pin question"}
          >
            <Pin className="h-4 w-4" />
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
              aria-label="Delete question"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/8 hover:text-white"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="space-y-4 border-t border-white/8 px-4 py-4 sm:px-5 sm:py-5">
          <section>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Answer</p>
            <div className="whitespace-pre-wrap rounded-xl bg-[#0b1120] p-4 text-sm leading-7 text-slate-300">
              {question.answer}
            </div>
          </section>
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} className="bg-white/6 text-slate-300">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {question.aiExplanation && (
            <section className="rounded-xl border border-indigo-400/15 bg-indigo-500/8 p-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-indigo-200">
                <Sparkles className="h-3.5 w-3.5" />
                Explanation
              </p>
              <div className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
                {question.aiExplanation}
              </div>
            </section>
          )}
          {onExplain && !compact && (
            <Button variant="soft" size="sm" onClick={onExplain} disabled={explaining}>
              {explaining ? (
                <>
                  <Spinner />
                  Generating explanation…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {question.aiExplanation ? "Regenerate explanation" : "Get AI explanation"}
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
