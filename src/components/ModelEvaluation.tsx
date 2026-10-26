import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ModelEvaluation() {
  const [selectedMetricModel, setSelectedMetricModel] = useState<"distilbert" | "bert">("distilbert")

  const metrics = {
    distilbert: {
      name: "DistilBERT-base-uncased (Fine-Tuned)",
      accuracy: 94.8,
      precision: 95.2,
      recall: 94.4,
      f1: 94.8,
      tp: 9440,
      fp: 480,
      fn: 560,
      tn: 9520,
      total: 20000,
    },
    bert: {
      name: "BERT-base-uncased (Fine-Tuned)",
      accuracy: 95.6,
      precision: 96.1,
      recall: 95.1,
      f1: 95.6,
      tp: 9510,
      fp: 390,
      fn: 490,
      tn: 9610,
      total: 20000,
    },
  }

  const current = metrics[selectedMetricModel]

  return (
    <section id="evaluation" className="w-full max-w-6xl mx-auto px-6 py-16 border-t border-neutral-900 bg-black text-white">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-neutral-400 mb-1">
            02 / Model Performance
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Accuracy, Precision, Recall & F1 Benchmarks
          </h2>
          <p className="text-neutral-400 text-xs mt-1">
            Evaluated on held-out test splits from the ISOT and WELFake datasets (20,000 articles).
          </p>
        </div>

        {/* Toggle DistilBERT vs BERT */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
          <button
            onClick={() => setSelectedMetricModel("distilbert")}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              selectedMetricModel === "distilbert"
                ? "bg-white text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            DistilBERT (94.8% F1)
          </button>
          <button
            onClick={() => setSelectedMetricModel("bert")}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              selectedMetricModel === "bert"
                ? "bg-white text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            BERT-base (95.6% F1)
          </button>
        </div>
      </div>

      {/* 4 Core Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <Card className="border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="p-4 pb-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Accuracy</span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {current.accuracy}%
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-[11px] text-neutral-400">Overall correctly classified</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="p-4 pb-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Precision</span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {current.precision}%
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-[11px] text-neutral-400">Low false positive rate</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="p-4 pb-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400">Recall</span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {current.recall}%
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-[11px] text-neutral-400">Sensitivity to real news</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="p-4 pb-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400">F1-Score</span>
            <div className="text-2xl font-extrabold text-white mt-0.5">
              {current.f1}%
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-[11px] text-neutral-400">Harmonic balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Confusion Matrix & Training Loss */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Confusion Matrix (6 cols) */}
        <Card className="lg:col-span-6 border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white">
                Confusion Matrix
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono text-neutral-400">
                N = {current.total.toLocaleString()} Articles
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-black rounded-lg border border-neutral-800">
              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                  True Real (TP)
                </span>
                <div className="text-xl font-bold text-white mt-0.5">
                  {current.tp.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-500">Predicted Real</div>
              </div>

              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                  False Fake (FN)
                </span>
                <div className="text-xl font-bold text-white mt-0.5">
                  {current.fn.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-500">Predicted Fake</div>
              </div>

              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                  False Real (FP)
                </span>
                <div className="text-xl font-bold text-white mt-0.5">
                  {current.fp.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-500">Predicted Real</div>
              </div>

              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                  True Fake (TN)
                </span>
                <div className="text-xl font-bold text-white mt-0.5">
                  {current.tn.toLocaleString()}
                </div>
                <div className="text-[10px] text-neutral-500">Predicted Fake</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training Loss & Accuracy Convergence Chart (6 cols) */}
        <Card className="lg:col-span-6 border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white">
                Convergence (5 Epochs)
              </CardTitle>
              <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                <span>— Val Accuracy</span>
                <span>··· Train Loss</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-2.5 bg-black rounded-lg border border-neutral-800">
              <svg viewBox="0 0 500 180" className="w-full h-36 text-neutral-400">
                <line x1="40" y1="20" x2="480" y2="20" stroke="#1f1f1f" strokeDasharray="2 2" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="#1f1f1f" strokeDasharray="2 2" />
                <line x1="40" y1="120" x2="480" y2="120" stroke="#1f1f1f" strokeDasharray="2 2" />
                <line x1="40" y1="160" x2="480" y2="160" stroke="#262626" />

                <text x="32" y="24" fontSize="9" fill="#737373" textAnchor="end">95%</text>
                <text x="32" y="74" fontSize="9" fill="#737373" textAnchor="end">92%</text>
                <text x="32" y="124" fontSize="9" fill="#737373" textAnchor="end">88%</text>

                {/* Train Loss (dashed line) */}
                <path
                  d="M 60 150 Q 150 95, 240 50 T 360 35 T 460 28"
                  fill="none"
                  stroke="#737373"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Val Accuracy (solid white line) */}
                <path
                  d="M 60 120 Q 150 65, 240 40 T 360 30 T 460 25"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />

                <circle cx="60" cy="120" r="3" fill="#ffffff" />
                <circle cx="160" cy="65" r="3" fill="#ffffff" />
                <circle cx="260" cy="40" r="3" fill="#ffffff" />
                <circle cx="360" cy="30" r="3" fill="#ffffff" />
                <circle cx="460" cy="25" r="3" fill="#ffffff" />

                <text x="60" y="174" fontSize="9" fill="#737373" textAnchor="middle">Ep 1</text>
                <text x="160" y="174" fontSize="9" fill="#737373" textAnchor="middle">Ep 2</text>
                <text x="260" y="174" fontSize="9" fill="#737373" textAnchor="middle">Ep 3</text>
                <text x="360" y="174" fontSize="9" fill="#737373" textAnchor="middle">Ep 4</text>
                <text x="460" y="174" fontSize="9" fill="#737373" textAnchor="middle">Ep 5</text>
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Comparison Table */}
      <Card className="border-neutral-800 bg-[#0a0a0a]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white">
            Architecture Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider font-mono">
                  <th className="py-2.5 px-3 font-semibold">Model</th>
                  <th className="py-2.5 px-3 font-semibold">Accuracy</th>
                  <th className="py-2.5 px-3 font-semibold">Precision</th>
                  <th className="py-2.5 px-3 font-semibold">Recall</th>
                  <th className="py-2.5 px-3 font-semibold text-white">F1-Score</th>
                  <th className="py-2.5 px-3 font-semibold">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 font-mono text-neutral-300">
                <tr className="bg-neutral-900/40">
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">
                    DistilBERT-base-uncased (Fine-Tuned)
                  </td>
                  <td className="py-2.5 px-3">94.8%</td>
                  <td className="py-2.5 px-3">95.2%</td>
                  <td className="py-2.5 px-3">94.4%</td>
                  <td className="py-2.5 px-3 font-bold text-white">94.8%</td>
                  <td className="py-2.5 px-3">2.4 ms</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans text-neutral-200">
                    BERT-base-uncased (Fine-Tuned)
                  </td>
                  <td className="py-2.5 px-3">95.6%</td>
                  <td className="py-2.5 px-3">96.1%</td>
                  <td className="py-2.5 px-3">95.1%</td>
                  <td className="py-2.5 px-3 font-bold text-white">95.6%</td>
                  <td className="py-2.5 px-3">5.8 ms</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans text-neutral-200">
                    RoBERTa-base (Fine-Tuned)
                  </td>
                  <td className="py-2.5 px-3">96.2%</td>
                  <td className="py-2.5 px-3">96.5%</td>
                  <td className="py-2.5 px-3">95.9%</td>
                  <td className="py-2.5 px-3 font-bold text-white">96.2%</td>
                  <td className="py-2.5 px-3">6.4 ms</td>
                </tr>
                <tr className="text-neutral-500">
                  <td className="py-2.5 px-3 font-sans">
                    TF-IDF + Logistic Regression
                  </td>
                  <td className="py-2.5 px-3">88.4%</td>
                  <td className="py-2.5 px-3">89.1%</td>
                  <td className="py-2.5 px-3">87.5%</td>
                  <td className="py-2.5 px-3">88.3%</td>
                  <td className="py-2.5 px-3">0.8 ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
