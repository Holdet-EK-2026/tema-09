import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
const root = path.resolve("dist");
async function htmlFiles(folder) {
  const files = [];
  for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
    const name = path.join(folder, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(name)));
    else if (name.endsWith(".html")) files.push(name);
  }
  return files;
}
const files = await htmlFiles(root);
const broken = [];
const documents = new Map();
for (const file of files) documents.set(file, await fs.readFile(file, "utf8"));
for (const [file, html] of documents) {
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `Siden skal have én h1: ${file}`,
  );
  assert(/<html[^>]*lang="da"/.test(html), `Dansk sprog mangler: ${file}`);
  assert(/<title>[^<]+<\/title>/.test(html), `Titel mangler: ${file}`);
  assert(
    /<main[^>]*id="indhold"[^>]*tabindex="-1"/.test(html),
    `Skip-linkets fokusmål mangler: ${file}`,
  );
  assert(
    !html.includes("data-future-page"),
    `Gammel fase 1-navigation findes: ${file}`,
  );
  assert(
    !/figma\.com\/api\/mcp\/asset/.test(html),
    `Midlertidigt asset-link findes: ${file}`,
  );
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = new URL(
      match[1].replaceAll("&amp;", "&"),
      "http://local.test/" + path.relative(root, file),
    );
    if (url.origin !== "http://local.test") continue;
    const pathname = decodeURIComponent(url.pathname);
    const destination = path.join(
      root,
      pathname.endsWith("/") ? pathname + "index.html" : pathname,
    );
    let target = destination;
    try {
      const stat = await fs.stat(target);
      if (stat.isDirectory()) target = path.join(target, "index.html");
      await fs.access(target);
    } catch {
      broken.push({ from: path.relative(root, file), to: match[1] });
      continue;
    }
    if (url.hash && target.endsWith(".html")) {
      const content =
        documents.get(target) || (await fs.readFile(target, "utf8"));
      const id = decodeURIComponent(url.hash.slice(1));
      if (!content.includes(`id="${id}"`))
        broken.push({
          from: path.relative(root, file),
          to: match[1],
          reason: "Manglende anker",
        });
    }
  }
}
assert.deepEqual(broken, [], "Der findes brudte lokale links eller assets.");
console.log(
  `${files.length} HTML-sider: titler, h1, sprog, lokale links, ankre og assets består.`,
);
