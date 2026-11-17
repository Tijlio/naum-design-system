import { expect, it } from "vitest"
import { formatMoney, formatMoneyParts } from "@/lib/money-format"

it("separates the currency and grouped digits without slicing the formatted symbol", () => {
  expect(formatMoneyParts(64600)).toEqual({
    currency: "€",
    major: "64",
    minor: ",600",
  })
  expect(formatMoneyParts(8)).toEqual({ currency: "€", major: "8", minor: "" })
  expect(formatMoneyParts(1234567)).toEqual({
    currency: "€",
    major: "1",
    minor: ",234,567",
  })
  expect(formatMoney(64600)).toBe("€64,600")
})
