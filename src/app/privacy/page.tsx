import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/prose-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TypeSprint collects, uses, and protects your data.",
};

const EFFECTIVE = "18 April 2025";

export default function PrivacyPage() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle={`Effective date: ${EFFECTIVE}`}
    >
      <p>
        TypeSprint (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
        operates this website. This policy explains what data we collect, why we
        collect it, and how you can control it.
      </p>

      <h2>1. Data we collect</h2>
      <h3>Account data</h3>
      <p>
        When you create an account we collect your email address, display name,
        and (if you sign in with Google) your Google profile ID. Passwords are
        hashed and never stored in plain text.
      </p>
      <h3>Typing session data</h3>
      <p>
        When you complete a timed sprint or lesson we store your words-per-minute,
        accuracy, mistake count, characters typed, session duration, and a
        timestamp. We do not record the individual keystrokes you type — only the
        aggregate results.
      </p>
      <h3>Usage data</h3>
      <p>
        Our hosting provider (Vercel) automatically logs request metadata such as
        IP address, browser user-agent, and page URLs for security and
        performance monitoring. We do not use third-party analytics trackers.
      </p>

      <h2>2. How we use your data</h2>
      <ul>
        <li>To provide the typing practice and progress-tracking features.</li>
        <li>To authenticate you and maintain your session.</li>
        <li>
          To compute dashboard statistics (best WPM, accuracy trends, streaks).
        </li>
        <li>
          To send transactional emails (password reset, email verification) — no
          marketing emails unless you opt in.
        </li>
      </ul>

      <h2>3. Data sharing</h2>
      <p>
        We do not sell your data. We share data only with:
      </p>
      <ul>
        <li>
          <strong>Vercel</strong> — our hosting and serverless infrastructure
          provider.
        </li>
        <li>
          <strong>Google</strong> — if you choose to sign in via Google OAuth;
          Google&rsquo;s own privacy policy applies to that interaction.
        </li>
      </ul>

      <h2>4. Cookies and sessions</h2>
      <p>
        We use a single session cookie (HttpOnly, Secure, SameSite=Lax) to keep
        you signed in. No third-party tracking cookies are set.
      </p>

      <h2>5. Data retention</h2>
      <p>
        Your account and session data are retained for as long as your account
        is active. You can delete your account at any time from your profile
        settings; all associated data is removed within 30 days.
      </p>

      <h2>6. Your rights</h2>
      <p>
        Depending on your jurisdiction you may have the right to access, correct,
        export, or delete your personal data. Email us at{" "}
        <a href="mailto:privacy@typesprint.app">privacy@typesprint.app</a> and we
        will respond within 30 days.
      </p>

      <h2>7. Children</h2>
      <p>
        TypeSprint is not directed at children under 13. We do not knowingly
        collect data from children. If you believe a child has created an account,
        please contact us and we will delete it.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this policy occasionally. We will post the new effective
        date at the top of this page and, for material changes, notify signed-in
        users by email.
      </p>

      <h2>9. Contact</h2>
      <p>
        <a href="mailto:privacy@typesprint.app">privacy@typesprint.app</a>
      </p>
    </ProsePage>
  );
}
