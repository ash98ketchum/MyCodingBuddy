import Navbar from "@/components/Navbar";
import { MessageSquare, ThumbsUp, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SAMPLE_DISCUSSIONS = [
  {
    id: 1,
    title: "What's the best approach for Two Sum?",
    author: "john_doe",
    tags: ["Array", "Hash Table"],
    replies: 12,
    likes: 34,
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    title: "Dynamic Programming patterns everyone should know",
    author: "code_master",
    tags: ["DP", "Tutorial"],
    replies: 45,
    likes: 128,
    timeAgo: "1 day ago",
  },
  {
    id: 3,
    title: "How to optimize O(n²) to O(n) in sliding window problems?",
    author: "algo_ninja",
    tags: ["Optimization", "Sliding Window"],
    replies: 23,
    likes: 67,
    timeAgo: "3 days ago",
  },
];

const Discuss = () => {
  return (
    <div className="min-h-screen circuit-bg">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Discussions
          </h1>
          <p className="text-muted-foreground">
            Share knowledge and learn from the community
          </p>
        </div>

        <div className="grid gap-4">
          {SAMPLE_DISCUSSIONS.map((discussion) => (
            <div key={discussion.id} className="glass-panel p-6 rounded-xl hover:scale-[1.01] transition-all cursor-pointer">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${discussion.author}`} />
                  <AvatarFallback>{discussion.author[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                    {discussion.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {discussion.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-primary/10 border-primary/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{discussion.author}</span>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{discussion.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{discussion.replies} replies</span>
                    </div>
                    <span>{discussion.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Discuss;