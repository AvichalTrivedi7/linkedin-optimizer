import { Linkedin, Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="about" className="border-t border-border/50 py-12 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Linkedin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">LinkOptimize</h3>
                <p className="text-xs text-muted-foreground">AI-Powered</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Optimize your LinkedIn presence with AI-powered analysis. 
              Combine statistical precision with semantic intelligence for better engagement and visibility.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#analyzer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Analyzer
                </a>
              </li>
              <li>
                <a href="https://github.com/AvichalTrivedi7/linkedin-optimizer" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  GitHub Repo
                </a>
              </li>
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Technology</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Mistral 7B (Local)</li>
              <li className="text-sm text-muted-foreground">Python Backend</li>
              <li className="text-sm text-muted-foreground">React Frontend</li>
              <li className="text-sm text-muted-foreground">NLP Analysis</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 LinkOptimize. Built for LinkedIn optimization.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/AvichalTrivedi7/linkedin-optimizer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Github className="w-5 h-5 text-foreground" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Twitter className="w-5 h-5 text-foreground" />
            </a>
            <a 
              href="#" 
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Linkedin className="w-5 h-5 text-foreground" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
