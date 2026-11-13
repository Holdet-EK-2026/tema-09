process.env.PLAYWRIGHT_BROWSERS_PATH ||= "/tmp/kinddesign-tools/browsers";
const { webkit, chromium, devices } = require("/tmp/kinddesign-tools/node_modules/playwright");
const assert = require("node:assert/strict");
const base = process.env.KINDDESIGN_QA_BASE || "http://127.0.0.1:4325";

(async () => {
  for (const engine of [webkit, chromium]) {
    const browser = await engine.launch(engine === chromium ? { channel: "chrome" } : {});
    try {
      for (const width of [390, 1440]) {
        for (const preference of ["no-preference", "reduce"]) {
          const context = await browser.newContext({
            ...(width === 390 ? devices["iPhone 13"] : {}),
            viewport: { width, height: 900 },
            reducedMotion: preference,
          });
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", e => errors.push(e.message));
          const gallery = page.locator("[data-carousel]");
          const window = page.locator(".gallery-window");
          const toggle = page.locator("[data-carousel-toggle]");
          async function ready() {
            await window.scrollIntoViewIfNeeded();
            await page.waitForFunction(() => document.querySelector("[data-carousel]").dataset.photosReady === "true");
          }
          async function moving() {
            await page.waitForFunction(() => document.querySelector("[data-carousel]").dataset.pauseReason === "none");
            const start = Number(await gallery.getAttribute("data-phase"));
            await page.waitForTimeout(500);
            assert.notEqual(Number(await gallery.getAttribute("data-phase")), start, "requestAnimationFrame must advance");
          }
          async function still() {
            const start = await gallery.getAttribute("data-phase");
            await page.waitForTimeout(500);
            assert.equal(await gallery.getAttribute("data-phase"), start);
          }
          await page.goto(base);
          await ready();
          assert.equal(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), preference === "reduce");
          assert.equal(await gallery.getAttribute("data-reduced-motion"), String(preference === "reduce"));
          if (preference === "reduce") {
            assert(await toggle.isDisabled());
            assert(await toggle.locator(".carousel-motion-reason").isVisible());
            assert((await toggle.innerText()).includes("Reduceret bevægelse"));
            await still();
            const before = await gallery.getAttribute("data-phase");
            await page.locator("[data-carousel-next]").click();
            assert.notEqual(await gallery.getAttribute("data-phase"), before);
            await still();
            await window.focus();
            await page.keyboard.press("ArrowLeft");
            assert.equal(await gallery.getAttribute("data-phase"), before);
            await page.reload();
            await ready();
            assert(await toggle.isDisabled());
            await still();
          } else {
            await moving();
            // No preference is inferred from the user agent, and reload keeps autoplay available.
            await page.reload();
            await ready();
            await moving();
            await page.evaluate(() => scrollTo(0, 0));
            await page.waitForFunction(() => document.querySelector("[data-carousel]").dataset.pauseReason === "offscreen");
            await still();
            await ready();
            await moving();
            // Controlled visibilitychange simulation, not a claim about a physical app's lifecycle.
            await page.evaluate(() => {
              Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
              document.dispatchEvent(new Event("visibilitychange"));
            });
            assert.equal(await gallery.getAttribute("data-pause-reason"), "hidden-tab");
            await still();
            await page.evaluate(() => {
              delete document.hidden;
              document.dispatchEvent(new Event("visibilitychange"));
            });
            await moving();
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.waitForFunction(() => document.querySelector("[data-carousel]").dataset.reducedMotion === "true");
            assert(await toggle.isDisabled());
            await still();
            await page.emulateMedia({ reducedMotion: "no-preference" });
            await moving();
          }
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          assert.deepEqual(errors, []);
          console.log(engine.name(), width, preference, "passed");
          await context.close();
        }
      }
    } finally {
      await browser.close();
    }
  }
})().catch(error => { console.error(error); process.exit(1); });
