import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Code2, Target } from "lucide-react";
import StatsCard from "@/components/StatsCard";

const UserDashboard = () => {
  const { username } = useParams();

  const userStats = {
    problemsSolved: 247,
    streak: 30,
    rank: 1523,
    rating: 1847,
  };

  return (
    <div className="min-h-screen circuit-bg">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="glass-panel p-8 rounded-xl mb-8">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} />
              <AvatarFallback>{username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{username}</h1>
              <p className="text-muted-foreground mb-4">
                Competitive programmer • Full Stack Developer
              </p>
              <div className="flex gap-3">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Rank #{userStats.rank}
                </Badge>
                <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
                  Rating: {userStats.rating}
                </Badge>
                <Badge variant="outline">
                  🔥 {userStats.streak} day streak
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Code2}
            value={userStats.problemsSolved}
            label="Problems Solved"
          />
          <StatsCard
            icon={Target}
            value={userStats.streak}
            label="Current Streak"
            trend="🔥"
          />
          <StatsCard
            icon={Trophy}
            value={userStats.rating}
            label="Contest Rating"
          />
          <StatsCard
            icon={Calendar}
            value="156"
            label="Active Days"
          />
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Progress */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-6">Problem Progress</h3>
            <div className="space-y-4">
              {[
                { label: "Easy", solved: 98, total: 150, color: "bg-green-500" },
                { label: "Medium", solved: 112, total: 200, color: "bg-yellow-500" },
                { label: "Hard", solved: 37, total: 100, color: "bg-red-500" },
              ].map((category) => (
                <div key={category.label}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{category.label}</span>
                    <span className="text-muted-foreground">
                      {category.solved}/{category.total}
                    </span>
                  </div>
                  <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} transition-all duration-500`}
                      style={{ width: `${(category.solved / category.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Calendar */}
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-6">Activity Calendar</h3>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`aspect-square rounded ${
                    Math.random() > 0.5
                      ? "bg-primary/30 hover:bg-primary/50"
                      : "bg-muted/20 hover:bg-muted/30"
                  } transition-colors cursor-pointer`}
                  title={`${Math.floor(Math.random() * 10)} problems solved`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-muted/20 rounded" />
                <div className="w-4 h-4 bg-primary/20 rounded" />
                <div className="w-4 h-4 bg-primary/40 rounded" />
                <div className="w-4 h-4 bg-primary/60 rounded" />
                <div className="w-4 h-4 bg-primary/80 rounded" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;