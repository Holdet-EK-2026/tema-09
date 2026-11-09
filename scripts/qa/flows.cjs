const toolsRoot = process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools";
const { chromium } = require(toolsRoot + "/node_modules/playwright");
const assert = require("assert");
const fs = require("fs");
(async () => {
  const b = await chromium.launch({ channel: "chrome" });
  let results = [];
  for (const width of [390, 768, 1440]) {
    const c = await b.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const p = await c.newPage();
    let errors = [],
      posts = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("request", (r) => {
      if (r.method() !== "GET") posts.push(r.url());
    });
    await p.goto("http://localhost:4321/events/");
    assert.equal(await p.locator(".event-card:visible").count(), 8);
    for (const type of ["Meetup", "Workshop", "Talk"]) {
      await p.locator(`[data-filter="${type}"]`).click();
      assert.equal(
        await p.locator(".event-card:visible").count(),
        type === "Meetup" ? 6 : 1,
      );
      assert(
        (
          await p
            .locator(".event-card:visible")
            .evaluateAll((nodes) => nodes.map((node) => node.dataset.eventType))
        ).every((value) => value === type),
      );
    }
    await p.reload();
    assert.equal(
      await p.locator('[data-filter="Talk"]').getAttribute("aria-pressed"),
      "true",
    );
    await p.locator('[data-filter="Alle"]').click();
    assert.equal(await p.locator(".event-card:visible").count(), 8);
    await p.goBack();
    assert.equal(await p.locator(".event-card:visible").count(), 1);
    const slugs = [
      "design-og-nye-forbindelser",
      "ideer-paa-papir",
      "design-i-virkeligheden",
      "et-bord-nye-ansigter",
    ];
    for (const slug of slugs) {
      await p.goto(`http://localhost:4321/events/${slug}/`);
      await p.locator(".detail-actions a").first().click();
      assert(new URL(p.url()).pathname.startsWith("/tilmelding/"));
      await p.locator("[data-registration-submit]").focus();
      await p.keyboard.press("Enter");
      assert(await p.locator("[data-registration-confirmation]").isVisible());
      assert(
        (
          await p.locator("[data-registration-confirmation]").textContent()
        ).includes("IKKE tilmeldt"),
      );
      await p.locator("[data-registration-confirmation] a").click();
      await p.locator(".detail-actions a").nth(1).click();
      assert(
        (await p.locator("main").textContent()).includes("Intet er tilføjet"),
      );
    }
    await p.goto("http://localhost:4321/kontakt/?emne=Samarbejde");
    assert.equal(await p.locator("#subject").inputValue(), "Samarbejde");
    await p.locator("button[type=submit]").click();
    assert(await p.locator(".form-error-summary").isVisible());
    assert.equal(await p.locator("#name").getAttribute("aria-invalid"), "true");
    await p.locator("#name").fill("Testperson");
    await p.locator("#email").fill("forkert");
    await p.locator("#message").fill("En lokal testbesked.");
    await p.locator("button[type=submit]").click();
    assert.equal(
      await p.locator("#email").getAttribute("aria-invalid"),
      "true",
    );
    await p.locator("#email").fill("test@example.com");
    await p.locator("button[type=submit]").click();
    assert(await p.locator(".contact-confirmation").isVisible());
    assert(
      (await p.locator(".contact-confirmation").textContent()).includes(
        "Intet er sendt",
      ),
    );
    await p.screenshot({
      path: `docs/qa/final-implementation/contact-confirmation-${width}.png`,
      fullPage: true,
    });
    await p.locator("[data-contact-reset]").click();
    assert.equal(await p.locator("#name").inputValue(), "");
    assert(
      await p.locator("#name").evaluate((n) => document.activeElement === n),
    );
    assert.equal(await p.evaluate(() => localStorage.length), 0);
    assert.equal(posts.length, 0);
    assert.equal(errors.length, 0);
    results.push({
      width,
      filters: true,
      filterReloadAndBack: true,
      eventFlows: 4,
      calendarDemos: 4,
      contactValidationAndReset: true,
      posts,
      errors,
    });
    await c.close();
  }
  fs.writeFileSync(
    "docs/qa/final-implementation/flows.json",
    JSON.stringify(results, null, 2),
  );
  console.log(results);
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
