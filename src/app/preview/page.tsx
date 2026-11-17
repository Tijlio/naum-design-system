"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Bell,
  Calendar as CalendarIcon,
  Check,
  ChevronRight,
  Info,
  Mail,
  Moon,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sun,
  Trash2,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AmbientBackdrop } from "@/components/ui/ambient-backdrop"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const CHART_DATA = [
  { month: "Mei", uren: 142, doel: 130 },
  { month: "Jun", uren: 158, doel: 140 },
  { month: "Jul", uren: 136, doel: 145 },
  { month: "Aug", uren: 171, doel: 150 },
  { month: "Sep", uren: 164, doel: 155 },
  { month: "Okt", uren: 189, doel: 165 },
]

const CHART_CONFIG = {
  uren: {
    label: "Prestaties",
    color: "var(--chart-1)",
  },
  doel: {
    label: "Norm",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function UiPreviewPage() {
  const [dark, setDark] = React.useState(false)
  const [sliderValue, setSliderValue] = React.useState<number[]>([64])
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 10, 17))
  const [notifications, setNotifications] = React.useState(true)
  const [otp, setOtp] = React.useState("20101")
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function toggleTheme() {
    setDark((prev) => !prev)
  }

  return (
    <div className="relative isolate min-h-screen bg-background text-foreground">
      <AmbientBackdrop />

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 p-6 md:p-10">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/" />}>
                    UI
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Component Preview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="font-heading text-3xl font-normal tracking-tight">
              Design System Preview
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="size-3.5" />
              Zoeken
              <Kbd>⌘K</Kbd>
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={toggleTheme}
              aria-label="Wissel licht of donker thema"
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              {dark ? "Light mode" : "Dark mode"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/" />}
            >
              Bento voorbeeld
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </header>

        {/* Kitchen-sink grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* 1. Buttons, Badges & Toggles */}
          <Card>
            <CardHeader>
              <CardTitle>Knoppen &amp; Badges</CardTitle>
              <CardDescription>
                Alle varianten inclusief glass &amp; glow
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="glass">Glass</Button>
                <Button variant="glow">Glow</Button>
              </div>

              <Separator />

              <div className="flex flex-wrap items-center gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Fout</Badge>
                <Kbd>⌘K</Kbd>
                <Spinner />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <ButtonGroup>
                  <Button variant="outline" size="sm">
                    Dag
                  </Button>
                  <Button variant="outline" size="sm">
                    Week
                  </Button>
                  <Button variant="outline" size="sm">
                    Maand
                  </Button>
                </ButtonGroup>

                <ToggleGroup defaultValue={["bold"]} size="sm">
                  <ToggleGroupItem value="bold">A</ToggleGroupItem>
                  <ToggleGroupItem value="italic">B</ToggleGroupItem>
                  <ToggleGroupItem value="underline">C</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>

          {/* 2. Form Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Formuliervelden</CardTitle>
              <CardDescription>
                Subtiele `--input`-randen en focusringen
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5">
              <div className="grid gap-1.5">
                <Label htmlFor="preview-search">Zoeken</Label>
                <InputGroup>
                  <InputGroupAddon>
                    <Search className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="preview-search"
                    placeholder="Zoek chauffeur of dossier..."
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="preview-name">Naam</Label>
                  <Input id="preview-name" defaultValue="Jan Peeters" />
                </div>
                <div className="grid gap-1.5">
                  <Label>Depot</Label>
                  <Select defaultValue="sint-niklaas">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Kies depot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sint-niklaas">Sint-Niklaas</SelectItem>
                      <SelectItem value="lokeren">Lokeren</SelectItem>
                      <SelectItem value="temse">Temse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="preview-notes">Opmerking</Label>
                <Textarea
                  id="preview-notes"
                  placeholder="Optionele toelichting..."
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox id="preview-check" defaultChecked />
                  <Label htmlFor="preview-check">Bevestigd</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="preview-switch"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                  <Label htmlFor="preview-switch">Meldingen</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Selection, Slider & OTP */}
          <Card>
            <CardHeader>
              <CardTitle>Keuzes &amp; Controls</CardTitle>
              <CardDescription>
                RadioGroup, Slider, Progress en InputOTP
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <RadioGroup defaultValue="loskidip" className="grid gap-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="loskidip" id="src-loskidip" />
                  <Label htmlFor="src-loskidip">LOSKIDIP als hoofdbron</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="prestatieblad" id="src-sheet" />
                  <Label htmlFor="src-sheet">Prestatieblad (exacte min.)</Label>
                </div>
              </RadioGroup>

              <div className="grid gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Drempelwaarde</span>
                  <span className="tabular-nums">{sliderValue[0]}%</span>
                </div>
                <Slider
                  value={sliderValue}
                  onValueChange={(val) =>
                    setSliderValue(Array.isArray(val) ? [...val] : [val])
                  }
                  max={100}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Volledigheid</span>
                  <span className="tabular-nums">78%</span>
                </div>
                <Progress value={78} />
              </div>

              <div className="grid gap-1.5">
                <Label>Partena-code (5 cijfers)</Label>
                <InputOTP maxLength={5} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </CardContent>
          </Card>

          {/* 4. Chart (spanning 2 cols) */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Grafiek (shadcn Chart + Recharts)</CardTitle>
              <CardDescription>
                Gebruikt `--chart-1` en `--chart-2` oklch-tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={CHART_CONFIG} className="h-56 w-full">
                <AreaChart data={CHART_DATA} margin={{ left: 12, right: 12 }}>
                  <defs>
                    <linearGradient id="fillUren" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-uren)"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-uren)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="doel"
                    type="monotone"
                    stroke="var(--color-doel)"
                    fill="transparent"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  <Area
                    dataKey="uren"
                    type="monotone"
                    stroke="var(--color-uren)"
                    fill="url(#fillUren)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* 5. Calendar */}
          <Card className="items-center">
            <CardHeader className="w-full">
              <CardTitle>Kalender</CardTitle>
              <CardDescription>Datumselectie binnen het thema</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-2xl border border-border/60 bg-background/40"
              />
            </CardContent>
          </Card>

          {/* 6. Overlays, Dialogs & Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Overlays &amp; Feedback</CardTitle>
              <CardDescription>
                Dialog, AlertDialog, Sheet, Popover, Menu &amp; Alert
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" size="sm" />}>
                    Dialog
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dossier bevestigen</DialogTitle>
                      <DialogDescription>
                        Voorbeeld van een modale dialoog met de nieuwe
                        thema-tokens.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button size="sm">
                        <Check className="size-3.5" />
                        Bevestigen
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger
                    render={<Button variant="destructive" size="sm" />}
                  >
                    <Trash2 className="size-3.5" />
                    AlertDialog
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Werkversie wissen?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Deze actie kan niet ongedaan worden gemaakt.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuleren</AlertDialogCancel>
                      <AlertDialogAction>Doorgaan</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Sheet>
                  <SheetTrigger render={<Button variant="outline" size="sm" />}>
                    <SlidersHorizontal className="size-3.5" />
                    Sheet
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Instellingen</SheetTitle>
                      <SheetDescription>
                        Zijpaneel voor extra dossieropties.
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>

                <Popover>
                  <PopoverTrigger
                    render={<Button variant="outline" size="sm" />}
                  >
                    <CalendarIcon className="size-3.5" />
                    Popover
                  </PopoverTrigger>
                  <PopoverContent className="w-64 text-xs">
                    Korte contextuele informatie in een zwevende popover.
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="outline" size="sm" />}
                  >
                    <Settings className="size-3.5" />
                    Menu
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Acties</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Mail className="size-3.5" />
                        Exporteer CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell className="size-3.5" />
                        Auditlog bekijken
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                  <TooltipTrigger
                    render={<Button variant="glass" size="icon-sm" />}
                  >
                    <Info className="size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>Tooltip voorbeeld</TooltipContent>
                </Tooltip>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.success("Dossier opgeslagen", {
                      description: "De wijzigingen zijn lokaal bewaard.",
                    })
                  }
                >
                  <Bell className="size-3.5" />
                  Toast (Sonner)
                </Button>
              </div>

              <Alert>
                <Info className="size-4" />
                <AlertTitle>Controle geslaagd</AlertTitle>
                <AlertDescription>
                  Alle componenten gebruiken dezelfde semantische CSS-tokens.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 7. Tabs, Accordion & Table */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Tabs, Accordion &amp; Tabel</CardTitle>
              <CardDescription>
                Navigatie en datatabellen in één overzicht
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Tabs defaultValue="table">
                <TabsList>
                  <TabsTrigger value="table">Tabel</TabsTrigger>
                  <TabsTrigger value="accordion">Accordion</TabsTrigger>
                  <TabsTrigger value="loading">Skeleton</TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="pt-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medewerker</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Minuten</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="flex items-center gap-2 font-medium">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-[10px]">
                              JP
                            </AvatarFallback>
                          </Avatar>
                          Jan Peeters
                        </TableCell>
                        <TableCell className="tabular-nums">20101</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Goedgekeurd</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          473
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="flex items-center gap-2 font-medium">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-[10px]">
                              MV
                            </AvatarFallback>
                          </Avatar>
                          Marie Vermeulen
                        </TableCell>
                        <TableCell className="tabular-nums">30300</TableCell>
                        <TableCell>
                          <Badge variant="outline">Controle</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          325
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="accordion" className="pt-3">
                  <Accordion>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Hoe werken de glass- en mesh-varianten?
                      </AccordionTrigger>
                      <AccordionContent>
                        Ze gebruiken `oklch`-CSS-variabelen in `globals.css` en
                        `cva`-varianten in `card.tsx` en `button.tsx`.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        Werkt alles in light én dark mode?
                      </AccordionTrigger>
                      <AccordionContent>
                        Ja, gebruik de knop rechtsboven om meteen tussen light en
                        dark mode te schakelen.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                <TabsContent value="loading" className="flex flex-col gap-3 pt-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="justify-between border-t border-border/60 pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#prev" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#1" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#2">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#next" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <Button size="sm" variant="glass">
                <Plus className="size-3.5" />
                Nieuw item
              </Button>
            </CardFooter>
          </Card>

          {/* 8. Card Surfaces Showcase */}
          <Card variant="frosted" className="md:col-span-2 xl:col-span-3">
            <CardHeader>
              <CardTitle>Kaart-surfaces naast elkaar</CardTitle>
              <CardDescription>
                `default`, `glass`, `frosted` en `mesh` op dezelfde achtergrond
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card variant="default" size="sm">
                <CardHeader>
                  <CardTitle className="text-sm">Default</CardTitle>
                  <CardDescription>Crisp wit datapaneel</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="glass" size="sm">
                <CardHeader>
                  <CardTitle className="text-sm">Glass</CardTitle>
                  <CardDescription>1px lichtval &amp; blur</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="mesh" size="sm" className="naum-mesh-indigo">
                <CardHeader>
                  <CardTitle className="text-sm">Mesh Indigo</CardTitle>
                  <CardDescription>Feature / KPI-highlight</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="mesh" size="sm" className="naum-mesh-coral">
                <CardHeader>
                  <CardTitle className="text-sm">Mesh Coral</CardTitle>
                  <CardDescription>Actie / aandachtskaart</CardDescription>
                </CardHeader>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <Command>
          <CommandInput placeholder="Typ een commando of zoek..." />
          <CommandList>
            <CommandEmpty>Geen resultaten gevonden.</CommandEmpty>
            <CommandGroup heading="Snelle acties">
              <CommandItem
                onSelect={() => {
                  toggleTheme()
                  setCommandOpen(false)
                }}
              >
                {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                Wissel naar {dark ? "Light" : "Dark"} mode
                <CommandShortcut>⌘T</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  toast.success("Actie uitgevoerd vanuit Command Palette")
                  setCommandOpen(false)
                }}
              >
                <Bell className="size-4" />
                Toon Sonner-toast
                <CommandShortcut>⌘M</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
