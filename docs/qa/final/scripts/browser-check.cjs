const { chromium } = require('/tmp/kinddesign-tools/node_modules/playwright');
const AxeBuilder = require('/tmp/kinddesign-tools/node_modules/@axe-core/playwright').default;
const fs = require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const report=[];
 for(const width of [390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4321/',{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  await page.screenshot({path:`docs/qa/site-${width}.png`,fullPage:true});
  if(width===390)await page.screenshot({path:'docs/qa/site-390-viewport.png'});
  const geometry=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,sections:[...document.querySelectorAll('header,.hero,.gallery-section,.community-section,footer')].map(n=>({name:n.className,top:n.getBoundingClientRect().top,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})),images:[...document.images].map(i=>({source:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height})),fonts:[...document.fonts].map(f=>({family:f.family,status:f.status}))}));
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  await page.locator('.hero-cta').click();
  const dialogOpened=await page.locator('dialog').evaluate(d=>d.open);
  await page.keyboard.press('Escape');
  const focusReturned=await page.locator('.hero-cta').evaluate(n=>document.activeElement===n);
  await page.locator('.gallery-window').focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(250);
  const galleryScroll=await page.locator('.gallery-window').evaluate(n=>n.scrollLeft);
  report.push({width,errors,geometry,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>n.target)})),dialogOpened,focusReturned,galleryScroll});
  await context.close();
 }
 await fs.writeFile('docs/qa/browser-results.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
