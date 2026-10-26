import { useState, useId } from "react"
import {
  AVAILABLE_MODELS,
  SAMPLE_NEWS_ARTICLES,
  analyzeNewsText,
  type PredictionResult,
} from "@/lib/nlpEngine"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  AlertCircle,
  Zap,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react"

export function FakeNewsClassifier() {
  const [inputText, setInputText] = useState(SAMPLE_NEWS_ARTICLES[0].text)
  const [selectedModel, setSelectedModel] = useState("distilbert")
  const [result, setResult] = useState<PredictionResult>(() =>
    analyzeNewsText(SAMPLE_NEWS_ARTICLES[0].text, "distilbert")
  )
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copied, setCopied] = useState(false)

  const textareaId = useId()

  const handleClassify = (textToAnalyze = inputText, modelId = selectedModel) => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const res = analyzeNewsText(textToAnalyze, modelId)
      setResult(res)
      setIsAnalyzing(false)
    }, 200)
  }

  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText)
    handleClassify(sampleText, selectedModel)
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    handleClassify(inputText, modelId)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeModelConfig = AVAILABLE_MODELS.find((m) => m.id === selectedModel)

  return (
    <section id="classifier" className="w-full max-w-6xl mx-auto px-6 py-16 bg-black text-white">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-neutral-900 pb-6">
        <div>
          <div className="text-xs font-mono uppercase text-neutral-400 mb-1">
            01 / Interactive Classifier
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Live News Analysis & Token Saliency
          </h2>
        </div>

        {/* Minimal Monochrome Model Selector */}
        <div className="flex items-center gap-1 p-1 bg-neutral-950 border border-neutral-800 rounded-lg overflow-x-auto">
          {AVAILABLE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => handleModelChange(model.id)}
              className={`px-3 py-1 rounded text-xs transition-colors whitespace-nowrap cursor-pointer ${
                selectedModel === model.id
                  ? "bg-white text-black font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {model.id === "distilbert" ? "DistilBERT" : model.id === "bert" ? "BERT" : model.id === "roberta" ? "RoBERTa" : "TF-IDF"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and Samples (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-neutral-800 bg-[#0a0a0a]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">
                  News Text or Headline
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[11px] font-mono text-neutral-400">
                    {inputText.trim().split(/\s+/).filter(Boolean).length} words
                  </Badge>
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
                    title="Copy text"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setInputText("")
                      handleClassify("")
                    }}
                    className="text-xs text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                id={textareaId}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                placeholder="Enter or paste article text to analyze..."
                className="w-full rounded-lg bg-black border border-neutral-800 p-3.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 leading-relaxed font-sans transition-colors resize-none"
              />

              {/* Sample Selector Chips */}
              <div>
                <label className="text-[11px] font-mono uppercase text-neutral-500 block mb-2">
                  Benchmark Test Cases:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_NEWS_ARTICLES.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(sample.text)}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors cursor-pointer text-left ${
                        inputText === sample.text
                          ? "bg-white text-black font-medium border-white"
                          : "bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600"
                      }`}
                    >
                      {sample.category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                variant="default"
                size="lg"
                className="w-full gap-2 text-sm font-semibold"
                disabled={isAnalyzing || !inputText.trim()}
                onClick={() => handleClassify()}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Computing Forward Pass...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Analyze with {activeModelConfig?.name.split(" ")[0]}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Token Attention Card (Simplified) */}
          <Card className="border-neutral-800 bg-[#0a0a0a]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">
                  Token Saliency & Attention Weights
                </CardTitle>
                <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
                  <span>[Underline] Credible marker</span>
                  <span>•</span>
                  <span>[Box] Sensational / Fake</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {result.tokens.length === 0 ? (
                <div className="text-xs text-neutral-500 py-3">No tokens available.</div>
              ) : (
                <div className="p-3.5 rounded-lg bg-black border border-neutral-800 leading-relaxed text-sm flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {result.tokens.map((t, idx) => {
                    const isFake = t.score < -0.3
                    const isReal = t.score > 0.3

                    let tokenStyle = "text-neutral-300"
                    if (isFake) {
                      tokenStyle = "border border-neutral-500 bg-neutral-900 text-white px-1 rounded font-medium"
                    } else if (isReal) {
                      tokenStyle = "underline decoration-neutral-400 underline-offset-4 text-white font-medium"
                    }

                    return (
                      <span key={idx} className={tokenStyle}>
                        {t.word}
                      </span>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Prediction Verdict & Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-neutral-800 bg-[#0a0a0a]">
            <CardHeader className="pb-3 border-b border-neutral-900">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-neutral-400">
                  Verification Output
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  Latency: {result.inferenceTimeMs}ms
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-5">
              {/* High Contrast Black & White Verdict */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 text-white">
                  {result.label === "REAL" ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-white" />
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {result.label === "REAL"
                      ? "AUTHENTIC NEWS"
                      : result.label === "FAKE"
                      ? "MISINFORMATION / FAKE"
                      : "UNVERIFIED"}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">
                    Confidence: <strong className="text-white">{result.confidence}%</strong>
                  </p>
                </div>
              </div>

              {/* Minimal Probability Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-neutral-400">
                  <span>Real: {result.realProbability}%</span>
                  <span>Fake: {result.fakeProbability}%</span>
                </div>
                <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden flex border border-neutral-800">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${result.realProbability}%` }}
                  />
                  <div
                    className="h-full bg-neutral-600 transition-all duration-300"
                    style={{ width: `${result.fakeProbability}%` }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-lg bg-black border border-neutral-800">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Credibility</span>
                  <div className="text-lg font-bold text-white mt-0.5">{result.credibilityScore} / 100</div>
                </div>

                <div className="p-3 rounded-lg bg-black border border-neutral-800">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Sensationalism</span>
                  <div className="text-lg font-bold text-white mt-0.5">{result.sensationalismIndex}%</div>
                </div>

                <div className="p-3 rounded-lg bg-black border border-neutral-800">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Subjectivity</span>
                  <div className="text-lg font-bold text-white mt-0.5">{result.subjectivityScore}%</div>
                </div>

                <div className="p-3 rounded-lg bg-black border border-neutral-800">
                  <span className="text-[10px] font-mono uppercase text-neutral-500">Source Rating</span>
                  <div className="text-sm font-semibold text-white mt-1">
                    {result.sourceIntegrity}
                  </div>
                </div>
              </div>

              {/* Forensic Reasons */}
              <div className="pt-2 border-t border-neutral-900 space-y-1.5 text-xs text-neutral-400">
                <span className="font-mono text-[11px] uppercase text-neutral-300 block mb-1">
                  Model Diagnostic Notes:
                </span>
                <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                  {result.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                  {result.flags.map((f, i) => (
                    <li key={`flag-${i}`} className="text-neutral-200 font-medium">{f}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
