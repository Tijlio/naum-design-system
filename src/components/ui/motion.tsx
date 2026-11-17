"use client"

import * as React from "react"
import { motion, MotionConfig, type SVGMotionProps } from "motion/react"
import { cn } from "@/lib/utils"

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export function MotionFadeUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function MotionStagger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.045,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function MotionStaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: EASE_OUT_EXPO },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function MotionDrawPath({
  delay = 0.15,
  duration = 0.75,
  ...props
}: SVGMotionProps<SVGPathElement> & { delay?: number; duration?: number }) {
  return (
    <motion.path
      initial={{ pathLength: 0, opacity: 0.3 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
      {...props}
    />
  )
}

export function MotionPill({
  layoutId,
  className,
}: {
  layoutId: string
  className?: string
}) {
  return (
    <motion.span
      layoutId={layoutId}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className={cn("absolute inset-0 -z-10 rounded-full", className)}
    />
  )
}
