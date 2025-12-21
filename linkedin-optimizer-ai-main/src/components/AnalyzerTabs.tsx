import { useState } from "react";
import { cn } from "@/lib/utils";
import { BarChart3, User, Image } from "lucide-react";
import { PostAnalyzer } from "./PostAnalyzer";
import { ProfileAnalyzer } from "./ProfileAnalyzer";
import { ImageSuggester } from "./ImageSuggester";

const tabs = [
  {
    id: "post",
    label: "Post Analyzer",
    icon: BarChart3,
    description: "Analyze post quality & engagement",
  },
  {
    id: "profile",
    label: "Profile Optimizer",
    icon: User,
    description: "Optimize your LinkedIn profile",
  },
  {
    id: "image",
    label: "Image Suggester",
    icon: Image,
    description: "Get image recommendations",
  },
];

export const AnalyzerTabs = () => {
  const [activeTab, setActiveTab] = useState("post");

  return (
    <section id="analyzer" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI-Powered Analysis Tools
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get actionable insights to improve your LinkedIn presence. 
            Powered by advanced NLP and our local Mistral AI model.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300",
                  "border backdrop-blur-sm",
                  isActive
                    ? "bg-primary/10 border-primary/30 text-foreground shadow-glow-sm"
                    : "bg-card/50 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
                <div className="text-left">
                  <span className="font-semibold block">{tab.label}</span>
                  <span className="text-xs opacity-70 hidden sm:block">{tab.description}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "post" && <PostAnalyzer />}
          {activeTab === "profile" && <ProfileAnalyzer />}
          {activeTab === "image" && <ImageSuggester />}
        </div>
      </div>
    </section>
  );
};
