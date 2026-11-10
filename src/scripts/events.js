import { syncEventStatus } from "./event-status.js";
import { eventType, updateEventLinks } from "../lib/event-navigation.js";
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const statusButtons = [...document.querySelectorAll("[data-status-filter]")];
const cards = [...document.querySelectorAll(".event-card")];
const status = document.querySelector("[data-filter-status]");
const empty = document.querySelector("[data-event-empty]");
function applyFilter() {
  syncEventStatus();
  const params = new URL(location.href).searchParams;
  const type = eventType(params.get("type"));
  const date = ["all", "past", "upcoming"].includes(params.get("status"))
    ? params.get("status")
    : "upcoming";
  let count = 0;
  cards.forEach((card) => {
    card.hidden =
      (type !== "Alle" && card.dataset.eventType !== type) ||
      (date !== "all" && card.dataset.eventStatus !== date);
    if (!card.hidden) count++;
  });
  filterButtons.forEach((button) =>
    button.setAttribute("aria-pressed", String(button.dataset.filter === type)),
  );
  statusButtons.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.statusFilter === date),
    ),
  );
  document.querySelector("[data-events-heading]").textContent = {
    upcoming: "Kommende events",
    past: "Tidligere events",
    all: "Alle events",
  }[date];
  empty.hidden = count > 0;
  const noUpcoming =
    date === "upcoming" &&
    !cards.some((card) => card.dataset.eventStatus === "upcoming");
  empty.querySelector("h3").textContent = noUpcoming
    ? "Der er ingen verificerede kommende events."
    : "Ingen events matcher dit filter.";
  document.querySelector("[data-show-past]").hidden = date === "past";
  status.textContent = `${count} ${count === 1 ? "event vises" : "events vises"}.`;
  updateEventLinks(document, location.pathname + location.search);
}
function updateFilter(key, value, defaultValue) {
  const url = new URL(location.href);
  if (value === defaultValue) url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  history.pushState({}, "", url);
  applyFilter();
}
filterButtons.forEach((button) =>
  button.addEventListener("click", () =>
    updateFilter("type", button.dataset.filter, "Alle"),
  ),
);
statusButtons.forEach((button) =>
  button.addEventListener("click", () =>
    updateFilter("status", button.dataset.statusFilter, "upcoming"),
  ),
);
document.querySelector("[data-reset-filters]").addEventListener("click", () => {
  const url = new URL(location.href);
  url.searchParams.delete("type");
  url.searchParams.set("status", "all");
  history.pushState({}, "", url);
  applyFilter();
  filterButtons[0].focus();
});
document
  .querySelector("[data-show-past]")
  .addEventListener("click", () => updateFilter("status", "past", "upcoming"));
window.addEventListener("popstate", applyFilter);
window.addEventListener("kinddesign:event-status", applyFilter);
applyFilter();
