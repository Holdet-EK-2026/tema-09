const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const assert = require("node:assert/strict");
const results = [];
// Syntetiske URL-fixtures bruges kun i en midlertidig build. Ingen ekstern side åbnes.
for (const [name, value, expected] of [
  [
    "valid",
    "https://lu.ma/kinddesign-qa-fixture",
    "https://lu.ma/kinddesign-qa-fixture",
  ],
  [
    "invalid-domain",
    "https://example.com/kinddesign-qa-fixture",
    "/tilmelding/design-og-nye-forbindelser/",
  ],
]) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), "kinddesign-luma-"));
  try {
    const build = spawnSync(
      process.execPath,
      ["node_modules/astro/bin/astro.mjs", "build", "--outDir", folder],
      {
        env: {
          ...process.env,
          PUBLIC_LUMA_MEETUP_URL: value,
          ASTRO_TELEMETRY_DISABLED: "1",
        },
        encoding: "utf8",
      },
    );
    assert.equal(build.status, 0, build.stderr);
    const html = fs.readFileSync(
      path.join(folder, "events/design-og-nye-forbindelser/index.html"),
      "utf8",
    );
    assert(
      html.includes(`href="${expected}"`),
      `${name}: forkert CTA-destination`,
    );
    results.push({
      configuration: name,
      expected,
      passed: true,
      externalRequests: false,
    });
  } finally {
    fs.rmSync(folder, { recursive: true, force: true });
  }
}
fs.writeFileSync(
  "docs/qa/fase-6/luma-config.json",
  JSON.stringify(results, null, 2),
);
console.log(results);
