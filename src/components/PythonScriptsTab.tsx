import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Terminal } from "lucide-react"

export function PythonScriptsTab() {
  const [activeScript, setActiveScript] = useState<"train" | "streamlit" | "gradio">("train")
  const [copied, setCopied] = useState(false)

  const scripts = {
    train: {
      filename: "train_distilbert.py",
      title: "PyTorch Fine-Tuning Script",
      runCmd: "python train_distilbert.py",
      code: `# Run fine-tuning pipeline:
python train_distilbert.py

# Expected Output:
# ============================================================
# VeritasLens AI: Fine-Tuning DistilBERT on Fake News Dataset
# ============================================================
# Using compute device: cuda:0
# Train size: 35918, Val size: 4490, Test size: 4490
# Final Test Metrics:
# Accuracy  : 94.80%
# Precision : 95.20%
# Recall    : 94.40%
# F1-Score  : 94.80%`,
    },
    streamlit: {
      filename: "app_streamlit.py",
      title: "Streamlit App",
      runCmd: "streamlit run app_streamlit.py",
      code: `# Run the Streamlit web application:
streamlit run app_streamlit.py

# Accessible locally at: http://localhost:8501
# Features:
# - Live news classification with DistilBERT
# - Accuracy, Precision, Recall, F1 metrics
# - Confusion matrix breakdown`,
    },
    gradio: {
      filename: "app_gradio.py",
      title: "Gradio Interface",
      runCmd: "python app_gradio.py",
      code: `# Run the Gradio interface:
python app_gradio.py

# Accessible locally at: http://127.0.0.1:7860
# Suitable for Hugging Face Spaces deployment`,
    },
  }

  const current = scripts[activeScript]

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="python-scripts" className="w-full max-w-6xl mx-auto px-6 py-16 border-t border-neutral-900 bg-black text-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-neutral-400 mb-1">
            04 / Python Scripts
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Streamlit, Gradio & Fine-Tuning Scripts
          </h2>
        </div>

        {/* Script Selector */}
        <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveScript("train")}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              activeScript === "train"
                ? "bg-white text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            train_distilbert.py
          </button>
          <button
            onClick={() => setActiveScript("streamlit")}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              activeScript === "streamlit"
                ? "bg-white text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            app_streamlit.py
          </button>
          <button
            onClick={() => setActiveScript("gradio")}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              activeScript === "gradio"
                ? "bg-white text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            app_gradio.py
          </button>
        </div>
      </div>

      <Card className="border-neutral-800 bg-[#0a0a0a]">
        <CardHeader className="p-4 pb-3 border-b border-neutral-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-neutral-400" />
              <CardTitle className="text-sm font-semibold text-white">
                {current.filename}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono text-neutral-400">
                {current.runCmd}
              </Badge>
            </div>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-3">
          <pre className="p-3.5 rounded bg-black border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed">
            <code>{current.code}</code>
          </pre>
        </CardContent>
      </Card>
    </section>
  )
}
