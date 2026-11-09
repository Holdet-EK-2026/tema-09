const fs = require("node:fs");
const { spawn } = require("node:child_process");
const path = require("node:path");
const toolsRoot = process.env.KINDDESIGN_QA_TOOLS || "/tmp/kinddesign-tools";
const lighthouseCLI = path.join(
  toolsRoot,
  "node_modules/lighthouse/cli/index.js",
);
const routes = [
  "/",
  "/events/",
  "/events/kalender/",
  "/om-kinddesign/",
  "/ny-her/",
  "/kontakt/",
  "/events/design-og-nye-forbindelser/",
  "/tilmelding/design-og-nye-forbindelser/",
];
const folder = "docs/qa/fase-6/lighthouse";
fs.mkdirSync(folder, { recursive: true });
async function audit(route, desktop) {
  const name =
    (route === "/" ? "forside" : route.replaceAll("/", "_")) +
    (desktop ? "-desktop" : "-mobile");
  const output = path.join(folder, name + ".json");
  const args = [
    lighthouseCLI,
    "http://127.0.0.1:4321" + route,
    "--chrome-path=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--chrome-flags=--headless --no-sandbox",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=json",
    "--output-path=" + output,
    "--quiet",
    "--screenEmulation.width=" + (desktop ? 1440 : 390),
    "--screenEmulation.height=" + (desktop ? 900 : 844),
    "--screenEmulation.deviceScaleFactor=1",
  ];
  if (desktop) args.push("--preset=desktop");
  const exitCode = await new Promise((resolve, reject) => {
    const process = spawn(global.process.execPath, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let errors = "";
    process.stderr.on("data", (data) => (errors += data.toString()));
    process.on("error", reject);
    process.on("exit", (code) => {
      if (code) console.error(name, errors);
      resolve(code);
    });
  });
  if (exitCode) throw new Error("Lighthouse fejlede: " + name);
  const report = JSON.parse(fs.readFileSync(output, "utf8"));
  const result = {
    route,
    mode: desktop ? "desktop" : "mobile",
    scores: Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    ),
    LCP: report.audits["largest-contentful-paint"].numericValue,
    CLS: report.audits["cumulative-layout-shift"].numericValue,
  };
  console.log(result);
  return result;
}
(async () => {
  const selected = process.env.KINDDESIGN_QA_ROUTES?.split(",") || routes;
  const summary = path.join(folder, "summary.json");
  const results = fs.existsSync(summary)
    ? JSON.parse(fs.readFileSync(summary, "utf8")).filter(
        (item) => !selected.includes(item.route),
      )
    : [];
  // Sekventielle målinger undgår at konkurrerende Chrome-processer påvirker hinanden.
  for (const route of selected)
    for (const desktop of [false, true])
      results.push(await audit(route, desktop));
  fs.writeFileSync(
    path.join(folder, "summary.json"),
    JSON.stringify(results, null, 2),
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
