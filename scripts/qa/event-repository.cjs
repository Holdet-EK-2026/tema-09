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
    const { publishedEvents, displayRow } = await server.ssrLoadModule(
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
    const legacy = {id:"qa",slug:"qa",title:"QA",category:"Talk",starts_at:"2027-01-01T18:00:00Z",ends_at:"2027-01-01T19:00:00Z",timezone:"UTC",image_url:"/images/luma-qa-1200.webp",details:{id:"qa",coverWidth:1200,coverHeight:800}};
    assert.equal(displayRow(legacy).legacyCover,true);
    const uploaded = displayRow({...legacy,image_url:"https://example.test/storage/v1/object/public/event-images/events/new.webp",details:{...legacy.details,coverWidth:1000,coverHeight:750}});
    assert.equal(uploaded.legacyCover,false,"New uploaded photos must not use the old Luma srcset");
    assert.equal(uploaded.coverWidth,1000);
    console.log("Repository live read and network error state: passed");
  } finally {
    await server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
