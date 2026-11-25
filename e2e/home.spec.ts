import { test, type Page } from "@playwright/test";

// Seeded progress so Today shows the path, chest, review card and the library has saved cards.
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date());
const state = {
  state: {
    onboarded: true, tapHintSeen: true, xp: 180, lastCourse: "geld-grundlagen",
    progress: { "geld-grundlagen": ["wohin-geht-dein-geld", "erst-dich-bezahlen"] }, perfect: ["geld-grundlagen/wohin-geht-dein-geld"],
    streak: { count: 4, best: 4, last: today, freezes: 1, freezeWeek: null },
    days: { [today]: { sec: 260, snacks: 3, lessons: 1, reviews: 0, correct: 4 } },
    srs: { "c/geld-grundlagen/wohin-geht-dein-geld/6": { box: 0, due: "2020-01-01" }, "c/geld-grundlagen/erst-dich-bezahlen/4": { box: 0, due: "2020-01-01" } },
    saved: [{ id: "c/geld-grundlagen/wohin-geht-dein-geld/8", at: 1 }, { id: "c/geld-grundlagen/erst-dich-bezahlen/8", at: 2 }, { id: "s/regel-72", at: 3 }],
    bookmarks: ["geld-grundlagen"], badges: { "first-lesson": 1 },
    settings: { sound: false, haptics: false, theme: "system", goal: 10, favorites: ["finanzen"] },
  },
  version: 1,
};
async function open(page: Page, hash: string) {
  await page.addInitScript((s) => localStorage.setItem("ympuls", JSON.stringify(s)), state);
  await page.goto(`/#${hash}`);
  await page.waitForTimeout(1000);
}
const shot = (page: Page, name: string, full = false) => page.screenshot({ path: `screenshots/${test.info().project.name}/${name}.png`, fullPage: full });

test("today", async ({ page }) => {
  await open(page, "/");
  await shot(page, "home-1");
  await page.locator(".scroll").first().evaluate((el) => el.scrollBy(0, 600));
  await page.waitForTimeout(400);
  await shot(page, "home-2");
  await page.getByRole("button", { name: "Inflation: der leise Dieb" }).click();
  await page.waitForTimeout(500);
  await shot(page, "home-popover");
});
test("chest", async ({ page }) => {
  await open(page, "/");
  await page.getByText("Antippen und öffnen!").click();
  await page.waitForTimeout(1600);
  await shot(page, "home-chest");
});
test("explore + course", async ({ page }) => {
  await open(page, "/entdecken");
  await shot(page, "explore");
  await open(page, "/kurs/geld-grundlagen");
  await shot(page, "course");
});
test("library", async ({ page }) => {
  await open(page, "/bibliothek");
  await shot(page, "library");
  await page.getByRole("button", { name: /Sammlung/ }).click();
  await page.waitForTimeout(500);
  await shot(page, "collection");
  await page.locator(".grid-cols-2 > button").first().click();
  await page.waitForTimeout(600);
  await shot(page, "collection-open");
});

test("profile + review + week", async ({ page }) => {
  await open(page, "/profil");
  await shot(page, "profile-1");
  await page.locator(".scroll").first().evaluate((el) => el.scrollBy(0, 700));
  await page.waitForTimeout(400);
  await shot(page, "profile-2");
  await page.locator(".scroll").first().evaluate((el) => el.scrollBy(0, 900));
  await page.waitForTimeout(400);
  await shot(page, "profile-3");
  await open(page, "/wiederholen");
  await shot(page, "review");
  await open(page, "/woche");
  await shot(page, "week");
});
