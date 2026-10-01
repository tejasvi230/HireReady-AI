import { ArrowRight, BookOpen, Lightbulb, Pin, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

const features = [
  {
    icon: Target,
    title: "Role-based interviews",
    body: "Choose a job role, experience level, and category. Sessions stay tied to that setup.",
  },
  {
    icon: Sparkles,
    title: "Generated questions",
    body: "Create a session, then generate interview questions and answers for that role.",
  },
  {
    icon: Lightbulb,
    title: "Answers and explanations",
    body: "Expand any question to read the answer, then request an explanation when you want more depth.",
  },
  {
    icon: Pin,
    title: "Pinned questions",
    body: "Pin items you want to revisit. They show up in one place across sessions.",
  },
  {
    icon: BookOpen,
    title: "Saved sessions",
    body: "Every generated interview is stored so you can open it later and continue reviewing.",
  },
];

const steps = [
  { n: "01", title: "Select role & experience", body: "Name the session, set the role, and pick experience plus category." },
  { n: "02", title: "Generate the interview", body: "Questions and answers are created for that session and saved." },
  { n: "03", title: "Review, pin, and return", body: "Open answers, pin what matters, and find it again in Saved sessions." },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.16),_transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
            <p className="mb-5 inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
              Interview practice studio
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
              Prepare for interviews with structured, saved question sets.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Generate a session for a real role, review answers in place, pin the questions worth keeping,
              and come back to your saved interviews.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/app?tab=generate">
                <Button size="lg" className="w-full sm:w-auto">
                  Start an interview
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/app?tab=sessions">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  View saved sessions
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-white/8">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">Built around the actual workflow</h2>
              <p className="mt-3 text-slate-400">
                Each screen maps to a step you already have: generate, review, pin, and reopen.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/8 bg-[#12192a] p-5"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-white/8 bg-[#0b1120]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">How it works</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <article key={step.n} className="rounded-2xl border border-white/8 bg-[#12192a] p-6">
                  <p className="text-xs font-medium tracking-widest text-indigo-300">{step.n}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
