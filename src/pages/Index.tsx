import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeUpload } from "@/components/ResumeUpload";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AnalyzerLoader } from "@/components/AnalyzerLoader";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { useAuth } from "@/hooks/useAuth";
import { ResumeAnalysis } from "@/types/analysis";
import {
  Sparkles,
  Zap,
  Target,
  Search,
  Lightbulb,
  FileText,
  Upload,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
  Github,
  Mail,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const features = [
  { icon: BarChart3, title: "ATS Score Analysis", desc: "Get a detailed ATS compatibility score with actionable breakdown." },
  { icon: Search, title: "Missing Skills Detection", desc: "Identify critical skills gaps for your target job role." },
  { icon: Lightbulb, title: "AI Resume Suggestions", desc: "Receive personalized improvement recommendations from AI." },
  { icon: FileText, title: "Resume Summary Generator", desc: "Auto-generate a professional summary tailored to the role." },
  { icon: Shield, title: "Resume Feedback Report", desc: "Download a comprehensive PDF report of your analysis." },
];

const steps = [
  { num: "01", icon: Upload, title: "Upload Your Resume", desc: "Upload a PDF, image, or paste your resume text." },
  { num: "02", icon: Target, title: "Enter Target Role", desc: "Specify the job role you're applying for." },
  { num: "03", icon: Zap, title: "AI Analyzes Resume", desc: "Our AI engine evaluates ATS compatibility and skills." },
  { num: "04", icon: CheckCircle2, title: "Get Insights", desc: "Receive scores, suggestions, and an improvement report." },
];

const benefits = [
  { icon: TrendingUp, title: "Boost Interview Chances", desc: "Optimize your resume to pass ATS filters used by 90%+ of companies." },
  { icon: Clock, title: "Save Hours of Work", desc: "Get instant AI feedback instead of manual resume reviews." },
  { icon: Shield, title: "Stay Competitive", desc: "Identify and fill skill gaps before your competition does." },
];

export default function Index() {
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const analyzerRef = useRef<HTMLDivElement>(null);

  const scrollToAnalyzer = () => {
    analyzerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-display">ResumeAI</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button size="sm" onClick={scrollToAnalyzer} className="gradient-primary text-primary-foreground">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-20 right-0 h-[300px] w-[400px] rounded-full bg-secondary/10 blur-[100px]" />
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium shadow-sm">
            <Zap className="h-3.5 w-3.5 text-primary" /> Powered by Advanced AI
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display leading-tight">
            Improve Your Resume{" "}
            <span className="gradient-text">with AI</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Upload your resume and get instant ATS score analysis, missing skills detection, and actionable improvement suggestions powered by AI.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={scrollToAnalyzer} className="gradient-primary text-primary-foreground font-semibold px-8 h-12 text-base w-full sm:w-auto">
              Analyze My Resume <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="h-12 text-base w-full sm:w-auto">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-12 sm:mb-16">
            <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Features</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold font-display">Everything You Need</motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-muted-foreground max-w-lg mx-auto">Comprehensive AI-powered tools to optimize your resume for any job role.</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Card className="h-full shadow-card hover:shadow-elevated transition-shadow duration-300 border-border/50">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold font-display mb-1.5">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-12 sm:mb-16">
            <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">How It Works</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold font-display">Four Simple Steps</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <motion.div key={s.num} variants={fadeUp} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg">
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Step {s.num}</span>
                <h3 className="mt-2 text-base font-semibold font-display">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="px-4 py-16 sm:py-24 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-12 sm:mb-16">
            <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Benefits</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold font-display">Why Choose ResumeAI</motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp}>
                <Card className="h-full shadow-card border-border/50 text-center">
                  <CardContent className="p-6 sm:p-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <b.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold font-display mb-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Analyzer Tool */}
      <section ref={analyzerRef} className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
            <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Analyzer</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold font-display">Analyze Your Resume</motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">Upload your resume and enter your target role to get started.</motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Card className="shadow-elevated border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Upload Your Resume</CardTitle>
                <CardDescription>Upload a PDF, image, or paste your resume text</CardDescription>
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
                  className="w-full gradient-primary text-primary-foreground font-semibold h-12 text-base"
                  size="lg"
                >
                  {isAnalyzing ? "Analyzing..." : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Analyze Resume</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {isAnalyzing && <div className="mt-8"><AnalyzerLoader /></div>}

          {analysis && !isAnalyzing && (
            <div className="mt-8">
              <ResultsDashboard analysis={analysis} jobRole={jobRole} />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 px-4 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
                  <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="text-base font-bold font-display">ResumeAI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered resume analysis to help you land your dream job.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors flex items-center gap-2"><Github className="h-4 w-4" /> GitHub</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors flex items-center gap-2"><Mail className="h-4 w-4" /> Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} ResumeAI. All rights reserved. Built with Lovable.
          </div>
        </div>
      </footer>
    </div>
  );
}
