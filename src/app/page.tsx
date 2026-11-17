import { Plus } from "lucide-react"
import { ActivitiesSection } from "@/components/bento/activities-section"
import { KPI_CARDS, QUICK_ACTIONS } from "@/components/bento/bento-data"
import { BentoHeader } from "@/components/bento/bento-header"
import { BentoSidebar } from "@/components/bento/bento-sidebar"
import { InsightCard } from "@/components/bento/insight-card"
import { KpiCard } from "@/components/bento/kpi-card"
import { AmbientBackdrop } from "@/components/ui/ambient-backdrop"
import { Button } from "@/components/ui/button"
import {
  MotionFadeUp,
  MotionProvider,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/ui/motion"

export default function HomePage() {
  return (
    <MotionProvider>
      <div className="relative isolate min-h-screen bg-background text-foreground">
        <AmbientBackdrop />

        <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 p-6 md:p-10">
          <BentoHeader />

          <div className="flex items-start gap-5">
            <BentoSidebar />

            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <MotionFadeUp>
                <section className="flex flex-col gap-4">
                  <h1 className="font-heading text-4xl font-normal tracking-tight">
                    Dashboard
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {QUICK_ACTIONS.map((action) => (
                      <Button
                        key={action}
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-full border-foreground/15 bg-transparent px-3.5 text-xs font-normal hover:bg-card"
                      >
                        <Plus className="size-3.5 opacity-70" />
                        {action}
                      </Button>
                    ))}
                    <Button
                      variant="default"
                      size="icon-sm"
                      className="rounded-full bg-card text-foreground ring-1 ring-border hover:bg-card/80"
                      aria-label="More actions"
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </section>
              </MotionFadeUp>

              <MotionStagger className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:col-span-9">
                  {KPI_CARDS.map((kpi) => (
                    <MotionStaggerItem key={kpi.title} className="flex">
                      <KpiCard kpi={kpi} />
                    </MotionStaggerItem>
                  ))}
                </div>

                <MotionStaggerItem className="flex lg:col-span-3">
                  <InsightCard />
                </MotionStaggerItem>
              </MotionStagger>

              <MotionFadeUp delay={0.18}>
                <ActivitiesSection />
              </MotionFadeUp>
            </div>
          </div>
        </main>
      </div>
    </MotionProvider>
  )
}
