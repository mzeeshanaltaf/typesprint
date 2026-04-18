import { SiteNavbar } from "@/components/layout/site-navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Benefits } from "@/components/landing/benefits";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/cta";
import { SiteFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <Hero />
        <Features />
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
