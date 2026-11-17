export const AmbientBackdrop = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Lichtbol linksboven */}
      <div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-(--naum-ambient-primary) blur-[120px]" />
      {/* Lichtbol rechtsonder */}
      <div className="absolute top-1/2 -right-40 h-100 w-100 rounded-full bg-(--naum-ambient-secondary) blur-[120px]" />
    </div>
  )
}
