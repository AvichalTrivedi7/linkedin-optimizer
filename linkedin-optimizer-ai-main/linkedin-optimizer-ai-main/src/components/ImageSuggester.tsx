import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { 
  Loader2, 
  Image as ImageIcon, 
  Sparkles,
  Camera,
  BarChart2,
  Users,
  Briefcase,
  Lightbulb,
  Quote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ImageSuggestion {
  type: string;
  icon: LucideIcon;
  title: string;
  description: string;
  examples: string[];
  relevanceScore: number;
}

export const ImageSuggester = () => {
  const [postText, setPostText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<ImageSuggestion[] | null>(null);

  const suggestImages = async () => {
    if (!postText.trim()) return;
    
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Analyze post content and suggest appropriate image types
    const lowerPost = postText.toLowerCase();
    const results: ImageSuggestion[] = [];

    // Personal story / leadership
    if (/i learned|my journey|lesson|story|experience|when i|reflection/i.test(lowerPost)) {
      results.push({
        type: "portrait",
        icon: Camera,
        title: "Professional Portrait",
        description: "Personal stories resonate best with authentic photos of yourself. A candid professional shot creates connection.",
        examples: [
          "Headshot with natural lighting",
          "Speaking at an event",
          "Behind-the-scenes work moment",
          "Candid office/workspace photo"
        ],
        relevanceScore: 95,
      });
    }

    // Data / insights / metrics
    if (/data|research|study|statistics|numbers|growth|increased|percent|%|\d+/i.test(lowerPost)) {
      results.push({
        type: "infographic",
        icon: BarChart2,
        title: "Data Visualization / Infographic",
        description: "Posts with data perform best with clean infographics. Visualize key statistics for instant understanding.",
        examples: [
          "Simple bar or line chart",
          "Key statistics highlight",
          "Before/after comparison",
          "Step-by-step infographic"
        ],
        relevanceScore: 90,
      });
    }

    // Team / collaboration
    if (/team|together|collaborate|we|our|partnership|colleagues/i.test(lowerPost)) {
      results.push({
        type: "team",
        icon: Users,
        title: "Team / Collaboration Photo",
        description: "Showcase the human side of your work. Team photos build trust and show company culture.",
        examples: [
          "Team meeting or brainstorm",
          "Group celebration moment",
          "Collaborative work session",
          "Team at company event"
        ],
        relevanceScore: 85,
      });
    }

    // Industry / professional
    if (/industry|business|market|strategy|leadership|executive|management/i.test(lowerPost)) {
      results.push({
        type: "professional",
        icon: Briefcase,
        title: "Professional / Corporate",
        description: "Establish authority with polished professional imagery. Perfect for thought leadership content.",
        examples: [
          "Conference or speaking engagement",
          "Modern office environment",
          "Professional workspace setup",
          "Industry event photo"
        ],
        relevanceScore: 80,
      });
    }

    // Tips / advice / how-to
    if (/tip|advice|how to|guide|step|help|learn|trick/i.test(lowerPost)) {
      results.push({
        type: "educational",
        icon: Lightbulb,
        title: "Educational Visual",
        description: "Break down complex advice into digestible visuals. Carousel posts work great for multi-step content.",
        examples: [
          "Numbered list graphic",
          "Carousel with tips",
          "Flowchart or process diagram",
          "Checklist visual"
        ],
        relevanceScore: 88,
      });
    }

    // Quote / inspiration
    if (/believe|inspire|motivation|quote|"|'|wisdom|truth/i.test(lowerPost)) {
      results.push({
        type: "quote",
        icon: Quote,
        title: "Quote Card",
        description: "Impactful quotes deserve clean, shareable graphics. Keep typography bold and backgrounds minimal.",
        examples: [
          "Bold quote on solid background",
          "Quote with subtle texture",
          "Quote with your portrait",
          "Minimalist text design"
        ],
        relevanceScore: 75,
      });
    }

    // Default suggestion if nothing specific matched
    if (results.length === 0) {
      results.push({
        type: "general",
        icon: ImageIcon,
        title: "Engaging Visual",
        description: "A relevant, high-quality image increases engagement by 2x. Choose visuals that complement your message.",
        examples: [
          "Professional headshot",
          "Relevant stock image",
          "Custom graphic or illustration",
          "Behind-the-scenes photo"
        ],
        relevanceScore: 70,
      });
    }

    // Sort by relevance
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    setSuggestions(results.slice(0, 4));
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Post Content</h3>
        </div>
        <Textarea
          placeholder="Paste your LinkedIn post here and get AI-powered image recommendations that will maximize engagement..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className="min-h-[180px] bg-muted/50 border-border/50 resize-none"
        />
        <div className="flex justify-end mt-4">
          <Button
            variant="hero"
            onClick={suggestImages}
            disabled={!postText.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get Suggestions
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Recommended Image Types</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <div
                  key={index}
                  className={cn(
                    "glass-card p-5 transition-all duration-300 hover:border-primary/30 hover:scale-[1.01]",
                    index === 0 && "md:col-span-2 border-primary/20"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">{suggestion.title}</h4>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {suggestion.relevanceScore}% match
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {suggestion.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.examples.map((example, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card p-4 border-accent/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground text-sm">Pro Tip</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Posts with images get 2x more engagement. Native uploads perform better than links. 
                  Keep dimensions at 1200x627px for optimal display across devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
