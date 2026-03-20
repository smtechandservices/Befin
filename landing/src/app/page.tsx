import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustedBy } from "@/components/TrustedBy";
import { FinanceStages } from "@/components/FinanceStages";
import { SmartCard } from "@/components/SmartCard";
import { NewsletterSection } from "@/components/NewsletterSection";
import { ComingSoon } from "@/components/ComingSoon";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

export default function Home() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <TrustedBy />
            <FinanceStages />
            <SmartCard />
            <NewsletterSection />
            <ComingSoon />
            <Testimonials />
            <Footer />
        </main>
    );
}
