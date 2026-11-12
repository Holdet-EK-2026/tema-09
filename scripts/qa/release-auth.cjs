const assert = require("node:assert/strict");
(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.PUBLIC_SUPABASE_URL,
    key = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  assert(url && key, "Supabase environment required");
  const settings = await fetch(url + "/auth/v1/settings", {
    headers: { apikey: key },
    signal: AbortSignal.timeout(10000),
  });
  assert.equal(settings.status, 200);
  const config = await settings.json();
  assert.equal(config.disable_signup, true, "Public signup must stay disabled");
  const client = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await client.from("events").select("id,status");
  assert(!error);
  assert(data.length >= 8);
  assert(data.every((e) => e.status === "published"));
  const denied = await client
    .from("events")
    .insert({
      slug: "qa-release-forbidden",
      title: "QA test",
      description: "Unauthorized test – must not be stored",
      category: "Talk",
      starts_at: "2027-01-01T18:00:00Z",
      ends_at: "2027-01-01T19:00:00Z",
      timezone: "UTC",
      location: "QA",
      city: "QA",
      image_url: "/images/ca544.webp",
      image_alt: "QA test",
      luma_url: "https://luma.com/qa",
      status: "draft",
    });
  assert(denied.error, "Anonymous insert must be rejected");
  assert.equal(denied.error.code, "42501");
  console.log(
    "Auth signup disabled; anonymous read published-only; anonymous write denied: passed",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
