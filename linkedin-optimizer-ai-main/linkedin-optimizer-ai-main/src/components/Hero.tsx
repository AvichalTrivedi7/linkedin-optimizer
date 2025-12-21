import { ArrowRight, BarChart3, Image, User, Zap } from "lucide-react";
import { Button } from "./ui/button";

export const Hero = () => {
  const scrollToAnalyzer = () => {
    document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Powered by Mistral AI</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Optimize Your{" "}
            <span className="text-gradient">LinkedIn</span>
            <br />
            Presence with AI
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Analyze your posts, profile, and get AI-powered suggestions to boost engagement. 
            Combine statistical precision with semantic intelligence.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl" onClick={scrollToAnalyzer} className="group">
              Start Analyzing
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="glass" size="xl">
              Learn More
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { icon: BarChart3, label: "Post Analysis" },
              { icon: User, label: "Profile Optimization" },
              { icon: Image, label: "Image Suggestions" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
