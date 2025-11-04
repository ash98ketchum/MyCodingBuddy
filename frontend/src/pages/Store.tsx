import Navbar from "@/components/Navbar";
import { Store as StoreIcon } from "lucide-react";

const Store = () => {
  return (
    <div className="min-h-screen circuit-bg">
      <Navbar />
      
      <main className="container mx-auto px-6 py-16">
        <div className="glass-panel p-12 rounded-xl text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <StoreIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Store Coming Soon
          </h1>
          <p className="text-xl text-muted-foreground">
            Premium features, swag, and more will be available here soon!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Store;