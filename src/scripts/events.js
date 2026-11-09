const filterButtons = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-event-type]");
const status = document.querySelector("[data-filter-status]");
function applyFilter(type) {
  const validType = ["Alle", "Meetup", "Workshop", "Talk"].includes(type)
    ? type
    : "Alle";
  let count = 0;
  cards.forEach((card) => {
    card.hidden = validType !== "Alle" && card.dataset.eventType !== validType;
    if (!card.hidden) count += 1;
  });
  filterButtons.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === validType),
    ),
  );
  status.textContent = `${count} ${count === 1 ? "event vises" : "events vises"}.`;
}
filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    const type = button.dataset.filter;
    const url = new URL(location.href);
    if (type === "Alle") url.searchParams.delete("type");
    else url.searchParams.set("type", type);
    history.pushState({}, "", url);
    applyFilter(type);
  }),
);
window.addEventListener("popstate", () =>
  applyFilter(new URL(location.href).searchParams.get("type")),
);
applyFilter(new URL(location.href).searchParams.get("type"));
