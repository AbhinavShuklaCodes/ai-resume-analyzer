import { motion } from "framer-motion";

const steps = [
  "Extracting resume content...",
  "Analyzing skills & experience...",
  "Comparing with job requirements...",
  "Calculating ATS compatibility...",
  "Generating recommendations...",
];

export function AnalyzerLoader() {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <motion.div
        className="h-16 w-16 rounded-full border-4 border-muted border-t-primary"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="space-y-3 text-center">
        {steps.map((step, i) => (
          <motion.p
            key={step}
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 1.2, duration: 0.4 }}
          >
            {step}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
