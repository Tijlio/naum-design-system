"use client"

import { Plus } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DataTabsCard() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Tabs, Accordion &amp; Table</CardTitle>
        <CardDescription>
          Navigation and structured data in one view
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="accordion">Accordion</TabsTrigger>
            <TabsTrigger value="loading">Skeleton</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="pt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Minutes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px]">
                        AM
                      </AvatarFallback>
                    </Avatar>
                    Alex Mercer
                  </TableCell>
                  <TableCell className="tabular-nums">20101</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Approved</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">473</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px]">
                        EV
                      </AvatarFallback>
                    </Avatar>
                    Elena Vance
                  </TableCell>
                  <TableCell className="tabular-nums">30300</TableCell>
                  <TableCell>
                    <Badge variant="outline">Review</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">325</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="accordion" className="pt-3">
            <Accordion>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How do glass and mesh variants work?
                </AccordionTrigger>
                <AccordionContent>
                  They use `oklch` CSS variables in `globals.css` combined with
                  `cva` variants in `card.tsx` and `button.tsx`.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Do both light and dark modes stay in sync?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, `ThemeProvider` (`next-themes`) persists the active mode
                  across every route and component.
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
          New item
        </Button>
      </CardFooter>
    </Card>
  )
}
