const root = process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools";
const { chromium } = require(root + "/node_modules/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const results = [];
  for (const width of [390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.clock.install({ time: new Date("2026-11-09T12:00:00Z") });
    await page.goto("http://127.0.0.1:4321");
    const gallery = page.locator("[data-carousel]");
    const viewport = page.locator(".gallery-window");
    const index = async () =>
      Number(await gallery.getAttribute("data-active-index"));
    const out = async () => {
      await page.evaluate(() => document.activeElement?.blur());
      await page.mouse.move(-10, -10);
    };
    await viewport.scrollIntoViewIfNeeded();
    await out();
    await page.clock.runFor(200);
    assert.equal(await gallery.getAttribute("data-autoplay"), "running");
    let before = await index();
    await page.clock.runFor(4600);
    assert.equal(await index(), (before + 1) % 6);
    await viewport.hover();
    before = await index();
    await page.clock.runFor(5000);
    assert.equal(await index(), before);
    await page.mouse.move(-10, -10);
    await page.clock.runFor(4600);
    assert.equal(await index(), (before + 1) % 6);
    await viewport.focus();
    before = await index();
    await page.clock.runFor(5000);
    assert.equal(await index(), before);
    await out();
    await page.clock.runFor(4600);
    assert.equal(await index(), (before + 1) % 6);
    await page.locator('[data-carousel-direction="1"]').click();
    await out();
    before = await index();
    await page.clock.runFor(7900);
    assert.equal(await index(), before);
    await page.clock.runFor(200);
    assert.equal(await index(), (before + 1) % 6);
    await page.locator("[data-carousel-pause]").click();
    await out();
    before = await index();
    await page.clock.runFor(10000);
    assert.equal(await index(), before);
    assert.equal(
      await page.locator("[data-carousel-pause]").getAttribute("aria-pressed"),
      "true",
    );
    await page.locator("[data-carousel-pause]").click();
    await out();
    await page.clock.runFor(4600);
    assert.equal(await index(), (before + 1) % 6);
    // Headless Chrome holder ofte alle tabs synlige. Simulér da visibilitychange-kontrakten eksplicit.
    const other = await context.newPage();
    await other.goto("about:blank");
    await other.bringToFront();
    const nativeHidden = await page.evaluate(() => document.hidden);
    if (!nativeHidden)
      await page.evaluate(() =>
        Object.defineProperty(document, "hidden", {
          configurable: true,
          get: () => true,
        }),
      );
    await page.evaluate(() =>
      document.dispatchEvent(new Event("visibilitychange")),
    );
    before = await index();
    await page.clock.runFor(10000);
    assert.equal(await index(), before);
    if (!nativeHidden) await page.evaluate(() => delete document.hidden);
    await other.close();
    await page.bringToFront();
    await page.evaluate(() =>
      document.dispatchEvent(new Event("visibilitychange")),
    );
    await out();
    await page.clock.runFor(4600);
    assert.equal(await index(), (before + 1) % 6);
    before = await index();
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForFunction(
      () =>
        document.querySelector("[data-carousel]").dataset.autoplay === "paused",
    );
    await page.clock.runFor(200);
    await page.clock.runFor(5000);
    assert.equal(await index(), before);
    await viewport.scrollIntoViewIfNeeded();
    await out();
    await page.clock.runFor(200);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(
      () => document.querySelector("[data-carousel-pause]").disabled,
    );
    await page.clock.runFor(200);
    assert(await page.locator("[data-carousel-pause]").isDisabled());
    before = await index();
    await page.clock.runFor(10000);
    assert.equal(await index(), before);
    assert.equal(
      await page
        .locator(".gallery-card")
        .first()
        .evaluate((n) => getComputedStyle(n).transitionDuration),
      "0s",
    );
    await viewport.focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await index(), (before + 1) % 6);
    await page.keyboard.press("End");
    assert.equal(await index(), 5);
    await page.keyboard.press("ArrowRight");
    assert.equal(await index(), 0);
    await page.keyboard.press("ArrowLeft");
    assert.equal(await index(), 5);
    await page.keyboard.press("Home");
    assert.equal(await index(), 0);
    const firstAlt = await page
      .locator(".gallery-card.is-active img")
      .getAttribute("alt");
    for (let i = 0; i < 6; i++) {
      await page.locator('[data-carousel-direction="1"]').click();
      assert.equal(
        await page.locator('.gallery-card[aria-hidden="false"]').count(),
        1,
      );
    }
    assert.equal(await index(), 0);
    assert.equal(
      await page.locator(".gallery-card.is-active img").getAttribute("alt"),
      firstAlt,
    );
    for (let i = 0; i < 6; i++)
      await page.locator('[data-carousel-direction="-1"]').click();
    assert.equal(await index(), 0);
    await page.locator('[data-carousel-slide="3"]').click();
    assert.equal(await index(), 3);
    assert.equal(
      await page.locator('[data-carousel-slide][aria-pressed="true"]').count(),
      1,
    );
    await gallery.screenshot({
      path: `docs/qa/final-implementation/carousel-${width}.png`,
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    assert.equal(errors.length, 0);
    results.push({
      width,
      autoplay4500ms: true,
      hoverPause: true,
      focusPause: true,
      manualResume8000ms: true,
      pausePlay: true,
      hiddenTabPause: true,
      hiddenTabMethod: nativeHidden ? "native" : "simulated visibilitychange",
      offscreenPause: true,
      reducedMotion: true,
      keyboardAndIndicators: true,
      infiniteLoopBothDirections: true,
      errors,
    });
    await context.close();
  }
  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await touch.newPage();
  await page.goto("http://127.0.0.1:4321");
  await page.locator(".gallery-window").scrollIntoViewIfNeeded();
  const rect = await page.locator(".gallery-window").boundingBox();
  const y = Math.max(40, Math.min(800, rect.y + rect.height / 2));
  const cdp = await touch.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 270, y, id: 1 }],
  });
  for (let i = 1; i <= 6; i++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 270 - i * 22, y, id: 1 }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  assert.equal(
    await page.locator("[data-carousel]").getAttribute("data-active-index"),
    "1",
  );
  assert.equal(page.url(), "http://127.0.0.1:4321/");
  results.push({ mobileTouchSwipe: true, noAccidentalNavigation: true });
  await touch.close();
  fs.writeFileSync(
    "docs/qa/final-implementation/carousel.json",
    JSON.stringify(results, null, 2),
  );
  console.log(results);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
