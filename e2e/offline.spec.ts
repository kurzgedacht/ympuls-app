import { test, expect, webkit } from "@playwright/test";

const state = { state: { onboarded: true, tapHintSeen: true, settings: { sound: false, haptics: false, theme: "system", goal: 10, favorites: [] } }, version: 1 };

// Offline check: fresh WebKit context, service worker installed, then network off.
test("works offline after first visit", async () => {
  test.skip(test.info().project.name !== "light", "once is enough");
  const browser = await webkit.launch();
  const context = await browser.newContext({ baseURL: "http://localhost:4173", viewport: { width: 393, height: 852 } });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript((s) => localStorage.setItem("ympuls", JSON.stringify(s)), state);
  await page.goto("/");
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await page.waitForTimeout(800);
  await context.setOffline(true);
  await page.goto("/#/lektion/protein/anaboles-fenster");
  await expect(page.getByRole("heading", { name: "Das anabole Fenster" })).toBeVisible();
  await page.goto("/#/entdecken");
  await expect(page.getByText(/Alle Kurse/)).toBeVisible();
  expect(errors).toEqual([]);
  await browser.close();
});

test("manifest is installable", async ({ request }) => {
  const m = await (await request.get("/manifest.webmanifest")).json();
  expect(m.display).toBe("standalone");
  expect(m.icons.map((i: { sizes: string }) => i.sizes)).toEqual(expect.arrayContaining(["192x192", "512x512"]));
  for (const p of ["/icons/apple-touch-icon.png", "/splash/1179x2556-dark.png"]) expect((await request.get(p)).status()).toBe(200);
});
