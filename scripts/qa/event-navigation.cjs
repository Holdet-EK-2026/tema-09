const assert = require("node:assert/strict");
(async () => {
  const { eventReturnUrl, eventType } =
    await import("../../src/lib/event-navigation.js");
  for (const input of [
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "javascript:alert(1)",
    "/kontakt/",
    "/events/../kontakt/",
    "/events/%2f%2fexample.com/",
    "/events/kalender/../fake/",
  ])
    assert.equal(eventReturnUrl(input), null, input);
  assert.equal(
    eventReturnUrl(
      "/events/?type=talk&status=upcoming&returnTo=https://example.com#ignore",
    ),
    "/events/?type=Talk&status=upcoming",
  );
  assert.equal(
    eventReturnUrl("/events/kalender/?month=2025-12&other=1"),
    "/events/kalender/?month=2025-12",
  );
  assert.equal(
    eventReturnUrl("/events/kalender/?month=2025-99"),
    "/events/kalender/",
  );
  assert.equal(
    eventReturnUrl("/events/?type=unknown&status=invalid"),
    "/events/",
  );
  assert.equal(eventReturnUrl(null), null);
  assert.equal(eventType("talk"), "Talk");
  console.log(
    "Internal event return URLs: validation and canonicalization passed",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
