import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Founder from "@/components/Founder";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import DemoForm from "@/components/DemoForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Features />
        <Founder />
        <Pricing />
        <FAQ />
        <DemoForm />
      </main>
      <Footer />
    </>
  );
}
