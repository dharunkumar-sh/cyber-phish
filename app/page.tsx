import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WorkflowSection from "@/components/WorkflowSection";
import ProcessSection from "@/components/ProcessSection";
import Features from "@/components/Features";
import WhySection from "@/components/WhySection";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen bg-(--background) text-(--foreground) selection:bg-cyber-purple selection:text-white">
      <Navbar />
      <Hero />
      <WorkflowSection />
      <ProcessSection />
      <Features />
      <WhySection />
      <FAQ />
    </main>
  );
}
