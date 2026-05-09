import { SiteNavbar } from "@/components/layout/site-navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { AiLessons } from "@/components/landing/ai-lessons";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Benefits } from "@/components/landing/benefits";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { faqs } from "@/components/landing/faq-data";
import { FinalCta } from "@/components/landing/cta";
import { SiteFooter } from "@/components/landing/footer";
import { JsonLd } from "@/components/seo/json-ld";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TypeSprint",
  url: siteUrl,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "TypeSprint is a free typing tutor with structured lessons, real-time WPM and accuracy tracking, AI-generated drills, and progress analytics.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqPageLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <JsonLd data={[softwareApplicationLd, faqPageLd]} />
      <SiteNavbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <AiLessons />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
