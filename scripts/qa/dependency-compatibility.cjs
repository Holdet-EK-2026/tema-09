const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
(async () => {
  const { glob } = await import("glob");
  const { minimatch, Minimatch } = await import("minimatch");
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), "kinddesign-glob-"));
  try {
    await fs.mkdir(path.join(folder, "nested"));
    await fs.writeFile(path.join(folder, "one.js"), "");
    await fs.writeFile(path.join(folder, "nested", "two.js"), "");
    await fs.writeFile(path.join(folder, ".hidden.js"), "");
    await fs.writeFile(path.join(folder, "nested", "skip.json"), "");
    const files = await glob(folder + "/**/*", {
      mark: true,
      ignore: folder + "/**/*.json",
      dot: true,
      nodir: true,
    });
    assert.deepEqual(files.map((f) => path.relative(folder, f)).sort(), [
      ".hidden.js",
      "nested/two.js",
      "one.js",
    ]);
    assert(minimatch("nested/two.js", "**/*.js"));
    assert(!minimatch("nested/skip.json", "**/*.js"));
    assert(new Minimatch("**/*.js", { dot: true }).match(".hidden.js"));
    /* v11 removes makeRe(). No installed Netlify/NFT/readdir-glob/TypeScript caller uses it; verify their actual named matching APIs instead. */ const {
      pathToFileURL,
    } = require("node:url");
    const matching = await import(
      pathToFileURL(
        path.join(
          process.cwd(),
          "node_modules/@netlify/zip-it-and-ship-it/dist/utils/matching.js",
        ),
      )
    );
    assert(matching.minimatch("nested/two.js", "**/*.js"));
    const { default: readdirGlob } = await import("readdir-glob");
    const matches = await new Promise((resolve, reject) =>
      readdirGlob(folder, { pattern: "**/*.js", dot: true }, (error, data) =>
        error ? reject(error) : resolve(data),
      ),
    );
    assert.equal(matches.length, 3);
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(glob(folder + "/**/*", { signal: controller.signal }));
    console.log(
      "Patched glob/minimatch API compatibility and cancellation: passed",
    );
  } finally {
    await fs.rm(folder, { recursive: true, force: true });
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
