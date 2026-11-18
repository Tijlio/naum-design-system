import { expect, type Page } from "@playwright/test"

export const chooseOption = async (
  page: Page,
  label: string,
  option: string,
) => {
  await page.getByRole("combobox", { name: label, exact: true }).click()
  await page.getByRole("option", { name: option, exact: true }).click()
}

export const chooseTime = async (
  page: Page,
  label: string,
  hour: string,
  minute: string,
) => {
  await page.getByRole("button", { name: label, exact: true }).click()
  await chooseOption(page, `${label} hour`, hour)
  await chooseOption(page, `${label} minute`, minute)
  await page.getByRole("button", { name: "Done", exact: true }).click()
  await expect(
    page.getByRole("button", { name: label, exact: true }),
  ).toContainText(`${hour}:${minute}`)
}
