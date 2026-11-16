const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/tmp/kinddesign-tools/browsers';
const {chromium,webkit} = require('/tmp/kinddesign-tools/node_modules/playwright');
(async()=>{
  const root=process.env.KINDDESIGN_BUILD_DIR || 'dist';
  const base=process.env.KINDDESIGN_QA_BASE || 'http://127.0.0.1:4325';
  const manifest=JSON.parse(fs.readFileSync('supabase/event-image-manifest.json','utf8'));
  const listing=fs.readFileSync(path.join(root,'events/index.html'),'utf8');
  for(const event of manifest){
    assert.ok(listing.includes(`/events/${event.slug}/`));
    const html=fs.readFileSync(path.join(root,'events',event.slug,'index.html'),'utf8');
    assert.ok(html.includes(`https://luma.com/${event.id}`));
    for(const source of event.sources) assert.ok(html.includes(source.url));
  }
  for(const engine of [chromium,webkit]){
    const browser=await engine.launch(engine===chromium ? {channel:'chrome'} : {});
    try{
      for(const width of [390,1440]){
        // No JS and no REST network: content must already be in the generated HTML.
        const context=await browser.newContext({viewport:{width,height:844},javaScriptEnabled:false});
        await context.route('**/rest/v1/**',route=>route.abort());
        const page=await context.newPage();
        for(const event of manifest){
          const response=await page.goto(`${base}/events/${event.slug}/`);
          assert.equal(response.status(),200);
          const image=page.locator('.official-cover');
          await image.scrollIntoViewIfNeeded();
          await image.evaluate(img=>img.decode());
          assert.ok(await image.evaluate(img=>img.naturalWidth>0 && img.currentSrc.includes('/storage/v1/object/public/event-images/')));
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
          assert.equal(await page.locator(`a[href="https://luma.com/${event.id}"]`).count()>0,true);
        }
        await page.goto(`${base}/events/`);
        for(const event of manifest) assert.ok(await page.locator(`a[href="/events/${event.slug}/"]`).count()>0);
        await context.close();
        console.log(engine.name(),width,'PASS: all eight static details, responsive Storage images, Luma links, no JS/REST dependency');
      }
    }finally{await browser.close()}
  }
})().catch(error=>{console.error(error);process.exit(1)});
