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
    const broken = async () => { throw new Error("Network unavailable"); };
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
    for (const response of [new Response("error", {status:503}), new Response("invalid"), Response.json({}), Response.json([{...legacy,status:"draft"}])]) {
      assert.match((await publishedEvents(async()=>response)).error,/kunne ikke hentes/);
    }
    const controlled = await publishedEvents(async(endpoint,options)=>{
      const url=new URL(endpoint);
      assert.equal(url.searchParams.get("status"),"eq.published");
      assert.equal(url.searchParams.get("order"),"starts_at.desc");
      assert.ok(options.headers.apikey);
      return Response.json([{...legacy,status:"published"}]);
    });
    assert.equal(controlled.events[0].slug,"qa");
    for(const event of normal.events){
      assert.ok(event.imageUrl.includes("/storage/v1/object/public/event-images/events/"));
      assert.equal(event.imageSrcset.split(", ").length,3);
      assert.ok(event.coverWidth>0 && event.coverHeight>0);
    }
    const changed=displayRow({...legacy,image_url:"https://example.test/new.webp",details:{...legacy.details,imageSources:[{url:normal.events[0].imageUrl,width:600}]}});
    assert.equal(changed.imageSrcset,undefined,"Stale sources must not replace the selected image");
    console.log("PASS: eight live events, REST contract, failure/draft handling and responsive Storage sources");
  } finally {
    await server.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
