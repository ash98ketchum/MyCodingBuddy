import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play, Clock, MemoryStick, CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const ProblemDetail = () => {
  const { problemId } = useParams();
  const [code, setCode] = useState("// Write your solution here");
  const [language, setLanguage] = useState("javascript");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock problem data
  const problem = {
    title: "Two Sum",
    difficulty: "Easy",
    rating: 1200,
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    tags: ["Array", "Hash Table", "Two Pointers"],
    companies: ["Google", "Amazon", "Meta", "Apple", "Microsoft"],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "Only one valid answer exists.",
    ],
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen circuit-bg">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8">
        <Link to="/problems" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Problems
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="glass-panel p-6 rounded-xl h-fit">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold">{problem.title}</h1>
                <Badge className={
                  problem.difficulty === "Easy" 
                    ? "bg-green-500/20 text-green-400 border-green-500/30" 
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }>
                  {problem.difficulty}
                </Badge>
                <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
                  {problem.rating}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {problem.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-primary/10 border-primary/30">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Companies:</span>
                {problem.companies.map((company) => (
                  <Badge key={company} variant="outline" className="text-xs">
                    {company}
                  </Badge>
                ))}
              </div>
            </div>

            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3 bg-muted/30">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="discuss">Discuss</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4 mt-4">
                <div>
                  <p className="text-foreground whitespace-pre-line mb-4">
                    {problem.description}
                  </p>
                </div>

                {problem.examples.map((example, idx) => (
                  <div key={idx} className="bg-muted/30 p-4 rounded-lg">
                    <div className="font-semibold mb-2">Example {idx + 1}:</div>
                    <div className="text-sm space-y-1">
                      <div><span className="text-muted-foreground">Input:</span> {example.input}</div>
                      <div><span className="text-muted-foreground">Output:</span> {example.output}</div>
                      <div><span className="text-muted-foreground">Explanation:</span> {example.explanation}</div>
                    </div>
                  </div>
                ))}

                <div>
                  <div className="font-semibold mb-2">Constraints:</div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="mt-4">
                <div className="space-y-3">
                  {[1, 2, 3].map((_, idx) => (
                    <div key={idx} className="glass-panel p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span className="font-medium text-primary">Accepted</span>
                        </div>
                        <span className="text-sm text-muted-foreground">2 hours ago</span>
                      </div>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>45ms</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MemoryStick className="h-4 w-4" />
                          <span>42.1 MB</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="discuss" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  Discussion feature coming soon...
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Code Editor */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Code</h2>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40 bg-background/50 border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-[400px] font-mono bg-background/50 border-primary/20 mb-4"
              placeholder="Write your code here..."
            />

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary-glow text-primary-foreground shadow-neon hover:shadow-neon-strong"
              >
                {isSubmitting ? (
                  "Running..."
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Code
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-primary/30 hover:bg-primary/10"
              >
                Submit
              </Button>
            </div>

            {isSubmitting && (
              <div className="mt-4 glass-panel p-4 rounded-lg animate-slide-up">
                <div className="text-primary font-medium mb-2">Running on test case 2...</div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-glow-pulse w-3/4" />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemDetail;