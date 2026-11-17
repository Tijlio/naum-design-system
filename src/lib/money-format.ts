const formatter = new Intl.NumberFormat("en-BE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

export const formatMoney = (value: number) => formatter.format(value)

export const formatMoneyParts = (value: number) => {
  const parts = formatter.formatToParts(value)
  const number = parts.filter(
    (part) => part.type !== "currency" && part.type !== "literal",
  )
  const separator = number.findIndex((part) => part.type === "group")
  return {
    currency: parts.find((part) => part.type === "currency")?.value,
    major: (separator < 0 ? number : number.slice(0, separator))
      .map((part) => part.value)
      .join(""),
    minor:
      separator < 0
        ? ""
        : number
            .slice(separator)
            .map((part) => part.value)
            .join(""),
  }
}
