import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DatasetExplorer() {
  return (
    <section id="dataset" className="w-full max-w-6xl mx-auto px-6 py-16 border-t border-neutral-900 bg-black text-white">
      <div className="mb-8">
        <div className="text-xs font-mono uppercase text-neutral-400 mb-1">
          03 / Dataset & Fine-Tuning
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Corpus & Training Pipeline
        </h2>
        <p className="text-neutral-400 text-xs mt-1">
          Trained on the ISOT Fake News Dataset and the WELFake corpus (44,898 articles).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="p-4 pb-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Total Corpus</span>
            <div className="text-2xl font-bold text-white mt-0.5">44,898</div>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-xs text-neutral-400">
            <span>21,417 Real (47.7%) • 23,481 Fake (52.3%)</span>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="p-4 pb-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Train / Val / Test</span>
            <div className="text-2xl font-bold text-white mt-0.5">80 / 10 / 10</div>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-xs text-neutral-400">
            <span>35,918 Train • 4,490 Val • 4,490 Test</span>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="p-4 pb-1">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Sequence Window</span>
            <div className="text-2xl font-bold text-white mt-0.5">256 Tokens</div>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-xs text-neutral-400">
            <span>DistilBertTokenizerFast (WordPiece)</span>
          </CardContent>
        </Card>
      </div>

      {/* Hyperparameters Grid */}
      <Card className="border-neutral-800 bg-[#0a0a0a]">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-semibold text-white">
            Fine-Tuning Hyperparameters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-black border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">OPTIMIZER</span>
              <span className="text-white font-semibold">AdamW</span>
            </div>
            <div className="p-2.5 rounded bg-black border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">LEARNING RATE</span>
              <span className="text-white font-semibold">2e-5</span>
            </div>
            <div className="p-2.5 rounded bg-black border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">BATCH SIZE</span>
              <span className="text-white font-semibold">32</span>
            </div>
            <div className="p-2.5 rounded bg-black border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">EPOCHS</span>
              <span className="text-white font-semibold">5</span>
            </div>
            <div className="p-2.5 rounded bg-black border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">PRECISION</span>
              <span className="text-white font-semibold">FP16 Mixed</span>
            </div>
            <div className="p-2.5 rounded bg-black border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">LOSS</span>
              <span className="text-white font-semibold">CrossEntropy</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
