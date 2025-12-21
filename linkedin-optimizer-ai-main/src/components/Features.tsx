import { 
  BarChart3, 
  Brain, 
  Gauge, 
  Image, 
  Lightbulb, 
  Shield,
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Brain,
    title: "Hybrid AI Analysis",
    description: "Combines statistical metrics with Mistral 7B semantic understanding for accurate, grounded insights.",
    gradient: "from-primary/20 to-accent/20",
  },
  {
    icon: Gauge,
    title: "Readability Scoring",
    description: "Flesch-Kincaid, Coleman-Liau, and other proven metrics to ensure your content is accessible.",
    gradient: "from-accent/20 to-primary/20",
  },
  {
    icon: BarChart3,
    title: "Engagement Prediction",
    description: "ML-based scoring predicts how well your post will perform based on structure and content.",
    gradient: "from-success/20 to-primary/20",
  },
  {
    icon: TrendingUp,
    title: "Profile Optimization",
    description: "Analyze headline, about section, and experience for maximum recruiter visibility.",
    gradient: "from-primary/20 to-success/20",
  },
  {
    icon: Image,
    title: "Smart Image Suggestions",
    description: "AI-powered recommendations for images that complement your post's topic and tone.",
    gradient: "from-warning/20 to-accent/20",
  },
  {
    icon: Lightbulb,
    title: "Actionable Insights",
    description: "Get specific, implementable suggestions—not vague advice. Every tip is backed by data.",
    gradient: "from-accent/20 to-warning/20",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Stand Out</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our hybrid pipeline combines deterministic analysis with AI reasoning 
            for more accurate, reliable, and actionable optimization suggestions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={cn(
                  "glass-card p-6 transition-all duration-300",
                  "hover:border-primary/30 hover:scale-[1.02] group"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                  "bg-gradient-to-br",
                  feature.gradient,
                  "group-hover:shadow-glow-sm transition-shadow duration-300"
                )}>
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tech Stack Banner */}
        <div className="mt-16 glass-card p-6 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Local-First Architecture</h4>
                <p className="text-sm text-muted-foreground">
                  Runs on your machine. No cloud dependency. Privacy guaranteed.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-secondary text-sm text-secondary-foreground">Python</span>
              <span className="px-3 py-1.5 rounded-lg bg-secondary text-sm text-secondary-foreground">Mistral 7B</span>
              <span className="px-3 py-1.5 rounded-lg bg-secondary text-sm text-secondary-foreground">NLTK</span>
              <span className="px-3 py-1.5 rounded-lg bg-secondary text-sm text-secondary-foreground">Transformers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
