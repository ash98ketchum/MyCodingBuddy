import Navbar from "@/components/Navbar";
import { Trophy } from "lucide-react";

const Contest = () => {
  return (
    <div className="min-h-screen circuit-bg">
      <Navbar />
      
      <main className="container mx-auto px-6 py-16">
        <div className="glass-panel p-12 rounded-xl text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
            <Trophy className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Contests Coming Soon
          </h1>
          <p className="text-xl text-muted-foreground">
            We're working on bringing you competitive programming contests. Stay tuned!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Contest;