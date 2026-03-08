import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeUpload } from "@/components/ResumeUpload";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AnalyzerLoader } from "@/components/AnalyzerLoader";
import { ResumeAnalysis } from "@/types/analysis";
import { Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error("Please upload or paste your resume first");
      return;
    }
    if (!jobRole.trim()) {
      toast.error("Please enter the target job role");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText: resumeText.trim(), jobRole: jobRole.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAnalysis(data as ResumeAnalysis);
      toast.success("Analysis complete!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="gradient-hero py-10 sm:py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-medium text-primary-foreground">
            <Zap className="h-3.5 w-3.5" /> Powered by AI
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl font-display">
            AI Resume Analyzer
          </h1>
          <p className="mt-3 text-base text-primary-foreground/70">
            Get instant AI-powered feedback on your resume. Optimize for ATS,
            identify skill gaps, and land your dream role.
          </p>
        </motion.div>
      </header>

      <main className="mx-auto max-w-4xl px-4 -mt-8 pb-16 space-y-8">
        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="text-lg">Upload Your Resume</CardTitle>
              <CardDescription>
                Upload a PDF, image, or paste your resume text to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ResumeUpload onTextExtracted={setResumeText} resumeText={resumeText} />

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Job Role</label>
                <Input
                  placeholder="e.g. AI Engineer, Data Scientist, Software Developer..."
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resumeText.trim() || !jobRole.trim()}
                className="w-full gradient-primary text-primary-foreground font-semibold h-11"
                size="lg"
              >
                {isAnalyzing ? (
                  "Analyzing..."
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Analyze Resume
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading */}
        {isAnalyzing && <AnalyzerLoader />}

        {/* Results */}
        {analysis && !isAnalyzing && (
          <ResultsDashboard analysis={analysis} jobRole={jobRole} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        AI Resume Analyzer — Built with Lovable
      </footer>
    </div>
  );
}
