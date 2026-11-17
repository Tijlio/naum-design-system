"use client"

import * as React from "react"
import {
  motion,
  MotionConfig,
  useReducedMotionConfig,
  type HTMLMotionProps,
  type SVGMotionProps,
} from "motion/react"
import { cn } from "@/lib/utils"

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const

export const MotionProvider = (
  props: React.ComponentProps<typeof MotionConfig>,
) => {
  return <MotionConfig reducedMotion="user" {...props} />
}

export function MotionFadeUp({
  children,
  className,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  const reducedMotion = useReducedMotionConfig()
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.35,
        delay: reducedMotion ? 0 : delay,
        ease: EASE_OUT_EXPO,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionStagger({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  const reducedMotion = useReducedMotionConfig()
  return (
    <motion.div
      initial={reducedMotion ? false : "hidden"}
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reducedMotion ? 0 : 0.045,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function MotionStaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  const reducedMotion = useReducedMotionConfig()
  return (
    <motion.div
      variants={{
        hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reducedMotion ? 0 : 0.35,
            ease: EASE_OUT_EXPO,
          },
        },
      }}
      className={className}
      {...props}
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
  const reducedMotion = useReducedMotionConfig()
  return (
    <motion.path
      initial={reducedMotion ? false : { pathLength: 0, opacity: 0.3 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        duration: reducedMotion ? 0 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: EASE_OUT_EXPO,
      }}
      {...props}
    />
  )
}

export function MotionPill({
  layoutId,
  className,
  ...props
}: HTMLMotionProps<"span"> & { layoutId: string }) {
  const reducedMotion = useReducedMotionConfig()
  return (
    <motion.span
      layoutId={layoutId}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 420, damping: 34 }
      }
      className={cn("absolute inset-0 -z-10 rounded-full", className)}
      {...props}
    />
  )
}
