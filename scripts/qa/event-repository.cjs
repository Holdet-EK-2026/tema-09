const assert = require("node:assert/strict");
(async () => {
  const { createServer } = await import("vite");
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    appType: "custom",
    envPrefix: ["PUBLIC_", "VITE_"],
  });
  try {
    const { publishedEvents } = await server.ssrLoadModule(
      "/src/lib/event-repository.js",
    );
    const { createClient } = await import("@supabase/supabase-js");
    const broken = () =>
      createClient("http://127.0.0.1:1", "sb_publishable_unavailable", {
        auth: { persistSession: false },
      });
    const result = await publishedEvents(broken);
    assert.deepEqual(result.events, []);
    assert.match(result.error, /kunne ikke hentes/);
    const normal = await publishedEvents();
    assert.equal(normal.error, null);
    assert.equal(normal.events.length, 8);
    console.log("Repository live read and network error state: passed");
  } finally {
    await server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
