import { Code2, Users, TrendingUp, Target, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import { useEffect, useState } from "react";

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 15,
    duration: 30 + Math.random() * 30,
  }));

  // Generate floating code symbols
  const codeSymbols = ['<', '>', '{', '}', '[', ']', '/', '*', '=', ';'];
  const floatingSymbols = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    symbol: codeSymbols[i % codeSymbols.length],
    left: `${Math.random() * 90}%`,
    top: `${Math.random() * 80}%`,
    delay: Math.random() * 10,
    duration: 40 + Math.random() * 40,
    rotation: Math.random() * 360,
  }));

  // Generate floating glass objects (fewer, more subtle)
  const glassObjects = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 90}%`,
    top: `${Math.random() * 80}%`,
    width: 120 + Math.random() * 150,
    height: 120 + Math.random() * 150,
    delay: Math.random() * 10,
    duration: 50 + Math.random() * 40,
    borderRadius: Math.random() > 0.5 ? '50%' : `${Math.random() * 20}px`,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="min-h-screen circuit-bg relative overflow-hidden">
      {/* Floating Background Orbs */}
      <div className="floating-orbs" style={{ transform: `translateY(${scrollY * 0.02}px)` }} />
      
      {/* Floating Code Symbols */}
      <div className="floating-particles">
        {floatingSymbols.map((item) => (
          <div
            key={`symbol-${item.id}`}
            className="code-symbol"
            style={{
              left: item.left,
              top: item.top,
              animation: `drift-slow ${item.duration}s ease-in-out infinite`,
              animationDelay: `${item.delay}s`,
              transform: `rotate(${item.rotation}deg)`,
            }}
          >
            {item.symbol}
          </div>
        ))}
      </div>
      
      {/* Floating Glass Objects */}
      <div className="floating-particles">
        {glassObjects.map((obj) => (
          <div
            key={`glass-${obj.id}`}
            className="floating-glass"
            style={{
              left: obj.left,
              top: obj.top,
              width: `${obj.width}px`,
              height: `${obj.height}px`,
              borderRadius: obj.borderRadius,
              animation: `drift-slow ${obj.duration}s ease-in-out infinite`,
              animationDelay: `${obj.delay}s`,
              transform: `rotate(${obj.rotation}deg)`,
            }}
          />
        ))}
      </div>
      
      {/* Floating Particles */}
      <div className="floating-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="floating-particle"
            style={{
              left: particle.left,
              top: particle.top,
              animation: `drift ${particle.duration}s ease-in-out infinite, pulse-glow 3s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      
      <Navbar />
      
      <main className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <div 
          className="text-center mb-20 animate-slide-up relative parallax-layer"
          style={{ transform: `translateY(${scrollY * 0.005}px)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-30 blur-3xl">
            <div 
              className="w-96 h-96 bg-primary/30 rounded-full animate-scale-pulse" 
              style={{ transform: `scale(${1 + scrollY * 0.0001})` }}
            />
          </div>
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent animate-float-slow relative z-10 leading-tight">
            Master Coding Challenges
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed">
            Practice algorithmic problems from top companies. Track your progress.
            Compete with developers worldwide.
          </p>
          <div className="flex gap-4 justify-center relative z-10">
            <Link to="/problems">
              <Button className="group bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-neon hover:shadow-neon-strong transition-all hover:scale-105">
                <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Start Solving
              </Button>
            </Link>
            <Link to="/u/demo">
              <Button variant="outline" className="border-primary/30 hover:bg-primary/10 px-8 py-6 text-lg rounded-xl hover:scale-105 transition-all hover:border-primary/50">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 relative parallax-layer"
          style={{ transform: `translateY(${scrollY * 0.003}px)` }}
        >
          <div className="absolute inset-0 -z-10">
            <div 
              className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float-slow" 
              style={{ transform: `translate(${scrollY * 0.002}px, ${scrollY * -0.003}px)` }}
            />
            <div 
              className="absolute top-1/3 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-scale-pulse" 
              style={{ transform: `translate(${scrollY * -0.002}px, ${scrollY * 0.002}px)` }}
            />
          </div>
          <StatsCard
            icon={Code2}
            value="2,536"
            label="Problems Available"
            trend="+12 today"
          />
          <StatsCard
            icon={Users}
            value="9,036"
            label="Active Users"
            trend="+156 today"
          />
          <StatsCard
            icon={TrendingUp}
            value="1,194"
            label="Solutions Today"
            trend="+8%"
          />
          <StatsCard
            icon={Target}
            value="30"
            label="Daily Streak"
            trend="New record!"
          />
        </div>

        {/* Features Section */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 parallax-layer"
          style={{ transform: `translateY(${scrollY * 0.002}px)` }}
        >
          <div className="glass-panel p-8 rounded-xl hover:scale-105 transition-all duration-500 group cursor-pointer">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all group-hover:shadow-neon">
              <Code2 className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">1000+ Problems</h3>
            <p className="text-muted-foreground leading-relaxed">
              Curated coding challenges from easy to hard, covering all major algorithms and data structures.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-xl hover:scale-105 transition-all duration-500 group cursor-pointer">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-all group-hover:shadow-purple">
              <Award className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">Track Progress</h3>
            <p className="text-muted-foreground leading-relaxed">
              Visual progress tracking with calendars, charts, and detailed statistics on your coding journey.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-xl hover:scale-105 transition-all duration-500 group cursor-pointer">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all group-hover:shadow-neon">
              <TrendingUp className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Company Tags</h3>
            <p className="text-muted-foreground leading-relaxed">
              See which top tech companies ask each problem in their interviews. Prepare smarter.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;