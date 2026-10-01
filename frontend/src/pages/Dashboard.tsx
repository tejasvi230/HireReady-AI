import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronLeft, Pin } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { Button } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { ErrorBanner } from "../components/ErrorBanner";
import { QuestionCard } from "../components/QuestionCard";
import { SessionCard } from "../components/SessionCard";
import { SessionForm, type SessionFormValues } from "../components/SessionForm";
import { PageSpinner } from "../components/Spinner";
import {
  createSession,
  deleteQuestion as deleteQuestionApi,
  deleteSession as deleteSessionApi,
  explainQuestion,
  fetchPinnedQuestions,
  fetchSessions,
  fetchSessionWithQuestions,
  generateSessionQuestions,
  getErrorMessage,
  togglePinQuestion,
} from "../lib/api";
import type { AppTab, Question, Session } from "../types";
import { labelForCategory, labelForExperience, questionCount } from "../lib/constants";

const emptyForm: SessionFormValues = {
  title: "",
  jobRole: "",
  experienceLevel: "mid",
  category: "technical",
};

function isTab(value: string | null): value is AppTab {
  return value === "sessions" || value === "pinned" || value === "generate";
}

function asQuestions(session: Session | null): Question[] {
  if (!session?.questions) return [];
  return session.questions.filter((item): item is Question => typeof item !== "string");
}

