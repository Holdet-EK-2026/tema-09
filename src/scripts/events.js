import { syncEventStatus } from "./event-status.js";
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const statusButtons = [...document.querySelectorAll("[data-status-filter]")];
const cards = [...document.querySelectorAll(".event-card")];
const status = document.querySelector("[data-filter-status]");
function applyFilter() {
  syncEventStatus();
  const params = new URL(location.href).searchParams;
  const type = ["Meetup", "Workshop", "Talk"].includes(params.get("type"))
    ? params.get("type")
    : "Alle";
  const date = ["past", "upcoming"].includes(params.get("status"))
    ? params.get("status")
    : "all";
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
  document.querySelector("[data-event-empty]").hidden = count > 0;
  status.textContent = `${count} ${count === 1 ? "event vises" : "events vises"}.`;
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
    updateFilter("status", button.dataset.statusFilter, "all"),
  ),
);
document.querySelector("[data-reset-filters]").addEventListener("click", () => {
  const url = new URL(location.href);
  url.searchParams.delete("type");
  url.searchParams.delete("status");
  history.pushState({}, "", url);
  applyFilter();
  filterButtons[0].focus();
});
window.addEventListener("popstate", applyFilter);
window.addEventListener("kinddesign:event-status", applyFilter);
applyFilter();
