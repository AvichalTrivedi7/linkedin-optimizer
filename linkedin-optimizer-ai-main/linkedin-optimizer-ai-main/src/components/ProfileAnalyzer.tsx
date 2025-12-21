import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { ScoreRing } from "./ScoreRing";
import { SuggestionCard } from "./SuggestionCard";
import { 
  Loader2, 
  User, 
  Briefcase, 
  Award,
  Sparkles,
  Target
} from "lucide-react";

interface ProfileResult {
  overallScore: number;
  sections: {
    headline: number;
    about: number;
    experience: number;
    skills: number;
  };
  suggestions: Array<{
    type: "success" | "warning" | "info" | "tip";
    title: string;
    description: string;
  }>;
}

export const ProfileAnalyzer = () => {
  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [experience, setExperience] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ProfileResult | null>(null);

  const analyzeProfile = async () => {
    if (!headline.trim() && !about.trim() && !experience.trim()) return;
    
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock analysis
    const headlineScore = headline.length > 10 && headline.length < 120 
      ? Math.min(95, 60 + Math.random() * 35) 
      : Math.max(30, 40 + Math.random() * 20);
    
    const hasNumbers = /\d/.test(about);
    const hasKeywords = /help|expert|specialist|leader|passionate/i.test(about);
    const aboutScore = about.length > 100 
      ? Math.min(90, 50 + (hasNumbers ? 15 : 0) + (hasKeywords ? 15 : 0) + Math.random() * 15)
      : Math.max(25, 30 + Math.random() * 20);

    const hasBullets = /•|·|-|\*/g.test(experience);
    const hasMetrics = /\d+%|\$\d+|\d+x|\d+ [a-z]+/i.test(experience);
    const experienceScore = experience.length > 50
      ? Math.min(90, 45 + (hasBullets ? 15 : 0) + (hasMetrics ? 20 : 0) + Math.random() * 15)
      : Math.max(20, 30 + Math.random() * 15);

    const skillsScore = Math.min(85, 55 + Math.random() * 25);

    const overallScore = Math.round((headlineScore + aboutScore + experienceScore + skillsScore) / 4);

    const suggestions: ProfileResult["suggestions"] = [];

    if (headline.length < 50) {
      suggestions.push({
        type: "warning",
        title: "Expand Your Headline",
        description: "Your headline is quite short. Include your role, specialty, and unique value proposition to stand out.",
      });
    } else {
      suggestions.push({
        type: "success",
        title: "Good Headline Length",
        description: "Your headline has good length. Ensure it clearly communicates your professional identity and value.",
      });
    }

    if (!hasNumbers && about.length > 50) {
      suggestions.push({
        type: "tip",
        title: "Add Quantifiable Achievements",
        description: "Numbers and metrics in your About section make your accomplishments more credible and memorable.",
      });
    }

    if (!hasBullets && experience.length > 50) {
      suggestions.push({
        type: "info",
        title: "Use Bullet Points",
        description: "Breaking experience into bullet points improves readability and helps recruiters scan quickly.",
      });
    }

    if (!hasMetrics && experience.length > 50) {
      suggestions.push({
        type: "tip",
        title: "Quantify Your Impact",
        description: "Add metrics to your experience (e.g., 'Increased sales by 40%') to demonstrate measurable results.",
      });
    }

    suggestions.push({
      type: "info",
      title: "Keep Skills Updated",
      description: "Regularly update your skills section with relevant keywords. Aim for 10-15 highly relevant skills.",
    });

    setResult({
      overallScore,
      sections: {
        headline: Math.round(headlineScore),
        about: Math.round(aboutScore),
        experience: Math.round(experienceScore),
        skills: Math.round(skillsScore),
      },
      suggestions,
    });
    
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Profile Sections</h3>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Headline</label>
          <Input
            placeholder="e.g., Senior Product Manager | AI & SaaS | Helping teams build user-centric products"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="bg-muted/50 border-border/50"
          />
          <span className="text-xs text-muted-foreground mt-1 block">{headline.length}/220 characters</span>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">About Section</label>
          <Textarea
            placeholder="Paste your LinkedIn About/Summary section here..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="min-h-[150px] bg-muted/50 border-border/50 resize-none"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Experience (Current Role)</label>
          <Textarea
            placeholder="Paste your current role description, responsibilities, and achievements..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="min-h-[120px] bg-muted/50 border-border/50 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="hero"
            onClick={analyzeProfile}
            disabled={(!headline.trim() && !about.trim() && !experience.trim()) || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Profile
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Profile Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="col-span-2 md:col-span-1 flex justify-center">
                <ScoreRing score={result.overallScore} label="Overall" size={140} strokeWidth={10} />
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={result.sections.headline} label="Headline" size={90} strokeWidth={6} />
                <Briefcase className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={result.sections.about} label="About" size={90} strokeWidth={6} />
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={result.sections.experience} label="Experience" size={90} strokeWidth={6} />
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={result.sections.skills} label="Skills" size={90} strokeWidth={6} />
                <Award className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Optimization Tips</h3>
            </div>
            <div className="space-y-4">
              {result.suggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={index}
                  type={suggestion.type}
                  title={suggestion.title}
                  description={suggestion.description}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
