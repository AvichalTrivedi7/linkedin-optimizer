import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AnalyzerTabs } from "@/components/AnalyzerTabs";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <AnalyzerTabs />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
