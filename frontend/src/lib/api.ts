import axios from "axios";
import type { Question, Session } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 180000,
});

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

/**
 * Pulls the most useful message out of a failed API call. The backend
 * returns { message } (and sometimes { error }) on failure — fall back to
 * axios/JS's own error message, and only use the generic fallback if
 * nothing else is available.
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; error?: string } | undefined;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (err.message) return err.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export async function fetchSessions() {
  const response = await api.get("/sessions");
  return unwrap<Session[]>(response.data);
}

export async function fetchSession(id: string) {
  const response = await api.get(`/sessions/${id}`);
  return unwrap<Session>(response.data);
}

export async function fetchQuestions() {
  const response = await api.get("/questions");
  return unwrap<Question[]>(response.data);
}

export async function fetchSessionWithQuestions(id: string) {
  // The backend now populates `questions` on this endpoint directly, so
  // this is one call instead of fetching every question and filtering
  // client-side.
  const session = await fetchSession(id);
  const questions = (session.questions || []).filter(
    (item): item is Question => typeof item !== "string"
  );
  return { ...session, questions };
}

export async function createSession(body: {
  title: string;
  jobRole: string;
  experienceLevel: string;
  category: string;
}) {
  const response = await api.post("/sessions", body);
  return unwrap<Session>(response.data);
}

export async function generateSessionQuestions(sessionId: string) {
  const response = await api.post(`/sessions/${sessionId}/generate`);
  const payload = response.data as { data?: Question[]; partial?: boolean; message?: string };
  const questions = unwrap<Question[]>(response.data);
  if (!Array.isArray(questions) || !questions.length) {
    throw new Error("The server returned no questions. Please retry this saved session.");
  }
  return { questions, partial: Boolean(payload.partial), message: payload.message };
}

export async function deleteSession(sessionId: string) {
  await api.delete(`/sessions/${sessionId}`);
}

export async function fetchPinnedQuestions() {
  const response = await api.get("/questions/pinned/all");
  return unwrap<Question[]>(response.data);
}

export async function togglePinQuestion(questionId: string) {
  const response = await api.put(`/questions/${questionId}/pin`);
  return unwrap<Question>(response.data);
}

export async function deleteQuestion(questionId: string) {
  await api.delete(`/questions/${questionId}`);
}

export async function explainQuestion(questionId: string) {
  const response = await api.post(`/questions/${questionId}/explain`);
  const payload = response.data as { explanation?: string; data?: { explanation?: string } };
  return payload.explanation ?? payload.data?.explanation ?? "";
}
