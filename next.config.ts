import type { NextConfig } from "next"
const nextConfig: NextConfig = {
  distDir: process.env.NAUM_BUILD_DIR ?? ".next",
  typescript: { tsconfigPath: "tsconfig.build.json" },
}
export default nextConfig
