"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SurfacesCard() {
  return (
    <Card variant="frosted" className="md:col-span-2 xl:col-span-3">
      <CardHeader>
        <CardTitle>Card Surfaces Side by Side</CardTitle>
        <CardDescription>
          `default`, `glass`, `frosted` and `mesh` on the same canvas
        </CardDescription>
      </CardHeader>
      <div className="grid grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="default" size="sm">
          <CardHeader>
            <CardTitle className="text-sm">Default</CardTitle>
            <CardDescription>Crisp white data panel</CardDescription>
          </CardHeader>
        </Card>
        <Card variant="glass" size="sm">
          <CardHeader>
            <CardTitle className="text-sm">Glass</CardTitle>
            <CardDescription>1px highlight &amp; blur</CardDescription>
          </CardHeader>
        </Card>
        <Card variant="mesh" size="sm" className="naum-mesh-indigo">
          <CardHeader>
            <CardTitle className="text-sm">Mesh Indigo</CardTitle>
            <CardDescription>Feature / KPI highlight</CardDescription>
          </CardHeader>
        </Card>
        <Card variant="mesh" size="sm" className="naum-mesh-coral">
          <CardHeader>
            <CardTitle className="text-sm">Mesh Coral</CardTitle>
            <CardDescription>Action / attention card</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </Card>
  )
}
