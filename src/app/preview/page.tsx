"use client"

import * as React from "react"
import { AdvancedFormsCard } from "@/components/preview/advanced-forms-card"
import { ButtonsCard } from "@/components/preview/buttons-card"
import { CalendarCard } from "@/components/preview/calendar-card"
import { ChartCard } from "@/components/preview/chart-card"
import { CommandMenu } from "@/components/preview/command-menu"
import { ControlsCard } from "@/components/preview/controls-card"
import { DataTabsCard } from "@/components/preview/data-tabs-card"
import { FormsCard } from "@/components/preview/forms-card"
import { LayoutListsCard } from "@/components/preview/layout-lists-card"
import { NavigationOverlaysCard } from "@/components/preview/navigation-overlays-card"
import { OverlaysCard } from "@/components/preview/overlays-card"
import { PreviewHeader } from "@/components/preview/preview-header"
import { SurfacesCard } from "@/components/preview/surfaces-card"
import { AmbientBackdrop } from "@/components/ui/ambient-backdrop"
import {
  MotionFadeUp,
  MotionProvider,
} from "@/components/ui/motion"

export default function PreviewPage() {
  const [commandOpen, setCommandOpen] = React.useState(false)

  return (
    <MotionProvider>
      <div className="relative isolate min-h-screen bg-background text-foreground">
        <AmbientBackdrop />

        <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 p-6 md:p-10">
          <MotionFadeUp>
            <PreviewHeader onOpenCommand={() => setCommandOpen(true)} />
          </MotionFadeUp>

          <MotionFadeUp delay={0.06}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ButtonsCard />
              <FormsCard />
              <ControlsCard />
              <AdvancedFormsCard />
              <NavigationOverlaysCard />
              <ChartCard />
              <CalendarCard />
              <OverlaysCard />
              <DataTabsCard />
              <LayoutListsCard />
              <SurfacesCard />
            </div>
          </MotionFadeUp>
        </main>

        <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
      </div>
    </MotionProvider>
  )
}
