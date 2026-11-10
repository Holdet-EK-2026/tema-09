const base = process.env.KINDDESIGN_QA_BASE || "http://127.0.0.1:4321";
const toolsRoot = process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools";
const { chromium } = require(toolsRoot + "/node_modules/playwright");
const AxeBuilder = require(
  toolsRoot + "/node_modules/@axe-core/playwright",
).default;
const fs = require("node:fs");
const assert = require("node:assert/strict");
const folder = process.env.KINDDESIGN_QA_OUTPUT || "docs/qa/ux-ui-final/after";
fs.mkdirSync(folder, { recursive: true });
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
      await page.goto(base + route);
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
    await page.goto(base + "/kontakt/");
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
    const response = await page.goto(base + "/findes-ikke/");
    assert.equal(response.status(), 404);
    assert((await page.locator("h1").innerText()).includes("ikke fundet"));
    assert(
      await page.evaluate(
        () => innerWidth === document.documentElement.scrollWidth,
      ),
    );
    await page.screenshot({
      path: `${folder}/404-${width}.png`,
      fullPage: true,
    });
    await page.goto(base + "/events/design-og-nye-forbindelser/");
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
      path: `${folder}/_events_design-og-nye-forbindelser_-${width}.png`,
      fullPage: true,
    });
    await page.goto(base + "/");
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
    assert.equal(
      await page.locator("#membership-dialog, .membership-concept").count(),
      0,
    );
    const question = page.locator("[data-faq] button").first();
    await question.focus();
    await page.keyboard.press("Enter");
    assert.equal(await question.getAttribute("aria-expanded"), "true");
    await page.keyboard.press("Space");
    assert.equal(await question.getAttribute("aria-expanded"), "false");
    assert.equal(errors.length, 0);
    results.push({
      keyboardSkipNavAndFilter: true,
      faqKeyboard: true,
      membershipConceptRemoved: true,
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
  await page.goto(base + "/kontakt/");
  assert(await page.locator("[type=submit]").isDisabled());
  await page.locator("#name").fill("Lokal test");
  await page.locator("#name").press("Enter");
  assert(!page.url().includes("?"));
  await page.goto(base + "/");
  assert.equal(await page.locator(".gallery-controls").count(), 0);
  assert(
    !(await page.locator("[data-carousel]").getAttribute("class")).includes(
      "carousel-ready",
    ),
  );
  await page.locator(".gallery-window").scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    const photos = [...document.querySelectorAll(".gallery-card noscript img")];
    photos.forEach((photo) => {
      photo.loading = "eager";
    });
    await Promise.all(photos.map((photo) => photo.decode()));
  });
  assert.equal(await page.locator(".gallery-card noscript img").count(), 6);
  await page.locator(".gallery-window").focus();
  await page.keyboard.press("ArrowRight");
  // Polling via requestAnimationFrame kører ikke med JavaScript deaktiveret.
  await page.waitForTimeout(400);
  assert(
    await page
      .locator(".gallery-window")
      .evaluate((node) => node.scrollLeft > 0),
  );
  await noJS.close();
  const retina = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const rp = await retina.newPage();
  await rp.goto(base + "/");
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
  await rp.locator(".gallery-window").scrollIntoViewIfNeeded();
  await rp.waitForFunction(
    () =>
      document.querySelector("[data-carousel]").dataset.photosReady === "true",
  );
  const gallerySource = await rp
    .locator(".gallery-card.is-active img")
    .evaluate((img) => img.currentSrc);
  assert(gallerySource.endsWith("-1600.webp"));
  await rp.locator("[data-carousel]").screenshot({
    path: `${folder}/carousel-retina-390.png`,
  });
  results.push({
    noJavaScriptGalleryPhotos: 6,
    noJavaScriptKeyboardScroll: true,
    retinaGallery: gallerySource,
  });
  await retina.close();
  fs.writeFileSync(`${folder}/smoke.json`, JSON.stringify(results, null, 2));
  console.log(results);
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
