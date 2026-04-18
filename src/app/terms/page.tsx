import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/prose-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of TypeSprint.",
};

const EFFECTIVE = "18 April 2025";

export default function TermsPage() {
  return (
    <ProsePage
      eyebrow="Legal"
      title="Terms of Service"
      subtitle={`Effective date: ${EFFECTIVE}`}
    >
      <p>
        By accessing or using TypeSprint you agree to these terms. If you do not
        agree, please do not use the service.
      </p>

      <h2>1. The service</h2>
      <p>
        TypeSprint provides a web-based typing practice tool including timed
        sprints, structured lessons, and (for registered users) progress tracking
        via a personal dashboard. Features may change over time.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must provide accurate information when creating an account. You are
        responsible for keeping your credentials secure and for all activity that
        occurs under your account. Notify us immediately if you suspect
        unauthorised access.
      </p>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the service for any unlawful purpose.</li>
        <li>
          Attempt to probe, scan, or test the vulnerability of the service or
          bypass any security measures.
        </li>
        <li>
          Scrape, spider, or extract data from the service by automated means
          without our written permission.
        </li>
        <li>
          Impersonate any person or entity or misrepresent your affiliation with
          any person or entity.
        </li>
      </ul>

      <h2>4. Intellectual property</h2>
      <p>
        All content, design, and code on TypeSprint is owned by or licensed to
        us. You may not copy, modify, or distribute it without our written
        permission. Your own typing session data remains yours.
      </p>

      <h2>5. Disclaimer of warranties</h2>
      <p>
        The service is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; without warranties of any kind, express or implied,
        including fitness for a particular purpose or uninterrupted availability.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, TypeSprint is not liable for any
        indirect, incidental, or consequential damages arising from your use of
        or inability to use the service.
      </p>

      <h2>7. Termination</h2>
      <p>
        We may suspend or terminate your account at any time for violation of
        these terms. You may delete your account at any time from your profile
        settings.
      </p>

      <h2>8. Governing law</h2>
      <p>
        These terms are governed by the laws of the jurisdiction in which
        TypeSprint operates, without regard to conflict-of-law principles.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these terms occasionally. Continued use of the service
        after changes are posted constitutes acceptance of the new terms. We will
        notify signed-in users by email for material changes.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href="mailto:legal@typesprint.app">legal@typesprint.app</a>
      </p>
    </ProsePage>
  );
}
