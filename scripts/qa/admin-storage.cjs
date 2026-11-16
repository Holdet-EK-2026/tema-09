// Browser integration with isolated Auth/Storage/REST mocks, not a real admin session.
const { chromium } = require("/tmp/kinddesign-tools/node_modules/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const AxeBuilder = require("/tmp/kinddesign-tools/node_modules/@axe-core/playwright").default;
const base = process.env.KINDDESIGN_QA_BASE || "http://127.0.0.1:4325";
const project = "https://oyeubpmrlstczpkgnftt.supabase.co";
const uid = "11111111-1111-4111-8111-111111111111";
const encode = value => Buffer.from(JSON.stringify(value)).toString("base64url");
const token = encode({ alg:"HS256",typ:"JWT" })+"."+encode({sub:uid,role:"authenticated",aud:"authenticated",exp:Math.floor(Date.now()/1000)+3600})+".test-signature";
const user = { id:uid,email:"qa@example.test",aud:"authenticated",role:"authenticated",app_metadata:{},user_metadata:{} };
const photo = fs.readFileSync("public/images/ca544.webp");
const seed = {id:"cmapoye1",slug:"from-ballet-to-technology",title:"QA existing event",description:"QA description",category:"Talk",starts_at:"2027-01-01T18:00:00Z",ends_at:"2027-01-01T19:00:00Z",timezone:"UTC",location:"QA",city:"QA",address:"QA",image_url:"/images/luma-cmapoye1-1200.webp",image_alt:"QA original",luma_url:"https://luma.com/cmapoye1",status:"draft",details:{id:"cmapoye1",paragraphs:["Preserve original story"],coverWidth:1200,coverHeight:800}};

async function harness(browser,width,admin=true) {
 const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();
 const state={uploads:[],saves:[],removes:[],unknown:[],errors:[],uploadFailure:false,saveFailure:false,cleanupFailure:false,rows:[structuredClone(seed)]};
 page.on("pageerror",e=>state.errors.push(e.message));
 await page.route(project+"/**",async route=>{
  const req=route.request(),url=new URL(req.url()),path=url.pathname,method=req.method();
  const json=(body,status=200)=>route.fulfill({status,contentType:"application/json",body:JSON.stringify(body)});
  if(path==="/auth/v1/token")return json({access_token:token,refresh_token:"test-refresh-token",token_type:"bearer",expires_in:3600,user});
  if(path==="/auth/v1/user")return json(user);
  if(path==="/auth/v1/logout")return route.fulfill({status:204,body:""});
  if(path==="/rest/v1/event_admins")return json(admin?[{user_id:uid}]:[]);
  if(path==="/rest/v1/events") {
   if(method==="GET")return json(state.rows);
   const fields=req.postDataJSON();state.saves.push(fields);
   if(state.saveFailure)return json({code:"23505",message:"QA duplicate slug"},409);
   if(method==="PATCH")state.rows[0]={...state.rows[0],...fields};
   else state.rows.push({...fields,id:"new-qa-event"});
   return json([{id:method==="PATCH"?seed.id:"new-qa-event"}]);
  }
  if(path.startsWith("/storage/v1/object/event-images/")&&method==="POST") {
   assert.equal(req.headers()["x-upsert"],"false");
   const key=path.slice("/storage/v1/object/event-images/".length);state.uploads.push(key);
   if(state.uploadFailure)return json({statusCode:"403",error:"Unauthorized",message:"QA upload denied"},403);
   return json({Id:crypto.randomUUID(),Key:"event-images/"+key});
  }
  if(path==="/storage/v1/object/event-images"&&method==="DELETE"){state.removes.push(req.postDataJSON().prefixes);if(state.cleanupFailure)return json({statusCode:"403",error:"Unauthorized",message:"QA cleanup denied"},403);return json(req.postDataJSON().prefixes.map(name=>({name})));}
  if(path.startsWith("/storage/v1/object/public/event-images/"))return route.fulfill({status:200,contentType:"image/webp",body:photo});
  state.unknown.push(method+" "+path);return route.abort();
 });
 await page.goto(base+"/admin/");
 await page.locator('#admin-login input[name="email"]').fill(user.email);
 await page.locator('#admin-login input[name="password"]').fill("test-only-password");
 await page.locator('#admin-login button[type="submit"]').click();
 return {context,page,state};
}
async function choose(page,file={name:"kinddesign.webp",mimeType:"image/webp",buffer:photo}) {
 await page.locator("#admin-image-file").setInputFiles(file);
 await page.waitForFunction(()=>!document.querySelector("#admin-image-preview").hidden);
}
(async()=>{
 const browser=await chromium.launch({channel:"chrome"});
 try {
  for(const width of [320,390,768,1440]) {
   const {context,page,state}=await harness(browser,width);
   await page.locator("#admin-events button").filter({hasText:"Redigér"}).first().click();
   const file=page.locator("#admin-image-file"),save=page.locator('#admin-editor button[type="submit"]');
   for(const invalid of [
    {name:"bad.svg",mimeType:"image/svg+xml",buffer:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')},
    {name:"large.webp",mimeType:"image/webp",buffer:Buffer.alloc(5*1024*1024+1)},
    {name:"broken.png",mimeType:"image/png",buffer:Buffer.from("not an image")},
    {name:"spoof.png",mimeType:"image/png",buffer:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')},
   ]) {
    await file.setInputFiles(invalid);await page.waitForFunction(()=>document.querySelector("#admin-image-file").validationMessage&&!document.querySelector("#admin-image-file").validationMessage.includes("kontrolleres"));
    await save.click();assert.equal(state.uploads.length,0);assert.equal(state.saves.length,0);
    await page.locator("#admin-image-clear").click();
   }
   await choose(page);assert.equal(await file.evaluate(e=>e.files.length),1);
   assert.equal(state.uploads.length,0,"Selecting a file must not upload it yet");
   await page.locator("#admin-cancel").click();assert.equal(state.uploads.length,0);
   await page.locator("#admin-events button").filter({hasText:"Redigér"}).first().click();
   await choose(page);state.uploadFailure=true;await save.click();await page.waitForFunction(()=>!document.querySelector('#admin-editor button[type="submit"]').disabled);
   assert.equal(state.saves.length,0,"Failed upload must not save an event");
   state.uploadFailure=false;state.saveFailure=true;await save.click();await page.waitForFunction(()=>!document.querySelector('#admin-editor button[type="submit"]').disabled);
   assert.equal(state.removes.length,1,"Failed event save must clean up its new upload");
   state.cleanupFailure=true;await save.click();await page.waitForFunction(()=>!document.querySelector('#admin-editor button[type="submit"]').disabled);
   assert((await page.locator('#admin-image-status').innerText()).includes('kunne ikke ryddes op'));
   assert(await file.isDisabled(),"A pending failed cleanup must not be replaced by a different file");
   const uploadsBeforeRetry=state.uploads.length;state.cleanupFailure=false;
   state.saveFailure=false;await save.click();await page.locator("#admin-editor").waitFor({state:"hidden"});
   assert.equal(state.uploads.length,uploadsBeforeRetry,"Retry must reuse an upload when cleanup failed");
   const updated=state.saves.at(-1);assert(updated.image_url.startsWith(project+"/storage/v1/object/public/event-images/events/"));
   assert.equal(updated.details.coverWidth,1000);assert(updated.details.coverHeight>0);
   assert.deepEqual(updated.details.paragraphs,seed.details.paragraphs);
   assert.equal(state.removes.length,2,"Committed/replaced originals must not be deleted");
   await page.locator("#admin-new").click();
   for(const [name,value] of Object.entries({slug:"qa-new-event",title:"QA new event",description:"QA new description",starts_at:"2027-01-02T18:00",ends_at:"2027-01-02T19:00",timezone:"UTC",location:"QA",city:"QA",image_alt:"QA authentic KindDesign photo",luma_url:"https://luma.com/qa"})) await page.locator(`#admin-editor [name="${name}"]`).fill(value);
   await choose(page);await save.click();await page.locator("#admin-editor").waitFor({state:"hidden"});
   assert.equal(state.saves.at(-1).slug,"qa-new-event");assert(state.saves.at(-1).image_url.includes("/event-images/events/"));
   await page.locator("#admin-events button").filter({hasText:"Redigér"}).first().click();
   const unchangedUploads=state.uploads.length;await page.locator('#admin-editor [name="title"]').fill('QA text-only update');await save.click();await page.locator('#admin-editor').waitFor({state:'hidden'});assert.equal(state.uploads.length,unchangedUploads);
   await page.locator("#admin-events button").filter({hasText:"Redigér"}).first().click();
   const accessibility=await new AxeBuilder({page}).include('#admin-editor').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(accessibility.violations.map(v=>v.id),[]);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.deepEqual(state.errors,[]);assert.deepEqual(state.unknown,[]);
   console.log(width,"mocked admin: validation, preview, edit/create upload, rollback cleanup and metadata passed");await context.close();
  }
  const {context,page,state}=await harness(browser,390,false);
  await page.waitForFunction(()=>document.querySelector('#admin-status').textContent.includes('Kontoen er ikke godkendt'));
  await page.locator("#admin-login").waitFor({state:"visible"});assert(!(await page.locator("#admin-workspace").isVisible()));
  assert.equal(state.uploads.length,0);assert.equal(state.saves.length,0);assert.deepEqual(state.errors,[]);assert.deepEqual(state.unknown,[]);await context.close();
  console.log("Mocked non-admin login: workspace and upload controls denied");
 } finally {await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
