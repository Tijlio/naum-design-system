export const AmbientBackdrop = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Lichtbol linksboven */}
      <div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-indigo-500/25 blur-[120px] dark:bg-indigo-600/20" />
      {/* Lichtbol rechtsonder */}
      <div className="absolute top-1/2 -right-40 h-100 w-100 rounded-full bg-cyan-500/20 blur-[120px] dark:bg-cyan-500/15" />
    </div>
  )
}
