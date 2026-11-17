"use client"

import {
  Bell,
  Calendar as CalendarIcon,
  Check,
  Info,
  Mail,
  Settings,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
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
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function OverlaysCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overlays &amp; Feedback</CardTitle>
        <CardDescription>
          Dialog, AlertDialog, Sheet, Popover, Menu, Sonner &amp; Alert
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
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>
                  Example modal dialog using the Naum theme tokens.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button size="sm">
                  <Check className="size-3.5" />
                  Confirm
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
                <AlertDialogTitle>Delete draft?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
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
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>
                  Slide-over panel for secondary options.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Popover>
            <PopoverTrigger render={<Button variant="outline" size="sm" />}>
              <CalendarIcon className="size-3.5" />
              Popover
            </PopoverTrigger>
            <PopoverContent className="w-64 text-xs">
              Short contextual details inside a floating popover.
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
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Mail className="size-3.5" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="size-3.5" />
                  View audit log
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger
              aria-label="More information"
              render={<Button variant="glass" size="icon-sm" />}
            >
              <Info className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>Tooltip example</TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.success("Changes saved", {
                description: "Your workspace preferences were updated.",
              })
            }
          >
            <Bell className="size-3.5" />
            Toast (Sonner)
          </Button>
        </div>

        <Alert>
          <Info className="size-4" />
          <AlertTitle>Checks passed</AlertTitle>
          <AlertDescription>
            All components share the same semantic CSS tokens.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
