import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  Plus,
  BarChart3,
  Clock,
  Target,
  LogOut,
  Settings2,
  Trash2,
  Loader2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface AnalysisRecord {
  id: string;
  job_role: string;
  ats_score: number;
  skill_match_percentage: number;
  formatting_score: number;
  experience_score: number;
  keyword_score: number;
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
  created_at: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchAnalyses();
  }, [user]);

  const fetchAnalyses = async () => {
    const { data, error } = await supabase
      .from("resume_analyses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load analyses");
    } else {
      setAnalyses((data as AnalysisRecord[]) || []);
    }
    setLoading(false);
  };

  const deleteAnalysis = async (id: string) => {
    const { error } = await supabase.from("resume_analyses").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Analysis deleted");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const avgScore = analyses.length
    ? Math.round(analyses.reduce((sum, a) => sum + a.ats_score, 0) / analyses.length)
    : 0;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-display">ResumeAI</span>
          </button>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button size="sm" variant="outline" onClick={() => navigate("/settings")}>
              <Settings2 className="mr-1.5 h-3.5 w-3.5" /> Settings
            </Button>
            <Button size="sm" variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Welcome back, {user?.user_metadata?.full_name || user?.email}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
            <Card className="shadow-card border-border/50">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analyses.length}</p>
                  <p className="text-xs text-muted-foreground">Total Analyses</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-border/50">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgScore}</p>
                  <p className="text-xs text-muted-foreground">Avg ATS Score</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-border/50">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {analyses.length ? Math.max(...analyses.map((a) => a.ats_score)) : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Best Score</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mb-8">
            <Button onClick={() => navigate("/")} className="gradient-primary text-primary-foreground font-semibold">
              <Plus className="mr-2 h-4 w-4" /> New Analysis
            </Button>
          </motion.div>

          {/* History */}
          <motion.div variants={fadeUp}>
            <h2 className="text-lg font-semibold font-display mb-4">Analysis History</h2>
            {analyses.length === 0 ? (
              <Card className="shadow-card border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground font-medium">No analyses yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Upload a resume to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {analyses.map((a) => (
                  <Card
                    key={a.id}
                    className="shadow-card border-border/50 hover:shadow-elevated transition-shadow cursor-pointer"
                    onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm truncate">{a.job_role}</h3>
                            <Badge
                              variant={a.ats_score >= 70 ? "default" : a.ats_score >= 50 ? "secondary" : "destructive"}
                              className="text-xs"
                            >
                              ATS: {a.ats_score}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(a.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="hidden sm:flex items-center gap-3 mr-4">
                            <div className="text-center">
                              <p className="text-lg font-bold text-primary">{a.skill_match_percentage}%</p>
                              <p className="text-[10px] text-muted-foreground">Skills</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAnalysis(a.id);
                            }}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {expandedId === a.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t space-y-4"
                        >
                          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                            {[
                              { label: "Formatting", value: a.formatting_score },
                              { label: "Skills Match", value: a.skill_match_percentage },
                              { label: "Experience", value: a.experience_score },
                              { label: "Keywords", value: a.keyword_score },
                            ].map((item) => (
                              <div key={item.label} className="space-y-1">
                                <p className="text-xs text-muted-foreground">{item.label}</p>
                                <Progress value={item.value} className="h-1.5" />
                                <p className="text-xs font-semibold">{item.value}%</p>
                              </div>
                            ))}
                          </div>

                          <div>
                            <p className="text-xs font-semibold mb-1">Summary</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{a.summary}</p>
                          </div>

                          {(a.missing_skills as string[]).length > 0 && (
                            <div>
                              <p className="text-xs font-semibold mb-1.5">Missing Skills</p>
                              <div className="flex flex-wrap gap-1.5">
                                {(a.missing_skills as string[]).map((skill, i) => (
                                  <Badge key={i} variant="secondary" className="text-[10px]">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
