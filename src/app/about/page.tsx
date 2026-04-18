import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/prose-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about TypeSprint — why it was built, who it's for, and what makes it different.",
};

export default function AboutPage() {
  return (
    <ProsePage
      eyebrow="About"
      title="Why TypeSprint exists"
      subtitle="A focused typing tutor for learners who want measurable progress, not gimmicks."
    >
      <h2>The problem with most typing tools</h2>
      <p>
        Most typing tutors were built in the early 2000s and it shows. They are
        cluttered with ads, locked behind paywalls for basic features, and give
        you no real sense of whether you are actually improving. You finish a
        session with a WPM number but no idea what to do next.
      </p>

      <h2>What we built instead</h2>
      <p>
        TypeSprint is a clean, fast, distraction-free typing tutor. Open a
        sprint, start typing, and see your results immediately. No account
        required to start. If you do sign up, every session is stored and your
        dashboard shows real trends over time — not just today's number.
      </p>
      <p>
        The lesson library is structured the same way a good teacher would
        structure a course: home-row drills first, then common words, then
        numbers and symbols, then full paragraphs, then coding snippets. Each
        stage is short enough to finish in a few minutes so you always have a
        reason to come back.
      </p>

      <h2>Who it is for</h2>
      <ul>
        <li>Students who spend hours typing and want to do it faster.</li>
        <li>
          Developers who notice their thoughts outpace their fingers at the
          keyboard.
        </li>
        <li>
          Office workers who know that even 10 extra WPM would save meaningful
          time each week.
        </li>
        <li>Anyone starting from scratch who wants a patient, structured path.</li>
      </ul>

      <h2>What is next</h2>
      <p>
        We are actively working on more lesson categories, custom text practice,
        multiplayer sprints, and deeper analytics. If you have ideas or
        feedback, reach out — we read every message.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, bug reports, or feature requests:{" "}
        <a href="mailto:hello@typesprint.app">hello@typesprint.app</a>
      </p>
    </ProsePage>
  );
}
