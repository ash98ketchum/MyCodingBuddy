import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProblemCard from "@/components/ProblemCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

const SAMPLE_PROBLEMS = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy" as const,
    tags: ["Array", "Hash Table"],
    solved: true,
    acceptanceRate: 49.2,
    companies: ["Google", "Amazon", "Meta"],
  },
  {
    id: "add-two-numbers",
    title: "Add Two Numbers",
    difficulty: "Medium" as const,
    tags: ["Linked List", "Math"],
    solved: false,
    acceptanceRate: 41.8,
    companies: ["Microsoft", "Apple"],
  },
  {
    id: "median-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard" as const,
    tags: ["Array", "Binary Search"],
    solved: false,
    acceptanceRate: 37.1,
    companies: ["Google", "Amazon"],
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating",
    difficulty: "Medium" as const,
    tags: ["String", "Sliding Window"],
    solved: true,
    acceptanceRate: 34.5,
    companies: ["Meta", "Amazon", "Netflix"],
  },
  {
    id: "reverse-integer",
    title: "Reverse Integer",
    difficulty: "Easy" as const,
    tags: ["Math"],
    solved: true,
    acceptanceRate: 27.3,
    companies: ["Amazon", "Google"],
  },
];

const Problems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const difficulties = ["Easy", "Medium", "Hard"];

  const filteredProblems = SAMPLE_PROBLEMS.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const stats = {
    total: SAMPLE_PROBLEMS.length,
    solved: SAMPLE_PROBLEMS.filter(p => p.solved).length,
    easy: SAMPLE_PROBLEMS.filter(p => p.difficulty === "Easy").length,
    medium: SAMPLE_PROBLEMS.filter(p => p.difficulty === "Medium").length,
    hard: SAMPLE_PROBLEMS.filter(p => p.difficulty === "Hard").length,
  };

  return (
    <div className="min-h-screen circuit-bg">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Problems
          </h1>
          <p className="text-muted-foreground">
            Solve {stats.total} coding challenges • {stats.solved} solved
          </p>
        </div>

        {/* Progress Overview */}
        <div className="glass-panel p-6 rounded-xl mb-8">
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary font-medium">
                  {stats.solved}/{stats.total}
                </span>
              </div>
              <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                  style={{ width: `${(stats.solved / stats.total) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg">{stats.easy}</div>
                <div className="text-muted-foreground">Easy</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-lg">{stats.medium}</div>
                <div className="text-muted-foreground">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold text-lg">{stats.hard}</div>
                <div className="text-muted-foreground">Hard</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-panel p-6 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {difficulties.map((diff) => (
                <Badge
                  key={diff}
                  variant={selectedDifficulty === diff ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedDifficulty === diff
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                >
                  {diff}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} {...problem} />
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No problems found matching your criteria
          </div>
        )}
      </main>
    </div>
  );
};

export default Problems;