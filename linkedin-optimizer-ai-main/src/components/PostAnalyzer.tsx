import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScoreRing } from "./ScoreRing";
import { MetricCard } from "./MetricCard";
import { SuggestionCard } from "./SuggestionCard";
import { 
  Loader2, 
  FileText, 
  Hash, 
  Eye, 
  MessageSquare,
  TrendingUp,
  Sparkles
} from "lucide-react";

interface AnalysisResult {
  overallScore: number;
  readability: number;
  structure: number;
  engagement: number;
  keywords: number;
  metrics: {
    wordCount: number;
    sentenceCount: number;
    avgSentenceLength: number;
    hashtagCount: number;
  };
  suggestions: Array<{
    type: "success" | "warning" | "info" | "tip";
    title: string;
    description: string;
  }>;
}

export const PostAnalyzer = () => {
  const [postText, setPostText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzePost = async () => {
    if (!postText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call with mock analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Mock analysis results based on post content
    const words = postText.split(/\s+/).filter(Boolean);
    const sentences = postText.split(/[.!?]+/).filter(Boolean);
    const hashtags = (postText.match(/#\w+/g) || []).length;
    
    const hasHook = postText.split('\n')[0]?.length < 100;
    const hasCTA = /\?|comment|share|like|follow|check|link/i.test(postText);
    const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(postText);
    
    const readabilityScore = Math.min(95, Math.max(40, 100 - (words.length / sentences.length) * 3));
    const structureScore = (hasHook ? 30 : 10) + (hasCTA ? 30 : 10) + (sentences.length > 2 ? 25 : 15) + (hasEmoji ? 15 : 5);
    const engagementScore = Math.min(90, (hasCTA ? 40 : 20) + (hashtags > 0 ? 20 : 5) + (words.length > 50 ? 25 : 15) + 10);
    const keywordScore = Math.min(85, hashtags * 15 + 40);
    
    const overallScore = Math.round((readabilityScore + structureScore + engagementScore + keywordScore) / 4);

    const suggestions: AnalysisResult["suggestions"] = [];
    
    if (hasHook) {
      suggestions.push({
        type: "success",
        title: "Strong Hook Detected",
        description: "Your opening line is concise and attention-grabbing. This is crucial for stopping the scroll.",
      });
    } else {
      suggestions.push({
        type: "warning",
        title: "Improve Your Hook",
        description: "Your opening line is quite long. Consider shortening it to under 100 characters to capture attention quickly.",
      });
    }
    
    if (!hasCTA) {
      suggestions.push({
        type: "tip",
        title: "Add a Call-to-Action",
        description: "Consider ending with a question or invitation to engage. This can significantly boost comments and shares.",
      });
    }
    
    if (hashtags === 0) {
      suggestions.push({
        type: "info",
        title: "Consider Adding Hashtags",
        description: "2-5 relevant hashtags can improve discoverability. Focus on industry-specific and trending tags.",
      });
    } else if (hashtags > 5) {
      suggestions.push({
        type: "warning",
        title: "Too Many Hashtags",
        description: "Using more than 5 hashtags can appear spammy. Consider reducing to 3-5 highly relevant ones.",
      });
    }

    suggestions.push({
      type: "tip",
      title: "Optimal Post Length",
      description: `Your post has ${words.length} words. LinkedIn's algorithm favors posts between 150-300 words for maximum reach.`,
    });

    setResult({
      overallScore,
      readability: Math.round(readabilityScore),
      structure: Math.round(structureScore),
      engagement: Math.round(engagementScore),
      keywords: Math.round(keywordScore),
      metrics: {
        wordCount: words.length,
        sentenceCount: sentences.length,
        avgSentenceLength: Math.round(words.length / sentences.length),
        hashtagCount: hashtags,
      },
      suggestions,
    });
    
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Your LinkedIn Post</h3>
        </div>
        <Textarea
          placeholder="Paste your LinkedIn post here... Include hooks, main content, hashtags, and CTAs for comprehensive analysis."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className="min-h-[200px] bg-muted/50 border-border/50 resize-none text-foreground placeholder:text-muted-foreground"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            {postText.length} characters • {postText.split(/\s+/).filter(Boolean).length} words
          </span>
          <Button
            variant="hero"
            onClick={analyzePost}
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
                Analyze Post
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Score Overview */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-6">Analysis Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="col-span-2 md:col-span-1 flex justify-center">
                <ScoreRing score={result.overallScore} label="Overall" size={140} strokeWidth={10} />
              </div>
              <div className="flex justify-center">
                <ScoreRing score={result.readability} label="Readability" size={100} strokeWidth={6} />
              </div>
              <div className="flex justify-center">
                <ScoreRing score={result.structure} label="Structure" size={100} strokeWidth={6} />
              </div>
              <div className="flex justify-center">
                <ScoreRing score={result.engagement} label="Engagement" size={100} strokeWidth={6} />
              </div>
              <div className="flex justify-center">
                <ScoreRing score={result.keywords} label="Keywords" size={100} strokeWidth={6} />
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={FileText}
              label="Word Count"
              value={result.metrics.wordCount}
              trend={result.metrics.wordCount >= 100 ? "up" : "down"}
            />
            <MetricCard
              icon={MessageSquare}
              label="Sentences"
              value={result.metrics.sentenceCount}
            />
            <MetricCard
              icon={Eye}
              label="Avg. Sentence"
              value={`${result.metrics.avgSentenceLength} words`}
              trend={result.metrics.avgSentenceLength <= 20 ? "up" : "down"}
            />
            <MetricCard
              icon={Hash}
              label="Hashtags"
              value={result.metrics.hashtagCount}
              trend={result.metrics.hashtagCount >= 2 && result.metrics.hashtagCount <= 5 ? "up" : "neutral"}
            />
          </div>

          {/* Suggestions */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">AI Suggestions</h3>
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
