import { format } from "prettier"

// CSS is the authoring source; Motion needs numeric seconds rather than CSS times.
export const createMotionTokens = async (css) => {
  const declarations = new Map()
  css.walkDecls((declaration) =>
    declarations.set(declaration.prop, declaration.value),
  )
  const number = (name, unit = "") => {
    const value = declarations.get(name)
    const match = value?.match(new RegExp(`^([\\d.]+)${unit}$`))
    if (!match || !Number.isFinite(Number(match[1])))
      throw new Error(`Invalid motion token ${name}: ${value}`)
    return Number(match[1])
  }
  const time = (name) => number(name, "ms") / 1000
  const easing = declarations
    .get("--ease-naum")
    ?.match(/^cubic-bezier\(([^)]+)\)$/)
  const ease = easing?.[1].split(",").map(Number)
  if (!ease || ease.length !== 4 || !ease.every(Number.isFinite))
    throw new Error("--ease-naum must be a cubic-bezier curve")
  const tokens = {
    duration: Object.fromEntries(
      ["fast", "hover", "layout", "normal", "enter", "draw"].map((role) => [
        role,
        time(`--naum-duration-${role}`),
      ]),
    ),
    delay: {
      stagger: time("--naum-delay-stagger"),
      draw: time("--naum-delay-draw"),
    },
    offset: number("--naum-motion-offset", "px"),
    ease,
    spring: {
      type: "spring",
      stiffness: number("--naum-spring-stiffness"),
      damping: number("--naum-spring-damping"),
    },
  }
  return format(
    `// Generated from src/styles/naum.css by pnpm registry:build. Do not edit.\nexport const motionTokens = ${JSON.stringify(tokens, null, 2)} as const\n`,
    { parser: "typescript", semi: false },
  )
}
