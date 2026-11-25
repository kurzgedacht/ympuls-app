import { test, expect, type Page } from "@playwright/test";

// Fail on any uncaught runtime error (a blank screen still screenshots fine).
let errors: string[] = [];
test.beforeEach(({ page }) => { errors = []; page.on("pageerror", (e) => errors.push(e.message)); });
test.afterEach(async ({ page }) => { expect(errors).toEqual([]); await expect(page.locator("#root")).not.toBeEmpty(); });

// iPhone screenshots of every main screen (light + dark project) into ./screenshots/<project>/.
const seed = (onboarded = true, extra: Record<string, unknown> = {}) => ({
  state: { onboarded, tapHintSeen: true, settings: { sound: false, haptics: false, theme: "system", goal: 10, favorites: ["sport", "finanzen"] }, ...extra },
  version: 1,
});
async function open(page: Page, hash: string, state = seed()) {
  await page.addInitScript((s) => localStorage.setItem("ympuls", JSON.stringify(s)), state);
  await page.goto(`/#${hash}`);
  await page.waitForTimeout(900);
}
const shot = (page: Page, name: string) => page.screenshot({ path: `screenshots/${test.info().project.name}/${name}.png` });

test("onboarding", async ({ page }) => { await open(page, "/", seed(false)); await shot(page, "00-onboarding"); });
for (const [name, hash] of [["01-heute", "/"], ["02-feed", "/feed"], ["03-entdecken", "/entdecken"], ["04-bibliothek", "/bibliothek"], ["05-profil", "/profil"]]) {
  test(name, async ({ page }) => { await open(page, hash); await shot(page, name); });
}
