export const BentoMetricValue = ({
  value,
  currency,
}: {
  value: string
  currency?: string
}) => {
  const separator = currency ? value.indexOf(",") : -1
  return (
    <span className="text-3xl font-normal tracking-tight tabular-nums">
      {currency && (
        <span className="mr-1 text-lg text-muted-foreground">{currency}</span>
      )}
      {separator < 0 ? (
        value
      ) : (
        <>
          {value.slice(0, separator)}
          <span className="text-muted-foreground">
            {value.slice(separator)}
          </span>
        </>
      )}
    </span>
  )
}
