"use client"

import Link from "next/link"
import { ArrowUpRight, Bell, Mail, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const NAV_SECTIONS = [
  {
    label: "Finance",
    items: [
      {
        title: "General Ledger",
        description: "Accounts, journals & trial balance",
      },
      {
        title: "Monthly Closing",
        description: "Period checks and reconciliations",
      },
      {
        title: "Financial Reports",
        description: "P&L, balance sheet & exports",
      },
    ],
  },
  {
    label: "Cash Management",
    items: [
      { title: "Bank Accounts", description: "Live balances & feeds" },
      { title: "Payment Runs", description: "Scheduled SEPA batches" },
    ],
  },
  {
    label: "Sales",
    items: [
      { title: "Sales Quotes", description: "Open proposals & conversion" },
      { title: "Sales Orders", description: "Active fulfillment pipeline" },
      { title: "Sales Invoices", description: "Issued & overdue receivables" },
    ],
  },
  {
    label: "Purchasing",
    items: [
      { title: "Purchase Orders", description: "Supplier orders & approvals" },
      { title: "Vendor Bills", description: "Upcoming payables" },
    ],
  },
  {
    label: "Payroll",
    items: [
      {
        title: "Time & Attendance",
        description: "Daily schedules & exceptions",
      },
      { title: "Payroll Export", description: "Validated monthly batches" },
    ],
  },
] as const

export function BentoHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium tracking-tight text-foreground/85">
          Naum Inc.
        </span>

        <NavigationMenu>
          <NavigationMenuList className="flex-wrap justify-start gap-1">
            {NAV_SECTIONS.map((section) => (
              <NavigationMenuItem key={section.label}>
                <NavigationMenuTrigger className="h-8 rounded-full bg-transparent px-3 py-1 text-xs font-normal text-foreground/80 hover:bg-card/70 hover:text-foreground data-popup-open:bg-card data-popup-open:text-foreground data-popup-open:shadow-xs data-popup-open:ring-1 data-popup-open:ring-foreground/5">
                  {section.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-64 gap-1 p-1">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink
                          href="#"
                          className="block rounded-2xl px-3 py-2 transition-colors hover:bg-muted/70"
                        >
                          <div className="text-xs font-medium text-foreground">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.description}
                          </div>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="glass"
          size="icon-sm"
          className="rounded-full"
          aria-label="Messages"
        >
          <Mail className="size-3.5" />
        </Button>
        <Button
          variant="glass"
          size="icon-sm"
          className="rounded-full"
          aria-label="Notifications"
        >
          <Bell className="size-3.5" />
        </Button>
        <Button
          variant="glass"
          size="icon-sm"
          className="rounded-full"
          aria-label="Search"
        >
          <Search className="size-3.5" />
        </Button>
        <ThemeToggle className="ml-1 h-8 px-3 text-xs font-normal" />
        <Button
          variant="glass"
          size="sm"
          nativeButton={false}
          render={<Link href="/preview" />}
          className="h-8 px-3 text-xs font-normal"
        >
          Component Preview
          <ArrowUpRight className="size-3.5 opacity-70" />
        </Button>
      </div>
    </header>
  )
}
