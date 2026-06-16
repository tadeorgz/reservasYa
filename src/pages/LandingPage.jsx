import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import ProblemSection from "../components/landing/ProblemSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import BusinessTypesSection from "../components/landing/BusinessTypesSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import PricingSection from "../components/landing/PricingSection";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-[#0D231B] text-white overflow-hidden">
            <LandingNavbar />
            <HeroSection />
            <ProblemSection />
            <HowItWorksSection />
            <BusinessTypesSection />
            <FeaturesSection />
            <PricingSection />
        </main>
    );
}