import { test, expect, type Page } from "@playwright/test";

const state = { state: { onboarded: true, tapHintSeen: true, settings: { sound: false, haptics: false, theme: "system", goal: 10, favorites: [] } }, version: 1 };
const done = (page: Page) => page.getByRole("heading", { name: /^(Lektion geschafft!|Perfekte Lektion!)$/ });
const shot = (page: Page, name: string) => page.screenshot({ path: `screenshots/${test.info().project.name}/player-${name}.png` });

async function answerIfInteractive(page: Page) {
  const range = page.locator('input[type="range"]');
  if (await range.count()) { await range.fill(String(await range.getAttribute("max"))); await range.dispatchEvent("input"); }
  const fakt = page.getByRole("button", { name: "Fakt →" });
  while ((await fakt.count()) && (await fakt.isEnabled())) { await fakt.click(); await page.waitForTimeout(350); }
  const kicker = (await page.locator(".kicker").count()) ? ((await page.locator(".kicker").first().textContent()) ?? "") : "";
  if (kicker.includes("Reihenfolge")) {
    for (let i = 0; i < 5; i++) { const b = page.locator("div.flex-wrap > button").first(); if (!(await b.count())) break; await b.click(); }
  }
  if (kicker.includes("Zuordnen")) {
    const lefts = page.locator(".grid-cols-2 > div:first-child > button");
    const rights = page.locator(".grid-cols-2 > div:last-child > button");
    for (let i = 0; i < (await lefts.count()); i++) {
      for (let j = 0; j < (await rights.count()); j++) {
        if (await lefts.nth(i).isDisabled()) break;
        if (await rights.nth(j).isDisabled()) continue;
        await lefts.nth(i).click();
        await rights.nth(j).click();
        await page.waitForTimeout(500);
      }
    }
  }
  if (kicker.includes("Quiz") || kicker.includes("Stimmt") || kicker.includes("Vergleich") || kicker.includes("Was würdest")) {
    await page.locator("button.w-full.min-h-\\[56px\\], .grid-cols-2 > button.min-h-\\[56px\\]").first().click();
  }
  const check = page.getByRole("button", { name: "Prüfen" });
  if ((await check.count()) && (await check.isEnabled())) await check.click();
  await page.waitForTimeout(700);
}

test("plays a full lesson", async ({ page }) => {
  await page.addInitScript((s) => localStorage.setItem("ympuls", JSON.stringify(s)), state);
  await page.goto("/#/lektion/geld-grundlagen/wohin-geht-dein-geld");
  await page.waitForTimeout(800);
  for (let i = 0; i < 40; i++) {
    await shot(page, String(i).padStart(2, "0"));
    if (await done(page).count()) break;
    await answerIfInteractive(page);
    const finish = page.getByRole("button", { name: "Lektion abschließen" });
    const next = page.getByRole("button", { name: /^(Weiter|Abschließen)$/ });
    if (await finish.count()) await finish.click();
    else if (await next.count()) { await shot(page, String(i).padStart(2, "0") + "b"); await next.click(); }
    else await page.mouse.click(330, 500);
    await page.waitForTimeout(450);
  }
  await expect(done(page)).toBeVisible();
  await page.waitForTimeout(1600);
  await shot(page, "done");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.waitForTimeout(900);
  await shot(page, "streak");
  await page.getByRole("button", { name: /Zum Kurs|Weiter/ }).first().click();
  await page.waitForTimeout(900);
  await shot(page, "after");
});
