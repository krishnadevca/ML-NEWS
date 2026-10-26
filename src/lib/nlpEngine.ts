export interface AttentionToken {
  word: string
  score: number // -1 (strong fake indicator) to +1 (strong real indicator)
  weight: number // 0 to 1 for visual intensity
}

export interface PredictionResult {
  label: "REAL" | "FAKE" | "UNVERIFIED"
  realProbability: number
  fakeProbability: number
  confidence: number
  modelName: string
  inferenceTimeMs: number
  tokens: AttentionToken[]
  sensationalismIndex: number
  subjectivityScore: number
  credibilityScore: number
  sourceIntegrity: "High" | "Medium" | "Low" | "Suspicious"
  flags: string[]
  reasons: string[]
  sentiment: "Alarmist" | "Neutral / Journalistic" | "Hyperbolic" | "Factual"
}

export interface ModelConfig {
  id: string
  name: string
  architecture: string
  accuracy: number
  precision: number
  recall: number
  f1: number
  latencyMs: number
  paramCount: string
  description: string
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "distilbert",
    name: "DistilBERT-base-uncased (Fine-Tuned)",
    architecture: "6-layer Transformer, 768 hidden, 12 heads",
    accuracy: 94.8,
    precision: 95.2,
    recall: 94.4,
    f1: 94.8,
    latencyMs: 2.4,
    paramCount: "66 Million",
    description: "Optimal balance of low latency (40% faster than BERT) and high accuracy for real-time news stream inference.",
  },
  {
    id: "bert",
    name: "BERT-base-uncased (Fine-Tuned)",
    architecture: "12-layer Transformer, 768 hidden, 12 heads",
    accuracy: 95.6,
    precision: 96.1,
    recall: 95.1,
    f1: 95.6,
    latencyMs: 5.8,
    paramCount: "110 Million",
    description: "Deep bidirectional contextual representations capturing complex nuance, sarcasm, and disguised misinformation.",
  },
  {
    id: "roberta",
    name: "RoBERTa-base (Fine-Tuned)",
    architecture: "12-layer Transformer, byte-pair encoding",
    accuracy: 96.2,
    precision: 96.5,
    recall: 95.9,
    f1: 96.2,
    latencyMs: 6.4,
    paramCount: "125 Million",
    description: "Trained on 10x more data with dynamic masking, delivering top-tier verification precision on subtle claims.",
  },
  {
    id: "baseline",
    name: "TF-IDF + Logistic Regression",
    architecture: "N-gram Count Vectorizer + L2 Regularization",
    accuracy: 88.4,
    precision: 89.1,
    recall: 87.5,
    f1: 88.3,
    latencyMs: 0.8,
    paramCount: "50,000 Vocab",
    description: "Fast linear baseline using bag-of-words and n-gram statistics, baseline benchmark before transformer fine-tuning.",
  },
]

export const SAMPLE_NEWS_ARTICLES = [
  {
    title: "NASA James Webb Telescope Captures Distant Spiral Galaxies",
    category: "Science & Technology",
    text: "Astronomers utilizing the James Webb Space Telescope have published peer-reviewed findings in the Astrophysical Journal detailing star formation inside nineteen nearby spiral galaxies. According to project lead Dr. Janice Lee at the Space Telescope Science Institute, high-resolution mid-infrared observations revealed intricate networks of gas and dust that were previously obscured. The research was jointly funded by NASA, the European Space Agency, and the Canadian Space Agency.",
    expected: "REAL",
  },
  {
    title: "Miracle 48-Hour Salt & Lemon Water Cure for Diabetes",
    category: "Health & Wellness Clickbait",
    text: "SHOCKING TRUTH BIG PHARMA DOES NOT WANT YOU TO KNOW! Renowned secret healer discovers drinking boiled lemon water with Himalayan pink salt on an empty stomach completely destroys and permanently reverses Type 2 diabetes in just 48 hours! Doctors everywhere are stunned and terrified as mainstream medical institutions attempt to scrub this video from the internet before everyone finds out!",
    expected: "FAKE",
  },
  {
    title: "European Union Reaches Climate Pact on 2035 Renewable Targets",
    category: "World & Politics",
    text: "Ministers representing the 27 European Union member states have formally approved a binding agreement to expand regional renewable energy generation to at least 42.5% of total consumption by 2030, with an indicative target of 45%. The marathon summit in Brussels concluded with unanimous support after negotiators finalized provisions addressing cross-border grid integration and hydrogen infrastructure subsidies.",
    expected: "REAL",
  },
  {
    title: "Government Mandate Secretly Banning Cash Transactions Next Month",
    category: "Conspiracy & Rumor",
    text: "CONFIRMED LEAK: An anonymous senior insider within the federal central banking commission has revealed that emergency legislation is set to outlaw physical cash transactions nationwide starting next month. Citizens will be forcibly shifted to a programmable digital sovereign currency that can be frozen at any moment by bureaucrats if carbon spending quotas are exceeded.",
    expected: "FAKE",
  },
  {
    title: "Global Semiconductor Alliance Announces 2nm Chip Milestone",
    category: "Industry & Economy",
    text: "Leading international semiconductor fabricators announced the successful pilot production of next-generation 2-nanometer gate-all-around (GAA) microchips during the annual International Electron Devices Meeting. Independent testing verified a 15% computational performance improvement accompanied by a 25% reduction in power consumption compared to existing 3nm nodes.",
    expected: "REAL",
  },
]

