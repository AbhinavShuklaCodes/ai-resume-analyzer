import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreCircle } from "@/components/ScoreCircle";
import { ResumeAnalysis } from "@/types/analysis";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  Download,
  FileText,
} from "lucide-react";
import jsPDF from "jspdf";

interface ResultsDashboardProps {
  analysis: ResumeAnalysis;
  jobRole: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function ResultsDashboard({ analysis, jobRole }: ResultsDashboardProps) {
  const downloadPdf = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    doc.setFontSize(18);
    doc.text("AI Resume Analysis Report", margin, y);
    y += 10;
    doc.setFontSize(11);
    doc.text(`Target Role: ${jobRole}`, margin, y);
    y += 12;

    doc.setFontSize(13);
    doc.text(`ATS Score: ${analysis.atsScore}/100`, margin, y);
    y += 8;
    doc.text(`Skill Match: ${analysis.skillMatchPercentage}%`, margin, y);
    y += 12;

    doc.setFontSize(12);
    doc.text("Summary:", margin, y);
    y += 7;
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(analysis.summary, 170);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 8;

    const sections = [
      { title: "Strengths", items: analysis.strengths },
      { title: "Weaknesses", items: analysis.weaknesses },
      { title: "Missing Skills", items: analysis.missingSkills },
      { title: "Suggestions", items: analysis.suggestions },
    ];

    for (const section of sections) {
      if (y > 260) { doc.addPage(); y = margin; }
      doc.setFontSize(12);
      doc.text(`${section.title}:`, margin, y);
      y += 7;
      doc.setFontSize(10);
      for (const s of section.items) {
        if (y > 275) { doc.addPage(); y = margin; }
        const lines = doc.splitTextToSize(`• ${s}`, 170);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 2;
      }
      y += 5;
    }

    doc.save("resume-analysis.pdf");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Scores */}
      <motion.div variants={item}>
        <Card className="shadow-elevated">
          <CardContent className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 py-6 sm:py-8">
            <ScoreCircle score={analysis.atsScore} label="ATS Score" size={110} />
            <ScoreCircle score={analysis.skillMatchPercentage} label="Skill Match" size={110} />
            <div className="flex flex-col items-center gap-2">
              <Button onClick={downloadPdf} variant="outline" size="sm">
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary */}
      <motion.div variants={item}>
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" /> Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {analysis.summary}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Strengths */}
        <motion.div variants={item}>
          <Card className="shadow-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 className="h-4 w-4 text-success" /> Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-success shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weaknesses */}
        <motion.div variants={item}>
          <Card className="shadow-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-warning" /> Weaknesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Missing Skills */}
        <motion.div variants={item}>
          <Card className="shadow-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-destructive" /> Missing Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Suggestions */}
        <motion.div variants={item}>
          <Card className="shadow-card h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-primary" /> Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-primary font-medium shrink-0">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
