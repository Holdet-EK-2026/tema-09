import { eventReturnUrl } from "../lib/event-navigation.js";
const context = eventReturnUrl(
  new URL(location.href).searchParams.get("returnTo"),
);
const back = document.querySelector(".official-detail .back-link");
if (context && back) {
  back.href = context;
  back.textContent = context.startsWith("/events/kalender/")
    ? "← TILBAGE TIL KALENDER"
    : "← TILBAGE TIL EVENTS";
}
