import { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { extractTextFromPdf } from "@/lib/pdfParser";

interface ResumeUploadProps {
  onTextExtracted: (text: string) => void;
  resumeText: string;
}

export function ResumeUpload({ onTextExtracted, resumeText }: ResumeUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"upload" | "paste">("upload");

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20MB");
      return;
    }
    try {
      const text = await extractTextFromPdf(file);
      if (!text.trim()) {
        toast.error("Could not extract text from this PDF. Try pasting your resume instead.");
        return;
      }
      setFileName(file.name);
      onTextExtracted(text);
      toast.success("Resume uploaded successfully!");
    } catch {
      toast.error("Failed to parse PDF. Try pasting your resume text instead.");
    }
  }, [onTextExtracted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClear = () => {
    setFileName(null);
    onTextExtracted("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={mode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("upload")}
        >
          <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload PDF
        </Button>
        <Button
          variant={mode === "paste" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("paste")}
        >
          <FileText className="mr-1.5 h-3.5 w-3.5" /> Paste Text
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "upload" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {fileName ? (
              <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-accent p-4">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {resumeText.length.toLocaleString()} characters extracted
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClear}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer ${
                  isDragging
                    ? "border-primary bg-accent"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("resume-file-input")?.click()}
              >
                <div className="rounded-full bg-accent p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drop your resume here or <span className="text-primary">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PDF files up to 20MB</p>
                </div>
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="paste"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Textarea
              placeholder="Paste your resume text here..."
              className="min-h-[200px] resize-none text-sm"
              value={resumeText}
              onChange={(e) => onTextExtracted(e.target.value)}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {resumeText.length.toLocaleString()} characters
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
