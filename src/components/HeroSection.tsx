import { CrowdCanvas } from "@/components/ui/skiper39"
import { ShieldCheck, ArrowRight, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onAnalyzeClick: () => void
  onBenchmarksClick: () => void
}

export function HeroSection({ onAnalyzeClick, onBenchmarksClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[82vh] w-full flex flex-col justify-between overflow-hidden bg-black text-white border-b border-neutral-900">
      {/* Top Navbar */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Veritas AI <span className="text-[11px] px-1.5 py-0.2 rounded border border-neutral-800 text-neutral-400 font-mono">v2.4</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            DistilBERT • F1: 94.8%
          </div>
          <Button variant="outline" size="sm" onClick={onAnalyzeClick} className="text-xs">
            Start Analysis
          </Button>
        </div>
      </header>

      {/* Hero Content - Simplified, Minimal & Professional */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 text-center pt-8 pb-12 flex flex-col items-center">
        {/* Minimal Monochrome Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-300 text-xs font-mono mb-6">
          <span>NLP Transformers • DistilBERT & BERT</span>
        </div>

        {/* Crisp Bold Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
          Truth in the Crowd.
        </h1>

        {/* Clean Subtitle */}
        <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed mb-8">
          A high-precision Fake News & Misinformation Detection platform fine-tuned on 44,000+ benchmark articles.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Button variant="default" size="lg" onClick={onAnalyzeClick} className="gap-2">
            Classify News
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" onClick={onBenchmarksClick} className="gap-2">
            <BarChart2 className="h-4 w-4 text-neutral-400" />
            Evaluation Metrics
          </Button>
        </div>

        {/* Minimal Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl border-t border-neutral-900 pt-6">
          <div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">Accuracy</div>
            <div className="text-xl font-bold text-white mt-0.5">94.8%</div>
          </div>
          <div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">Precision</div>
            <div className="text-xl font-bold text-white mt-0.5">95.2%</div>
          </div>
          <div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">Recall</div>
            <div className="text-xl font-bold text-white mt-0.5">94.4%</div>
          </div>
          <div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">F1-Score</div>
            <div className="text-xl font-bold text-white mt-0.5">94.8%</div>
          </div>
        </div>
      </div>

      {/* GSAP OpenPeeps Crowd Canvas (Unchanged Animation, rendered cleanly) */}
      <div className="absolute inset-0 pointer-events-none opacity-45 z-0">
        <CrowdCanvas
          src="/peeps-sprite.png"
          rows={15}
          cols={7}
          className="absolute bottom-0 h-[65vh] w-full"
        />
      </div>

      {/* Gradient ground fade into pure black */}
      <div className="relative z-10 w-full h-16 bg-gradient-to-t from-black via-black/80 to-transparent" />
    </section>
  )
}
