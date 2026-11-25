import { test, type Page } from "@playwright/test";

const state = { state: { onboarded: true, tapHintSeen: true, settings: { sound: false, haptics: false, theme: "system", goal: 10, favorites: ["sport"] } }, version: 1 };
const shot = (page: Page, name: string) => page.screenshot({ path: `screenshots/${test.info().project.name}/${name}.png` });

test("feed", async ({ page }) => {
  await page.addInitScript((s) => localStorage.setItem("ympuls", JSON.stringify(s)), state);
  await page.goto("/#/feed");
  await page.waitForTimeout(1200);
  const scroller = page.locator(".snap-y");
  for (let i = 0; i < 6; i++) {
    await shot(page, `feed-${i}`);
    if (i === 0) { await page.mouse.dblclick(200, 300); await page.waitForTimeout(300); await shot(page, "feed-save"); }
    await scroller.evaluate((el) => el.scrollBy(0, el.clientHeight));
    await page.waitForTimeout(1300);
  }
  await scroller.evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await page.waitForTimeout(900);
  await shot(page, "feed-end");
});
