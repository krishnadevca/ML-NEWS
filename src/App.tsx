import { useState } from "react"
import { HeroSection } from "@/components/HeroSection"
import { FakeNewsClassifier } from "@/components/FakeNewsClassifier"
import { ModelEvaluation } from "@/components/ModelEvaluation"
import { DatasetExplorer } from "@/components/DatasetExplorer"
import { PythonScriptsTab } from "@/components/PythonScriptsTab"
import { CodebaseGuide } from "@/components/CodebaseGuide"
import Skiper39Demo from "@/components/ui/demo"
import { ShieldCheck, Eye, Terminal, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function App() {
  const [viewMode, setViewMode] = useState<"full" | "demo">("full")

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (viewMode === "demo") {
    return (
      <div className="relative min-h-screen w-full bg-black text-white">
        {/* Floating Demo Control Bar */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 p-2 rounded-lg bg-neutral-950 border border-neutral-800 shadow-xl">
          <span className="text-xs text-neutral-300 font-mono pl-2">
            skiper39 Isolated View
          </span>
          <Button
            size="sm"
            variant="default"
            onClick={() => setViewMode("full")}
            className="text-xs"
          >
            Back to Veritas
          </Button>
        </div>
        <Skiper39Demo />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* Sticky Secondary Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="h-7 w-7 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="h-4 w-4 text-black" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              Veritas AI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-xs text-neutral-400">
            <button
              onClick={() => scrollToSection("classifier")}
              className="px-3 py-1.5 rounded hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              Classifier
            </button>
            <button
              onClick={() => scrollToSection("evaluation")}
              className="px-3 py-1.5 rounded hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              Metrics (F1: 94.8%)
            </button>
            <button
              onClick={() => scrollToSection("dataset")}
              className="px-3 py-1.5 rounded hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              Dataset
            </button>
            <button
              onClick={() => scrollToSection("python-scripts")}
              className="px-3 py-1.5 rounded hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Terminal className="h-3 w-3" />
              Streamlit / Gradio
            </button>
            <button
              onClick={() => scrollToSection("guide")}
              className="px-3 py-1.5 rounded hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer flex items-center gap-1"
            >
              <BookOpen className="h-3 w-3" />
              Architecture
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode("demo")}
              className="text-xs gap-1.5"
            >
              <Eye className="h-3 w-3 text-neutral-400" />
              <span>Canvas Demo</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => scrollToSection("classifier")}
              className="text-xs"
            >
              Analyze News
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with GSAP Crowd Canvas */}
        <HeroSection
          onAnalyzeClick={() => scrollToSection("classifier")}
          onBenchmarksClick={() => scrollToSection("evaluation")}
        />

        {/* 2. Interactive Fake News Classifier */}
        <FakeNewsClassifier />

        {/* 3. Model Evaluation (Accuracy, Precision, Recall, F1) */}
        <ModelEvaluation />

        {/* 4. Dataset & Fine-Tuning Pipeline */}
        <DatasetExplorer />

        {/* 5. Python Scripts: train_distilbert.py, app_streamlit.py, app_gradio.py */}
        <PythonScriptsTab />

        {/* 6. Codebase Architecture & shadcn Guide */}
        <CodebaseGuide />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-black py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-white text-black flex items-center justify-center font-bold text-[10px]">
              V
            </div>
            <span>
              <strong className="text-neutral-300">Veritas AI</strong> • Fake News Detection with DistilBERT & BERT
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-neutral-400">
            <span>Acc: 94.8%</span>
            <span>•</span>
            <span>Prec: 95.2%</span>
            <span>•</span>
            <span>Rec: 94.4%</span>
            <span>•</span>
            <span className="text-white font-semibold">F1: 94.8%</span>
          </div>

          <div className="text-neutral-500">
            Peeps illustrated by <a href="https://www.openpeeps.com" target="_blank" rel="noreferrer" className="underline hover:text-neutral-300">OpenPeeps</a> • GSAP Canvas
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
