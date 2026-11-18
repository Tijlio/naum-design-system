"use client"

import * as React from "react"
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotionConfig,
  type HTMLMotionProps,
  type SVGMotionProps,
} from "motion/react"
import { cn } from "@/lib/utils"

import { motionTokens } from "@/lib/motion-tokens"

export const MotionPresence = AnimatePresence

export const MotionExpand = ({
  axis = "y",
  className,
  ...props
}: HTMLMotionProps<"div"> & { axis?: "x" | "y" }) => {
  const reducedMotion = useReducedMotionConfig()
  const dimension = axis === "x" ? "width" : "height"
  return (
    <motion.div
      initial={reducedMotion ? false : { [dimension]: 0, opacity: 0 }}
      animate={{ [dimension]: "auto", opacity: 1 }}
      exit={{ [dimension]: 0, opacity: 0 }}
      transition={{
        duration: reducedMotion ? 0 : motionTokens.duration.layout,
        ease: motionTokens.ease,
      }}
      className={cn("overflow-hidden", className)}
      {...props}
    />
  )
}

export const MotionLayout = ({
  layout = "position",
  layoutId,
  ...props
}: HTMLMotionProps<"div">) => {
  const reducedMotion = useReducedMotionConfig()
  return (
    <motion.div
      transition={{
        duration: reducedMotion ? 0 : motionTokens.duration.layout,
        ease: motionTokens.ease,
      }}
      {...props}
      layout={reducedMotion ? false : layout}
      layoutId={reducedMotion ? undefined : layoutId}
    />
  )
}

export const MotionProvider = (
  props: React.ComponentProps<typeof MotionConfig>,
) => {
  return <MotionConfig reducedMotion="user" {...props} />
}

export function MotionFadeUp({
  children,
  className,
  delay = 0,
  offset = motionTokens.offset,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; offset?: number }) {
  const reducedMotion = useReducedMotionConfig()
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : motionTokens.duration.enter,
        delay: reducedMotion ? 0 : delay,
        ease: motionTokens.ease,
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
            staggerChildren: reducedMotion ? 0 : motionTokens.delay.stagger,
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
        hidden: {
          opacity: reducedMotion ? 1 : 0,
          y: reducedMotion ? 0 : motionTokens.offset,
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: reducedMotion ? 0 : motionTokens.duration.enter,
            ease: motionTokens.ease,
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
  delay = motionTokens.delay.draw,
  duration = motionTokens.duration.draw,
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
        ease: motionTokens.ease,
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
      transition={reducedMotion ? { duration: 0 } : motionTokens.spring}
      className={cn("absolute inset-0 -z-10 rounded-full", className)}
      {...props}
    />
  )
}
