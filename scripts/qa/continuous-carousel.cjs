const fs = require("node:fs");
const toolsRoot = process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools";
if (
  !process.env.PLAYWRIGHT_BROWSERS_PATH &&
  fs.existsSync(toolsRoot + "/browsers/ffmpeg-1013")
)
  process.env.PLAYWRIGHT_BROWSERS_PATH = toolsRoot + "/browsers";
const { chromium } = require(
  (process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools") +
    "/node_modules/playwright",
);
const assert = require("node:assert/strict");
const base = process.env.KINDDESIGN_QA_BASE || "http://127.0.0.1:4323";
const out =
  process.env.KINDDESIGN_QA_OUTPUT ||
  "docs/qa/continuous-carousel-2026-11-11/after";
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const results = [];
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      isMobile: width === 390,
      hasTouch: width === 390,
      recordVideo: {
        dir: out,
        size: { width: Math.min(width, 1280), height: 900 },
      },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base);
    const gallery = page.locator("[data-carousel]"),
      window = page.locator(".gallery-window"),
      toggle = page.locator("[data-carousel-toggle]");
    await window.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document.querySelector("[data-carousel]").dataset.photosReady ===
        "true",
    );
    const samples = await page.evaluate(async () => {
      const el = document.querySelector("[data-carousel]");
      const data = [];
      const start = performance.now();
      while (performance.now() - start < 15500) {
        data.push({
          t: performance.now() - start,
          phase: Number(el.dataset.phase),
          reason: el.dataset.pauseReason,
        });
        await new Promise((r) => setTimeout(r, 100));
      }
      return data;
    });
    const increments = samples
      .slice(1)
      .map((s, i) => (s.phase - samples[i].phase + 6) % 6);
    assert(
      increments.every((d) => d > 0 && d < 0.04),
      "Every sample moves smoothly without a dwell",
    );
    assert(samples.at(-1).phase - samples[0].phase > 1.2);
    await page.screenshot({ path: `${out}/continuous-${width}.png` });
    await toggle.focus();
    const focused = Number(await gallery.getAttribute("data-phase"));
    await page.waitForTimeout(350);
    assert.equal(Number(await gallery.getAttribute("data-phase")), focused);
    await toggle.press("Enter");
    await page.waitForTimeout(350);
    assert(Number(await gallery.getAttribute("data-phase")) > focused);
    assert(await toggle.evaluate((e) => e === document.activeElement));
    await toggle.press("Enter");
    const paused = Number(await gallery.getAttribute("data-phase"));
    await page.waitForTimeout(350);
    assert.equal(Number(await gallery.getAttribute("data-phase")), paused);
    await page.locator("[data-carousel-next]").click();
    await page.waitForTimeout(700);
    let phase = Number(await gallery.getAttribute("data-phase"));
    assert(Math.abs(phase - Math.round(phase)) < 0.001);
    await window.focus();
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(700);
    assert.equal(
      Number(await gallery.getAttribute("data-phase")),
      (phase + 5) % 6,
    );
    // Swipe through the actual pointer event path, without invoking implementation functions.
    const box = await window.boundingBox();
    if (width === 390) {
      const cdp = await context.newCDPSession(page);
      const y = box.y + box.height * 0.45;
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: box.x + box.width * 0.7, y }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: box.x + box.width * 0.3, y }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      await cdp.detach();
    } else {
      await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.45);
      await page.mouse.down();
      await page.mouse.move(
        box.x + box.width * 0.3,
        box.y + box.height * 0.45,
        { steps: 10 },
      );
      await page.mouse.up();
    }
    await page.waitForTimeout(700);
    assert.equal(Number(await gallery.getAttribute("data-phase")), phase);
    // Put the last card at the centre using ordinary controls, then cross last/first at real speed.
    while (Number(await gallery.getAttribute("data-phase")) !== 5) {
      await page.locator("[data-carousel-next]").click();
      await page.waitForTimeout(700);
    }
    await toggle.click();
    await page.mouse.move(0, 0);
    const seam = await page.evaluate(async () => {
      const e = document.querySelector("[data-carousel]");
      const a = [];
      const t = performance.now();
      while (performance.now() - t < 13500) {
        a.push({
          t: performance.now() - t,
          phase: Number(e.dataset.phase),
          cards: [...e.querySelectorAll(".gallery-card")].map((c) => ({
            x: c.getBoundingClientRect().x,
            opacity: Number(getComputedStyle(c).opacity),
          })),
        });
        await new Promise((r) => setTimeout(r, 80));
      }
      return a;
    });
    assert(seam.some((s, i) => i && s.phase < seam[i - 1].phase));
    assert(
      seam.slice(1).every((s, i) => (s.phase - seam[i].phase + 6) % 6 < 0.04),
    );
    seam.slice(1).forEach((s, i) =>
      s.cards.forEach((c, j) => {
        const before = seam[i].cards[j];
        if (Math.abs(c.x - before.x) > 25)
          assert(
            c.opacity < 0.15 && before.opacity < 0.15,
            "Only invisible edge cards may recycle",
          );
      }),
    );
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
    assert.equal(await gallery.getAttribute("data-pause-reason"), "offscreen");
    const off = await gallery.getAttribute("data-phase");
    await page.waitForTimeout(300);
    assert.equal(await gallery.getAttribute("data-phase"), off);
    await window.scrollIntoViewIfNeeded();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(200);
    assert(await toggle.isDisabled());
    const still = await gallery.getAttribute("data-phase");
    await page.waitForTimeout(300);
    assert.equal(await gallery.getAttribute("data-phase"), still);
    await page.locator("[data-carousel-next]").click();
    assert.notEqual(await gallery.getAttribute("data-phase"), still);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.deepEqual(errors, []);
    results.push({
      width,
      samples,
      increments,
      seam,
      focusPlay: true,
      pause: true,
      arrows: true,
      keyboard: true,
      swipe: true,
      reducedMotion: true,
      offscreen: true,
      errors,
    });
    await context.close();
    fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  }
  await browser.close();
  console.log("Continuous carousel: all checks passed");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