function Dashboard() {
  const [params, setParams] = useSearchParams();
  const rawTab = params.get("tab");
  const tab: AppTab = isTab(rawTab) ? rawTab : "generate";
  const sessionId = params.get("session");

  const [sessions, setSessions] = useState<Session[]>([]);
  const [pinnedQuestions, setPinnedQuestions] = useState<Question[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [form, setForm] = useState<SessionFormValues>(emptyForm);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [explainingId, setExplainingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<
    | { type: "session"; id: string }
    | { type: "question"; id: string }
    | null
  >(null);

  const setTab = (next: AppTab) => {
    setCurrentSession(null);
    setParams({ tab: next });
  };

  const openSession = (id: string) => {
    setParams({ tab: "sessions", session: id });
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setListLoading(true);
        const [sessionRows, pinnedRows] = await Promise.all([
          fetchSessions(),
          fetchPinnedQuestions(),
        ]);
        if (cancelled) return;
        setSessions(Array.isArray(sessionRows) ? sessionRows : []);
        setPinnedQuestions(Array.isArray(pinnedRows) ? pinnedRows : []);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not load sessions. Check that the backend is running."));
      } finally {
        if (!cancelled) setListLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setCurrentSession(null);
      return;
    }
    const id = sessionId;
    let cancelled = false;
    async function loadSession() {
      try {
        setSessionLoading(true);
        const session = await fetchSessionWithQuestions(id);
        if (!cancelled) setCurrentSession(session);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not open that session."));
      } finally {
        if (!cancelled) setSessionLoading(false);
      }
    }
    loadSession();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const questions = useMemo(() => asQuestions(currentSession), [currentSession]);

  const refreshPinned = async () => {
    try {
      const pinnedRows = await fetchPinnedQuestions();
      setPinnedQuestions(Array.isArray(pinnedRows) ? pinnedRows : []);
    } catch (err) {
      setError(getErrorMessage(err, "Could not refresh pinned questions."));
    }
  };

  const applyGenerated = (session: Session, generated: Awaited<ReturnType<typeof generateSessionQuestions>>) => {
    const withQuestions = { ...session, questions: generated.questions };
    setSessions((prev) => [withQuestions, ...prev.filter((item) => item._id !== session._id)]);
    setCurrentSession(withQuestions);
    setNotice(generated.partial ? generated.message || "Some questions were generated and saved." : null);
    setParams({ tab: "sessions", session: session._id! });
  };

  const handleGenerate = async () => {
    if (generating) return;
    let created: Session | undefined;
    try {
      setGenerating(true);
      setError(null);
      setNotice(null);
      created = await createSession({ ...form, title: form.title.trim(), jobRole: form.jobRole.trim() });
      if (!created?._id) throw new Error("Session was not created");
      const saved = created;
      setSessions((prev) => [saved, ...prev.filter((item) => item._id !== saved._id)]);
      const generated = await generateSessionQuestions(created._id);
      applyGenerated(created, generated);
      setForm(emptyForm);
    } catch (err) {
      if (created?._id) {
        setCurrentSession(created);
        setParams({ tab: "sessions", session: created._id });
      }
      setError(getErrorMessage(err, "Could not generate questions. Open the saved session and retry."));
    } finally {
      setGenerating(false);
    }
  };

  const handleRetryGeneration = async () => {
    if (!currentSession?._id || generating) return;
    const saved = currentSession;
    try {
      setGenerating(true);
      setError(null);
      setNotice(null);
      // A timed-out browser request may already have finished saving.
      const latest = await fetchSessionWithQuestions(saved._id!);
      if (asQuestions(latest).length) {
        setCurrentSession(latest);
        setSessions((prev) => prev.map((item) => item._id === latest._id ? latest : item));
        return;
      }
      const generated = await generateSessionQuestions(saved._id!);
      applyGenerated(saved, generated);
    } catch (err) {
      setError(getErrorMessage(err, "Could not generate questions. Please retry."));
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteSessionApi(id);
      setSessions((prev) => prev.filter((item) => item._id !== id));
      if (sessionId === id) setParams({ tab: "sessions" });
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete that session."));
    }
  };

  const handlePin = async (questionId: string) => {
    try {
      const updated = await togglePinQuestion(questionId);
      const apply = (question: Question) =>
        question._id === questionId ? { ...question, isPinned: updated.isPinned } : question;
      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              questions: asQuestions(prev).map(apply),
            }
          : prev
      );
      await refreshPinned();
    } catch (err) {
      setError(getErrorMessage(err, "Could not update pin status."));
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestionApi(questionId);
      setCurrentSession((prev) =>
        prev
          ? { ...prev, questions: asQuestions(prev).filter((question) => question._id !== questionId) }
          : prev
      );
      setPinnedQuestions((prev) => prev.filter((question) => question._id !== questionId));
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete that question."));
    }
  };

  const handleExplain = async (question: Question) => {
    if (!question._id) return;
    try {
      setExplainingId(question._id);
      const explanation = await explainQuestion(question._id);
      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              questions: asQuestions(prev).map((item) =>
                item._id === question._id ? { ...item, aiExplanation: explanation } : item
              ),
            }
          : prev
      );
      setPinnedQuestions((prev) =>
        prev.map((item) => (item._id === question._id ? { ...item, aiExplanation: explanation } : item))
      );
    } catch (err) {
      setError(getErrorMessage(err, "Could not generate an explanation for that question."));
    } finally {
      setExplainingId(null);
    }
  };

  const renderGenerate = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Generate interview</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
          Select a role and experience level, then generate questions. The session is saved automatically.
        </p>
      </div>
      <div className="rounded-2xl border border-white/8 bg-[#12192a] p-5 sm:p-6">
        <SessionForm values={form} onChange={setForm} onSubmit={handleGenerate} loading={generating} />
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Saved sessions</h1>
          <p className="mt-1 text-sm text-slate-400">Open a session to review questions, answers, and pins.</p>
        </div>
        <Button onClick={() => setTab("generate")}>New session</Button>
      </div>
      {listLoading ? (
        <PageSpinner label="Loading sessions" />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No saved sessions"
          description="Generate an interview first. Sessions appear here after questions are created."
          actionLabel="Generate interview"
          onAction={() => setTab("generate")}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sessions.map((session) => (
            <SessionCard
              key={session._id}
              session={session}
              onOpen={() => session._id && openSession(session._id)}
              onDelete={() => session._id && setConfirm({ type: "session", id: session._id })}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderSessionDetail = () => {
    if (sessionLoading) return <PageSpinner label="Loading interview" />;
    if (!currentSession) return null;
    return (
      <div className="space-y-6">
        <div>
          <button
            type="button"
            onClick={() => setParams({ tab: "sessions" })}
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Saved sessions
          </button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-white">{currentSession.title}</h1>
              <p className="mt-1 text-sm text-slate-400">
                {currentSession.jobRole}
                <span className="mx-2 text-slate-600">·</span>
                {labelForExperience(currentSession.experienceLevel)}
                <span className="mx-2 text-slate-600">·</span>
                {labelForCategory(currentSession.category)}
              </p>
            </div>
            <p className="shrink-0 rounded-full bg-white/6 px-3 py-1 text-sm text-slate-300">
              {questionCount(questions)} questions
            </p>
          </div>
        </div>
        {questions.length === 0 ? (
          generating ? <PageSpinner label="Generating questions…" /> : <EmptyState
            icon={BookOpen}
            title="No questions in this session"
            description="Your session is saved. Retry generation using the same role and experience."
            actionLabel="Retry generation"
            onAction={handleRetryGeneration}
          />
        ) : (
          <div className="space-y-3">
            {questions.map((question) => (
              <QuestionCard
                key={question._id}
                question={question}
                expanded={expandedQuestion === question._id}
                explaining={explainingId === question._id}
                onToggle={() =>
                  setExpandedQuestion((current) => (current === question._id ? null : question._id ?? null))
                }
                onPin={() => question._id && handlePin(question._id)}
                onDelete={() => question._id && setConfirm({ type: "question", id: question._id })}
                onExplain={() => handleExplain(question)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPinned = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Pinned questions</h1>
        <p className="mt-1 text-sm text-slate-400">Questions you marked while reviewing a session.</p>
      </div>
      {listLoading ? (
        <PageSpinner label="Loading pinned questions" />
      ) : pinnedQuestions.length === 0 ? (
        <EmptyState
          icon={Pin}
          title="Nothing pinned yet"
          description="Open a saved session, expand a question, and pin it to keep it here."
          actionLabel="Browse sessions"
          onAction={() => setTab("sessions")}
        />
      ) : (
        <div className="space-y-3">
          {pinnedQuestions.map((question) => (
            <QuestionCard
              key={question._id}
              question={question}
              expanded={expandedQuestion === question._id}
              explaining={explainingId === question._id}
              onToggle={() =>
                setExpandedQuestion((current) => (current === question._id ? null : question._id ?? null))
              }
              onPin={() => question._id && handlePin(question._id)}
              onExplain={() => handleExplain(question)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AppLayout
      tab={sessionId ? "sessions" : tab}
      onTabChange={setTab}
      sidebarOpen={sidebarOpen}
      onSidebarOpenChange={setSidebarOpen}
      sessionCount={sessions.length}
      pinnedCount={pinnedQuestions.length}
    >
      {notice && <p role="status" className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">{notice}</p>}
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {sessionId ? renderSessionDetail() : tab === "pinned" ? renderPinned() : tab === "sessions" ? renderSessions() : renderGenerate()}
      {confirm && (
        <ConfirmDialog
          title={confirm.type === "session" ? "Delete this session?" : "Delete this question?"}
          description="This cannot be undone."
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            if (confirm.type === "session") handleDeleteSession(confirm.id);
            else handleDeleteQuestion(confirm.id);
            setConfirm(null);
          }}
        />
      )}
    </AppLayout>
  );
}

export default Dashboard;
