import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";

const Support = () => {
  return (
    <div className="min-h-screen circuit-bg">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Support
          </h1>
          <p className="text-muted-foreground">
            We're here to help. Get in touch with us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-xl text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">FAQ</h3>
            <p className="text-sm text-muted-foreground">
              Find answers to common questions
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
              <MessageSquare className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-muted-foreground">
              Join our Discord server
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted-foreground">
              support@mycodingbuddy.com
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-xl max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                className="bg-background/50 border-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                placeholder="How can we help?"
                className="bg-background/50 border-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                placeholder="Tell us more..."
                className="min-h-[150px] bg-background/50 border-primary/20"
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary-glow text-primary-foreground shadow-neon hover:shadow-neon-strong">
              Send Message
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Support;