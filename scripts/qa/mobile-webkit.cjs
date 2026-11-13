// Playwright mobile emulation; this is not a physical iPhone or Messenger test.
process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/tmp/kinddesign-tools/browsers';
const {chromium, webkit, devices} = require('/tmp/kinddesign-tools/node_modules/playwright');
const assert = require('node:assert/strict');
const base = process.env.KINDDESIGN_QA_BASE || 'https://kinddesign-holdet-ek-2026.netlify.app';
const engine = process.env.KINDDESIGN_QA_ENGINE || 'webkit';
const sizes = [[320,568],[375,667],[390,844],[430,932]];
const routes = ['/', '/events/', '/events/kalender/', '/events/from-ballet-to-technology/', '/om-kinddesign/', '/ny-her/', '/kontakt/'];
(async()=>{
 const browser = await (engine==='webkit'?webkit:chromium).launch(engine==='webkit'?{}:{channel:'chrome'});
 const failures=[]; let cases=0;
 const {verifiedLumaEvents}=await import('../../src/data/luma-events.js');
 try {
  for(const [portraitWidth,portraitHeight] of sizes) for(const landscape of [false,true]) {
   const width=landscape?portraitHeight:portraitWidth,height=landscape?portraitWidth:portraitHeight;
   const context=await browser.newContext({...devices['iPhone 13'],viewport:{width,height},screen:{width,height}});
   const page=await context.newPage();page.setDefaultTimeout(12000);
   const errors=[],posts=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')posts.push(r.url())});
   async function check(name,fn){try{await fn();}catch(e){failures.push({engine,width,height,name,error:e.message.split('\n').slice(0,5).join(' ')});}}
   for(const route of routes) await check(route,async()=>{
    assert.equal((await page.goto(base+route)).status(),200);
    await page.evaluate(()=>document.fonts.ready);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');
    const clipped=await page.locator('main h1,main h2,main h3').evaluateAll(els=>els.filter(e=>{
     const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;
     // Font glyphs may exceed their line box while remaining fully visible.
     const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),rects=[];
     while(walker.nextNode()){if(!walker.currentNode.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(walker.currentNode);rects.push(...range.getClientRects());}
     for(const text of rects) {
      if(!text.width||!text.height)continue;
      if(text.left< -2||text.right>innerWidth+2)return true;
      for(let parent=e;parent&&parent!==document.body;parent=parent.parentElement){const s=getComputedStyle(parent),p=parent.getBoundingClientRect();if(['hidden','clip'].includes(s.overflowX)&&(text.left<p.left-2||text.right>p.right+2))return true;if(['hidden','clip'].includes(s.overflowY)&&(text.top<p.top-2||text.bottom>p.bottom+2))return true;}
     }
     return false;
    }).map(e=>e.textContent.trim().slice(0,70)));
    assert.deepEqual(clipped,[],'Clipped heading text');
    const footer=page.locator('.site-footer');assert.equal(await footer.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(114, 47, 55)');
    assert(await footer.locator('.footer-brand').isVisible());
    for(const link of await footer.locator('nav a').all()) assert.equal(await link.evaluate(e=>getComputedStyle(e).color),'rgb(232, 220, 198)');
    if(route==='/') {
     const h=await page.locator('#hero-title').boundingBox(),header=await page.locator('.site-header').boundingBox();
     assert(h.y>=header.y+header.height-1,'Hero title overlaps header');
     assert((await page.locator('#hero-title').textContent()).replace(/\s/g,'').includes('KINDDESIGN'));
     const glyphs=await page.locator('#hero-title').evaluate(e=>{const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),a=[];while(walker.nextNode()){if(!walker.currentNode.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(walker.currentNode);a.push(...[...r.getClientRects()].map(b=>({x:b.x,right:b.right,y:b.y,bottom:b.bottom})));}return a;});
     assert(glyphs.every(r=>r.x>=-1&&r.right<=width+1),'Hero letters outside viewport');
     const toggle=page.locator('.menu-toggle');
     if(await toggle.isVisible()) {
      await toggle.tap();assert.equal(await toggle.getAttribute('aria-expanded'),'true');assert(await page.locator('#mobile-menu a').first().evaluate(e=>e===document.activeElement));
      await page.keyboard.press('Escape');assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert(await toggle.evaluate(e=>e===document.activeElement));
      await toggle.tap();await page.locator('#mobile-menu a').first().tap();await page.waitForURL('**/events/');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
     }
    }
    if(route==='/events/') {
     await page.locator('[data-status-filter="all"]').tap();assert.equal(await page.locator('.event-card:visible').count(),8);
     for(const category of [...new Set(verifiedLumaEvents.map(e=>e.type))]) {await page.locator(`[data-filter="${category}"]`).tap();assert.equal(await page.locator('.event-card:visible').count(),verifiedLumaEvents.filter(e=>e.type===category).length);}
     await page.reload();assert(new URL(page.url()).searchParams.size>0);
    }
    if(route==='/events/kalender/') {
     await page.locator('#calendar-month').selectOption('2026-11');const link=page.locator('[data-calendar-month]:visible .has-event a');assert.equal(await link.count(),1);await link.tap();await page.waitForURL('**/events/from-ballet-to-technology/**');
    }
    if(route==='/kontakt/') {
     assert((await page.locator('.form-notice').innerText()).includes('Beskeden sendes ikke'));
     await page.locator('button[type=submit]').tap();assert(await page.locator('.form-error-summary').isVisible());
     await page.locator('#name').fill('Mobil QA');await page.locator('#email').fill('forkert');await page.locator('#message').fill('Kun en lokal demo');await page.locator('button[type=submit]').tap();assert.equal(await page.locator('#email').getAttribute('aria-invalid'),'true');
     await page.locator('#email').fill('qa@example.com');await page.locator('button[type=submit]').tap();assert(await page.locator('.contact-confirmation').isVisible());await page.locator('[data-contact-reset]').tap();assert.equal(await page.locator('#name').inputValue(),'');
    }
    cases++;
   });
   await check('keyboard/footer',async()=>{await page.goto(base+'/');await page.locator('.footer-brand').focus();await page.keyboard.press(engine==='webkit'?'Alt+Tab':'Tab');const a=page.locator('.site-footer nav a').first();assert(await a.evaluate(e=>e===document.activeElement));assert.equal(await a.evaluate(e=>getComputedStyle(e).outlineStyle),'solid');});
   await check('carousel/touch/reduced-motion',async()=>{
    await page.goto(base+'/');const gallery=page.locator('[data-carousel]'),window=page.locator('.gallery-window'),toggle=page.locator('[data-carousel-toggle]');await window.scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('[data-carousel]').dataset.photosReady==='true');
    const samples=await page.evaluate(async duration=>{const a=[],g=document.querySelector('[data-carousel]'),start=performance.now();while(performance.now()-start<duration){a.push(Number(g.dataset.phase));await new Promise(r=>setTimeout(r,100));}return a;},width===390&&!landscape?15500:1500);
    assert(samples.slice(1).every((n,i)=>(n-samples[i]+6)%6>0&&(n-samples[i]+6)%6<.04),'Carousel stalled or jumped');
    await toggle.tap();assert.equal(await gallery.getAttribute('data-user-paused'),'true');const paused=await gallery.getAttribute('data-phase');await page.waitForTimeout(250);assert.equal(await gallery.getAttribute('data-phase'),paused);
    await toggle.focus();await toggle.press('Enter');await page.waitForTimeout(250);assert.notEqual(await gallery.getAttribute('data-phase'),paused,'Play blocked by focus');await toggle.press('Enter');
    const before=await gallery.getAttribute('data-phase');await page.locator('[data-carousel-next]').tap();await page.waitForTimeout(700);assert.notEqual(await gallery.getAttribute('data-phase'),before);
    // Chromium provides trusted native touch events through CDP. WebKit does not expose a swipe API.
    await window.scrollIntoViewIfNeeded();
    const box=await window.boundingBox(),beforeSwipe=await gallery.getAttribute('data-phase'),y=(Math.max(4,box.y)+Math.min(height-4,box.y+box.height))/2;
    if(engine==='chromium') {const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width*.7,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width*.3,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
    else {await page.mouse.move(box.x+box.width*.7,y);await page.mouse.down();await page.mouse.move(box.x+box.width*.3,y,{steps:8});await page.mouse.up();}
    await page.waitForTimeout(700);assert.notEqual(await gallery.getAttribute('data-phase'),beforeSwipe,'Swipe/drag did not move');
    if(width===390&&!landscape) {
     for(let i=0;i<6&&Number(await gallery.getAttribute('data-phase'))!==5;i++){await page.locator('[data-carousel-next]').tap();await page.waitForTimeout(700);}
     assert.equal(Number(await gallery.getAttribute('data-phase')),5);await toggle.tap();
     const seam=await page.evaluate(async()=>{const g=document.querySelector('[data-carousel]'),a=[],start=performance.now();while(performance.now()-start<14000){a.push({phase:Number(g.dataset.phase),cards:[...g.querySelectorAll('.gallery-card')].map(c=>({x:c.getBoundingClientRect().x,opacity:Number(getComputedStyle(c).opacity)}))});await new Promise(r=>setTimeout(r,100));}return a;});
     assert(seam.some((s,i)=>i&&s.phase<seam[i-1].phase),'Last/first seam was not crossed');
     seam.slice(1).forEach((s,i)=>s.cards.forEach((c,j)=>{const old=seam[i].cards[j];if(Math.abs(c.x-old.x)>25)assert(c.opacity<.15&&old.opacity<.15,'Visible card jumped at seam');}));
    }
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('[data-carousel]').dataset.reducedMotion==='true');assert(await toggle.isDisabled(),'Reduced motion must disable autoplay');const reduced=await gallery.getAttribute('data-phase');await page.waitForTimeout(300);assert.equal(await gallery.getAttribute('data-phase'),reduced);
   });
   await check('console/form transport',async()=>{assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);});
   await context.close();console.log(engine,width+'x'+height,'checked');
  }
  const request=await browser.newContext();for(const event of verifiedLumaEvents){const r=await request.request.get(base+'/events/'+event.slug+'/');assert.equal(r.status(),200);assert((await r.text()).includes(event.lumaUrl));const link=await request.request.get(event.lumaUrl);assert.equal(link.status(),200);}await request.close();
  console.log(JSON.stringify({engine,cases,failures,nativeSwipe:engine==='chromium',physicalIPhone:false,messenger:false},null,2));
  if(failures.length)process.exitCode=1;
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
