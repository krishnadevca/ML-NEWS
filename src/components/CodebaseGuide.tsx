import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

export function CodebaseGuide() {
  return (
    <section id="guide" className="w-full max-w-6xl mx-auto px-6 py-16 border-t border-neutral-900 bg-black text-white">
      <div className="mb-8">
        <div className="text-xs font-mono uppercase text-neutral-400 mb-1">
          05 / Architecture & Setup
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          shadcn/ui & Component Conventions
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white">
                Why /components/ui is Mandatory
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono text-neutral-400">
                @/components/ui
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-xs text-neutral-400 space-y-2 leading-relaxed">
            <p>
              • <strong className="text-white">Separation of Concerns:</strong> Isolates low-level UI primitives (<code className="text-neutral-300">skiper39.tsx</code>, <code className="text-neutral-300">button.tsx</code>, <code className="text-neutral-300">card.tsx</code>) from application business logic.
            </p>
            <p>
              • <strong className="text-white">shadcn CLI Default:</strong> <code className="text-neutral-300">npx shadcn@latest add</code> installs primitives to <code className="text-neutral-300">components/ui/</code> as specified in <code className="text-neutral-300">components.json</code>.
            </p>
            <p>
              • <strong className="text-white">Dual-Path Support:</strong> Files are accessible via both <code className="text-neutral-300">src/components/ui/</code> and root <code className="text-neutral-300">components/ui/</code>.
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-[#0a0a0a]">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold text-white">
              Integration Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-xs text-neutral-400 space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 text-neutral-300">
              <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
              <span>OpenPeeps Crowd Canvas (<code className="text-white">skiper39.tsx</code>) powered by GSAP.</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
              <span>Offline sprite cached in <code className="text-white">public/peeps-sprite.png</code> (380 KB).</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
              <span>Tailwind CSS v4 & TypeScript configured with zero linter errors.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
