import { updateEventLinks } from "../lib/event-navigation.js";
const select = document.querySelector("#calendar-month");
const months = [...document.querySelectorAll("[data-calendar-month]")];
function showMonth(value) {
  const valid = months.some((month) => month.dataset.calendarMonth === value)
    ? value
    : select.value;
  select.value = valid;
  updateEventLinks(document, `/events/kalender/?month=${valid}`);
  months.forEach((month) => {
    month.hidden = month.dataset.calendarMonth !== valid;
  });
}
select.disabled = false;
showMonth(new URL(location.href).searchParams.get("month"));
select.addEventListener("change", () => {
  showMonth(select.value);
  const url = new URL(location.href);
  url.searchParams.set("month", select.value);
  history.pushState({}, "", url);
});
window.addEventListener("popstate", () =>
  showMonth(
    new URL(location.href).searchParams.get("month") ||
      select.querySelector("[selected]").value,
  ),
);
