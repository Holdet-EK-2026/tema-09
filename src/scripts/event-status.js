export function syncEventStatus() {
  let changed = false;
  document.querySelectorAll("[data-official-event]").forEach((node) => {
    const end = Date.parse(node.dataset.eventEnd);
    if (
      !Number.isFinite(end) || end > Date.now() ||
      node.dataset.eventStatus === "past"
    )
      return;
    node.dataset.eventStatus = "past";
    changed = true;
    node.querySelectorAll("[data-event-status-label]").forEach((label) => {
      label.textContent = "Tidligere event · Afsluttet";
    });
    node.querySelectorAll("[data-luma-register]").forEach((link) => {
      link.textContent = "Se tidligere event på Luma ↗";
      link.removeAttribute("data-luma-register");
    });
    node.querySelectorAll("[data-calendar-download]").forEach((link) => {
      link.hidden = true;
    });
    node.querySelectorAll("[data-registration-terms]").forEach((terms) => {
      terms.hidden = true;
    });
    const explanation = node.querySelector(".luma-explanation");
    if (explanation)
      explanation.textContent = "Eventet er afsluttet. Tilmelding er lukket.";
  });
  return changed;
}
syncEventStatus();
setInterval(() => {
  if (syncEventStatus())
    window.dispatchEvent(new Event("kinddesign:event-status"));
}, 60000);