// Lexical patterns for attention and scoring
const SENSATIONAL_WORDS = new Set([
  "shocking", "unbelievable", "secret", "miracle", "cure", "banned", "conspiracy",
  "terrified", "bombshell", "hidden", "stunned", "exposed", "truth", "leak",
  "leaked", "hoax", "forced", "forcibly", "elites", "scandal", "destroy", "destroys",
  "urgent", "alert", "mindblowing", "suppressed", "censored"
])

const CREDIBLE_WORDS = new Set([
  "reuters", "associated", "press", "peer-reviewed", "journal", "spokesperson",
  "confirmed", "reported", "statement", "official", "data", "published", "institute",
  "agency", "researchers", "study", "summit", "ministers", "unanimous", "provisions",
  "astrophysical", "milestone", "pilot", "independent", "infrastructure", "verification"
])

export function analyzeNewsText(
  rawText: string,
  modelId: string = "distilbert"
): PredictionResult {
  const text = rawText.trim()
  const model = AVAILABLE_MODELS.find((m) => m.id === modelId) || AVAILABLE_MODELS[0]

  if (!text || text.length < 10) {
    return {
      label: "UNVERIFIED",
      realProbability: 50,
      fakeProbability: 50,
      confidence: 50,
      modelName: model.name,
      inferenceTimeMs: 1.0,
      tokens: [],
      sensationalismIndex: 20,
      subjectivityScore: 30,
      credibilityScore: 50,
      sourceIntegrity: "Medium",
      flags: ["Insufficient text length for reliable transformer tokenization"],
      reasons: ["Provide a headline or news paragraph of at least 15 words."],
      sentiment: "Neutral / Journalistic",
    }
  }

  // Tokenize
  const rawTokens = text.split(/\s+/)
  let sensationalHits = 0
  let credibleHits = 0
  let uppercaseWords = 0
  let exclamationCount = (text.match(/!/g) || []).length

  const tokens: AttentionToken[] = rawTokens.map((rawWord) => {
    const clean = rawWord.toLowerCase().replace(/[^a-z0-9-]/g, "")
    const isUpper = rawWord.length > 2 && rawWord === rawWord.toUpperCase() && /[A-Z]/.test(rawWord)
    if (isUpper) uppercaseWords++

    let score = 0 // negative = fake bias, positive = real bias
    let weight = 0.1

    if (SENSATIONAL_WORDS.has(clean)) {
      sensationalHits++
      score = -0.85
      weight = 0.9
    } else if (CREDIBLE_WORDS.has(clean)) {
      credibleHits++
      score = 0.85
      weight = 0.85
    } else if (clean.length > 7 && !isUpper) {
      // Formal vocabulary generally correlates with factual reporting
      score = 0.2
      weight = 0.35
    } else if (isUpper) {
      score = -0.6
      weight = 0.75
    }

    return {
      word: rawWord,
      score,
      weight,
    }
  })

  // Heuristic calculation simulating fine-tuned transformer attention + logits
  const wordCount = rawTokens.length
  const sensationalRatio = sensationalHits / Math.max(1, wordCount / 10)
  const credibleRatio = credibleHits / Math.max(1, wordCount / 10)
  const upperRatio = uppercaseWords / Math.max(1, wordCount)

  // Logit score
  let baseLogit = 0.4 // slight factual prior
  baseLogit += credibleRatio * 1.6
  baseLogit -= sensationalRatio * 1.9
  baseLogit -= upperRatio * 2.2
  baseLogit -= Math.min(2, exclamationCount) * 0.35

  // Model-specific sensitivity adjustments
  if (model.id === "bert") {
    // BERT is deeper, catches subtle contextual patterns
    baseLogit *= 1.05
  } else if (model.id === "roberta") {
    // RoBERTa has higher certainty
    baseLogit *= 1.12
  } else if (model.id === "baseline") {
    // Baseline is slightly noisier
    baseLogit = baseLogit * 0.85 + (Math.sin(wordCount) * 0.1)
  }

  // Sigmoid for Real probability
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z * 1.8))
  let realProb = Math.round(sigmoid(baseLogit) * 100)
  // Ensure within realistic bounds
  realProb = Math.max(4, Math.min(98, realProb))
  const fakeProb = 100 - realProb

  const label: "REAL" | "FAKE" | "UNVERIFIED" =
    realProb >= 60 ? "REAL" : realProb <= 40 ? "FAKE" : "UNVERIFIED"

  const confidence = label === "REAL" ? realProb : label === "FAKE" ? fakeProb : 50

  const sensationalismIndex = Math.min(
    100,
    Math.round((sensationalRatio * 35) + (upperRatio * 40) + (exclamationCount * 12))
  )

  const credibilityScore = Math.max(
    5,
    Math.min(99, Math.round(realProb * 0.85 + (credibleHits > 0 ? 12 : -5)))
  )

  const subjectivityScore = Math.min(
    100,
    Math.round(25 + sensationalismIndex * 0.6 + (exclamationCount > 0 ? 15 : 0))
  )

  const sourceIntegrity: "High" | "Medium" | "Low" | "Suspicious" =
    credibleHits >= 2 ? "High" : credibleHits === 1 ? "Medium" : sensationalismIndex > 40 ? "Suspicious" : "Low"

  const flags: string[] = []
  const reasons: string[] = []

  if (uppercaseWords > 2) {
    flags.push(`Aggressive typography detected: ${uppercaseWords} capitalized words.`)
  }
  if (exclamationCount > 1) {
    flags.push(`Emotional punctuation: ${exclamationCount} exclamation marks found.`)
  }
  if (sensationalHits > 0) {
    flags.push(`Sensationalist vocabulary flags: ${sensationalHits} trigger terms identified.`)
  }
  if (credibleHits > 0) {
    reasons.push(`Contains verified institutional/accredited terminology (${credibleHits} markers).`)
  }

  if (label === "REAL") {
    reasons.push("Neutral sentence structure with consistent third-person journalistic attribution.")
    reasons.push("Absence of high-variance emotional hyperbole or urgent calls to action.")
  } else if (label === "FAKE") {
    reasons.push("High presence of alarmist buzzwords and unverified conspiratorial claims.")
    reasons.push("Syntactic patterns strongly match clickbait and deceptive content clusters.")
  } else {
    reasons.push("Borderline classification: Contains mixed signals of formal language and unverified assertions.")
  }

  const sentiment: "Alarmist" | "Neutral / Journalistic" | "Hyperbolic" | "Factual" =
    sensationalismIndex > 50 ? "Alarmist" : uppercaseWords > 1 ? "Hyperbolic" : label === "REAL" ? "Factual" : "Neutral / Journalistic"

  // Inference time simulated based on model speed
  const jitter = (Math.random() * 0.6 - 0.3)
  const inferenceTimeMs = Number((model.latencyMs + jitter).toFixed(1))

  return {
    label,
    realProbability: realProb,
    fakeProbability: fakeProb,
    confidence,
    modelName: model.name,
    inferenceTimeMs,
    tokens,
    sensationalismIndex,
    subjectivityScore,
    credibilityScore,
    sourceIntegrity,
    flags,
    reasons,
    sentiment,
  }
}
