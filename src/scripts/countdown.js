const countdown = document.querySelector("[data-event-countdown]");
if (countdown) {
  function update() {
    const remaining = Date.parse(countdown.dataset.startAt) - Date.now();
    const value = countdown.querySelector("[data-countdown-value]");
    if (remaining <= 0) {
      value.textContent =
        Date.now() >= Date.parse(countdown.dataset.endAt)
          ? "Afsluttet"
          : "Vi mødes nu";
      countdown.querySelector(".countdown-label").textContent = "KINDDESIGN";
      countdown.querySelector(".countdown-units").hidden = true;
      countdown.querySelector(".countdown-link").textContent = "Se event ↗";
      const promo = document.querySelector(".hero-event");
      if (promo?.firstChild)
        promo.firstChild.textContent = promo.firstChild.textContent.replace(
          /NÆSTE EVENT|EVENT I GANG|AFHOLDT EVENT/,
          Date.now() >= Date.parse(countdown.dataset.endAt)
            ? "AFHOLDT EVENT"
            : "EVENT I GANG",
        );
      return;
    }
    const minutes = Math.floor(remaining / 60000);
    value.textContent = [
      Math.floor(minutes / 1440),
      Math.floor(minutes / 60) % 24,
      minutes % 60,
    ]
      .map((number) => String(number).padStart(2, "0"))
      .join(" : ");
  }
  update();
  setInterval(update, 30000);
}
