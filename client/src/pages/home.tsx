import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect } from "react";
import { ScrollAnimationManager } from "@/lib/scroll-animations";
import { InteractiveCategoryShowcase } from "@/components/interactive-category-showcase";
import { 
  BookOpen, 
  Brain, 
  MapPin, 
  Trophy, 
  Users, 
  CheckCircle, 
  Target, 
  Zap,
  Star,
  Flame,
  Sparkles,
  TrendingUp,
  Globe
} from "lucide-react";

export default function Home() {
  useEffect(() => {
    // Initialize scroll animations for this page
    ScrollAnimationManager.observeElements();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background with gradient and animated elements */}
        <div className="absolute inset-0 gradient-bg opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background/5"></div>
        
        {/* Floating background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/3 rounded-full blur-3xl float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8 slide-up">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white/90 font-medium">Revolutionary Recycling Education</span>
              </div>
            </div>
            
            <h1 className="font-heading font-bold text-5xl md:text-7xl mb-8 text-white slide-up stagger-2" data-testid="text-hero-title">
              Transform Your World
              <br />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                One Sort at a Time
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed slide-up stagger-3" data-testid="text-hero-description">
              Master the art of recycling with our interactive platform. Learn, practice, and compete while making a real impact on our planet's future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center slide-up stagger-4">
              <Link href="/guide">
                <Button 
                  className="glass-effect text-white border-white/30 px-12 py-4 text-lg font-semibold hover-lift hover:bg-white/20 transition-all duration-300"
                  data-testid="button-start-learning"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Learning
                </Button>
              </Link>
              <Link href="/quiz">
                <Button 
                  variant="outline"
                  className="bg-white/10 border-2 border-white/40 text-white px-12 py-4 text-lg font-semibold hover-lift hover:bg-white hover:text-gray-900 transition-all duration-300"
                  data-testid="button-take-quiz"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Take Quiz
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 slide-up stagger-5">
              <div className="inline-flex items-center space-x-8 text-white/70">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">1,500+ Active Learners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-sm">12,000+ Quizzes Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="text-sm">250+ Recycling Centers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats Section */}
      <div className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Making a Real Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of eco-warriors transforming waste management worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center scroll-reveal stagger-1">
              <Card className="glass-effect border-primary/20 hover-lift group cursor-pointer">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-3xl mb-2 text-foreground" data-testid="text-stat-users">
                    1,500+
                  </h3>
                  <p className="text-muted-foreground font-medium">Active Eco-Warriors</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">Growing daily</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center scroll-reveal stagger-2">
              <Card className="glass-effect border-secondary/20 hover-lift group cursor-pointer">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-3xl mb-2 text-foreground" data-testid="text-stat-quizzes">
                    12,000+
                  </h3>
                  <p className="text-muted-foreground font-medium">Knowledge Tests Completed</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">97% success rate</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center scroll-reveal stagger-3">
              <Card className="glass-effect border-accent/20 hover-lift group cursor-pointer">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent to-accent/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-3xl mb-2 text-foreground" data-testid="text-stat-centers">
                    250+
                  </h3>
                  <p className="text-muted-foreground font-medium">Recycling Centers Mapped</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">Poland-wide coverage</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Category Showcase */}
      <InteractiveCategoryShowcase 
        onCategorySelect={(categoryId) => {
          // Navigate to guide page with category selected
          window.location.href = `/guide#${categoryId}`;
        }}
      />

      {/* Features Preview */}
      <div className="py-24 bg-card/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6" data-testid="text-features-title">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Everything You Need to
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Recycle Right
              </span>
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Comprehensive tools designed to transform you into an eco-warrior
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/guide">
              <Card className="glass-effect border-primary/20 hover-lift hover-glow group cursor-pointer scroll-reveal stagger-1" data-testid="card-feature-guide">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-primary transition-colors duration-300">Interactive Guide</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Master recycling with our comprehensive visual guides covering all waste types and sorting techniques.
                    </p>
                    <div className="mt-4 flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm">Start Learning</span>
                      <Target className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/quiz">
              <Card className="glass-effect border-secondary/20 hover-lift hover-glow group cursor-pointer scroll-reveal stagger-2" data-testid="card-feature-quiz">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-transparent rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-secondary transition-colors duration-300">Knowledge Quiz</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Challenge yourself with engaging quizzes, earn points, and track your recycling expertise growth.
                    </p>
                    <div className="mt-4 flex items-center text-secondary font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm">Take Quiz</span>
                      <Zap className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/locator">
              <Card className="glass-effect border-accent/20 hover-lift hover-glow group cursor-pointer scroll-reveal stagger-3" data-testid="card-feature-locator">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-accent transition-colors duration-300">Poland Map</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Explore interactive map of Poland with real recycling centers and eco-friendly locations near you.
                    </p>
                    <div className="mt-4 flex items-center text-accent font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm">Explore Map</span>
                      <Globe className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/leaderboard">
              <Card className="glass-effect border-success/20 hover-lift hover-glow group cursor-pointer scroll-reveal stagger-4" data-testid="card-feature-leaderboard">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success/20 to-transparent rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-success to-success/70 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-success transition-colors duration-300">Leaderboard</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Compete with eco-warriors worldwide, earn achievements, and climb the sustainability rankings.
                    </p>
                    <div className="mt-4 flex items-center text-success font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm">View Rankings</span>
                      <Star className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="scroll-reveal">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ready to Make a Difference?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join our community of eco-warriors and start your journey towards sustainable living today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth">
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 text-lg font-semibold hover-lift hover:shadow-2xl transition-all duration-300 border-0"
                  data-testid="button-get-started"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/guide">
                <Button 
                  variant="outline"
                  className="border-2 border-primary/30 text-primary hover:bg-primary/5 px-10 py-4 text-lg font-semibold hover-lift transition-all duration-300"
                  data-testid="button-explore-features"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
