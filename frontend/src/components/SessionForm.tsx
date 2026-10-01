import { categories, experienceLevels } from "../lib/constants";
import { Button } from "./Button";
import { Spinner } from "./Spinner";

export interface SessionFormValues {
  title: string;
  jobRole: string;
  experienceLevel: string;
  category: string;
}

interface SessionFormProps {
  values: SessionFormValues;
  onChange: (values: SessionFormValues) => void;
  onSubmit: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export function SessionForm({
  values,
  onChange,
  onSubmit,
  loading,
  submitLabel = "Generate interview",
}: SessionFormProps) {
  const fieldClass =
    "h-11 w-full rounded-xl border border-white/10 bg-[#0b1120] px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-500/20";

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-200">Session title</span>
          <input
            required
            maxLength={100}
            disabled={loading}
            value={values.title}
            onChange={(event) => onChange({ ...values, title: event.target.value })}
            placeholder="Frontend interview — React"
            className={fieldClass}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-slate-200">Job role</span>
          <input
            required
            maxLength={200}
            disabled={loading}
            value={values.jobRole}
            onChange={(event) => onChange({ ...values, jobRole: event.target.value })}
            placeholder="Frontend engineer"
            className={fieldClass}
          />
        </label>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-200">Experience</span>
          <div className="grid grid-cols-2 gap-2">
            {experienceLevels.map((level) => {
              const selected = values.experienceLevel === level.value;
              return (
                <button
                  key={level.value}
                  type="button"
                  disabled={loading}
                  onClick={() => onChange({ ...values, experienceLevel: level.value })}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "border-indigo-400/40 bg-indigo-500/15"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <span className="block text-sm font-medium text-white">{level.label}</span>
                  <span className="text-xs text-slate-400">{level.hint}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-200">Category</span>
          <div className="grid grid-cols-1 gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const selected = values.category === category.value;
              return (
                <button
                  key={category.value}
                  type="button"
                  disabled={loading}
                  onClick={() => onChange({ ...values, category: category.value })}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? "border-indigo-400/40 bg-indigo-500/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!values.title.trim() || !values.jobRole.trim() || loading}>
        {loading ? (
          <>
            <Spinner />
            Generating questions…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
