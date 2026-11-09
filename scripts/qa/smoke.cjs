const toolsRoot = process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools";
const { chromium } = require(toolsRoot + "/node_modules/playwright");
const AxeBuilder = require(
  toolsRoot + "/node_modules/@axe-core/playwright",
).default;
const fs = require("node:fs");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const results = [];
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of [
      "/tilmelding/design-og-nye-forbindelser/",
      "/kalender/design-og-nye-forbindelser/",
    ]) {
      await page.goto("http://127.0.0.1:4321" + route);
      assert.equal(
        (
          await page
            .locator("header nav:visible [aria-current=page]")
            .innerText()
        ).trim(),
        "Events",
      );
      if (route.startsWith("/tilmelding/")) {
        await page.locator("[data-registration-submit]").click();
        assert.equal(
          (
            await new AxeBuilder({ page })
              .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
              .analyze()
          ).violations.length,
          0,
        );
      }
    }
    await page.goto("http://127.0.0.1:4321/kontakt/");
    await page.locator("button[type=submit]").click();
    assert.equal(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations.length,
      0,
    );
    await page.locator("#name").fill("Lokal test");
    await page.locator("#email").fill("test@example.com");
    await page.locator("#message").fill("Kun testdata.");
    await page.locator("button[type=submit]").click();
    assert.equal(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations.length,
      0,
    );
    const response = await page.goto("http://127.0.0.1:4321/findes-ikke/");
    assert.equal(response.status(), 404);
    assert((await page.locator("h1").innerText()).includes("ikke fundet"));
    assert(
      await page.evaluate(
        () => innerWidth === document.documentElement.scrollWidth,
      ),
    );
    await page.screenshot({
      path: `docs/qa/fase-6/404-${width}.png`,
      fullPage: true,
    });
    await page.goto("http://127.0.0.1:4321/events/design-og-nye-forbindelser/");
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll("img").forEach((image) => {
        image.loading = "eager";
      });
      await Promise.all(
        [...document.images].map((i) => i.decode().catch(() => {})),
      );
    });
    await page.screenshot({
      path: `docs/qa/fase-6/_events_design-og-nye-forbindelser_-${width}.png`,
      fullPage: true,
    });
    await page.goto("http://127.0.0.1:4321/");
    await page.keyboard.press("Tab");
    assert(
      await page
        .locator(".skip-link")
        .evaluate((node) => node === document.activeElement),
    );
    await page.keyboard.press("Enter");
    await page.waitForURL("**/#indhold");
    await page.waitForFunction(() => document.activeElement?.id === "indhold");
    assert(
      await page
        .locator("#indhold")
        .evaluate((node) => node === document.activeElement),
    );
    const nav = width === 390 ? ".mobile-navigation" : ".desktop-navigation";
    await page.locator(nav + ' a[href="/events/"]').focus();
    await page.keyboard.press("Enter");
    await page.waitForURL("**/events/");
    await page.locator('[data-filter="Talk"]').focus();
    await page.keyboard.press("Space");
    assert.equal(await page.locator(".event-card:visible").count(), 1);
    assert.equal(
      await page.locator(".event-card:visible").getAttribute("data-event-type"),
      "Talk",
    );
    await page.locator(nav + ' a[href="/ny-her/"]').focus();
    await page.keyboard.press("Enter");
    await page.waitForURL("**/ny-her/");
    if (width === 1440) {
      const trigger = page.locator("[data-membership-open]");
      await trigger.focus();
      await page.keyboard.press("Enter");
      assert(await page.locator("#membership-dialog").isVisible());
      assert.equal(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations.length,
        0,
      );
      await page.keyboard.press("Escape");
      assert(await page.locator("#membership-dialog").isHidden());
      assert(await trigger.evaluate((node) => node === document.activeElement));
    }
    assert.equal(errors.length, 0);
    results.push({
      keyboardSkipNavAndFilter: true,
      membershipDialogKeyboard: width === 1440 ? true : "desktop-only",
      width,
      demoNavCurrent: true,
      contactErrorAndConfirmationAxe: 0,
      registrationConfirmationAxe: 0,
      custom404: true,
      errors,
    });
    await context.close();
  }
  const noJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await noJS.newPage();
  await page.goto("http://127.0.0.1:4321/kontakt/");
  assert(await page.locator("[type=submit]").isDisabled());
  await page.locator("#name").fill("Lokal test");
  await page.locator("#name").press("Enter");
  assert(!page.url().includes("?"));
  await page.goto("http://127.0.0.1:4321/");
  assert(await page.locator("[data-carousel-pause]").isDisabled());
  assert(
    !(await page.locator("[data-carousel]").getAttribute("class")).includes(
      "carousel-ready",
    ),
  );
  await noJS.close();
  const retina = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const rp = await retina.newPage();
  await rp.goto("http://127.0.0.1:4321/");
  await rp.evaluate(() => document.fonts.ready);
  const source = await rp
    .locator(".hero-photo img")
    .evaluate((img) => img.currentSrc);
  assert(source.endsWith("1207b-1200.webp"));
  results.push({
    noJavaScriptContactSafe: true,
    staticCarouselFallback: true,
    retinaHero: source,
  });
  await retina.close();
  fs.writeFileSync(
    "docs/qa/fase-6/smoke.json",
    JSON.stringify(results, null, 2),
  );
  console.log(results);
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
