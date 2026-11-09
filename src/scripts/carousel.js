const carousel = document.querySelector("[data-carousel]");
if (carousel) {
  const desktopCards = Array.from(
    carousel.querySelectorAll(".desktop-gallery img"),
  );
  const mobileTrack = carousel.querySelector(".mobile-gallery");
  const mobileCards = Array.from(mobileTrack.children);
  const windowElement = carousel.querySelector(".gallery-window");
  const pauseButton = carousel.querySelector("[data-carousel-pause]");
  const status = carousel.querySelector("[data-carousel-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 600px)");
  let activeIndex = 0;
  let timer;
  let paused = reducedMotion.matches;
  let interacting = false;
  let visible = false;
  let pointerStart = 0;
  let resetTimer;
  const slots = [
    [-185, 76, 320, 555],
    [175, 12, 315, 650],
    [530, 48, 390, 610],
    [960, 110, 295, 520],
    [1295, 12, 315, 580],
    [1650, 65, 330, 590],
  ];
  // En kopi af det første kort gør mobilens sidste overgang sammenhængende.
  const copy = mobileCards[0].cloneNode(true);
  copy.alt = "";
  copy.setAttribute("aria-hidden", "true");
  mobileTrack.append(copy);

  function render(announce = false) {
    desktopCards.forEach((card, index) => {
      const slotIndex =
        (index - activeIndex + desktopCards.length) % desktopCards.length;
      const [x, y, width, height] = slots[slotIndex];
      const wrapping =
        Math.abs(Number(card.dataset.slot ?? slotIndex) - slotIndex) > 1;
      card.classList.toggle("is-wrapping", wrapping);
      card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      card.style.width = `${width}px`;
      card.style.height = `${height}px`;
      card.dataset.slot = slotIndex;
      if (wrapping)
        requestAnimationFrame(() =>
          requestAnimationFrame(() => card.classList.remove("is-wrapping")),
        );
    });
    if (mobile.matches) {
      const target = activeIndex % mobileCards.length;
      const from = Math.round(windowElement.scrollLeft / 274);
      const loopForward = from === mobileCards.length - 1 && target === 0;
      windowElement.scrollTo({
        left: (loopForward ? mobileCards.length : target) * 274,
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
      clearTimeout(resetTimer);
      if (loopForward)
        resetTimer = setTimeout(
          () => windowElement.scrollTo({ left: 0, behavior: "instant" }),
          700,
        );
    }
    if (announce)
      status.textContent = `Billede ${(activeIndex % (mobile.matches ? mobileCards.length : desktopCards.length)) + 1} vises.`;
  }
  function move(direction, announce = true) {
    const count = mobile.matches ? mobileCards.length : desktopCards.length;
    activeIndex = (activeIndex + direction + count) % count;
    render(announce);
  }
  function updateTimer() {
    clearInterval(timer);
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.textContent = paused
      ? "Afspil billedskift"
      : "Pause billedskift";
    if (
      !paused &&
      !interacting &&
      visible &&
      !document.hidden &&
      !reducedMotion.matches
    )
      timer = setInterval(() => move(1, false), 6000);
  }
  carousel.querySelectorAll("[data-carousel-direction]").forEach((button) =>
    button.addEventListener("click", () => {
      move(Number(button.dataset.carouselDirection));
      updateTimer();
    }),
  );
  pauseButton.addEventListener("click", () => {
    paused = !paused;
    updateTimer();
  });
  carousel.addEventListener("mouseenter", () => {
    interacting = true;
    updateTimer();
  });
  carousel.addEventListener("mouseleave", () => {
    interacting = carousel.contains(document.activeElement);
    updateTimer();
  });
  carousel.addEventListener("focusin", () => {
    interacting = true;
    updateTimer();
  });
  carousel.addEventListener("focusout", (event) => {
    interacting = carousel.contains(event.relatedTarget);
    updateTimer();
  });
  windowElement.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    }
  });
  windowElement.addEventListener("pointerdown", (event) => {
    pointerStart = event.clientX;
    interacting = true;
    updateTimer();
  });
  windowElement.addEventListener("pointerup", (event) => {
    const distance = event.clientX - pointerStart;
    if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
    interacting = carousel.contains(document.activeElement);
    updateTimer();
  });
  windowElement.addEventListener("pointercancel", () => {
    interacting = false;
    updateTimer();
  });
  document.addEventListener("visibilitychange", updateTimer);
  reducedMotion.addEventListener("change", () => {
    paused = reducedMotion.matches;
    updateTimer();
  });
  mobile.addEventListener("change", () => {
    activeIndex = 0;
    render();
    updateTimer();
  });
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      updateTimer();
    },
    { threshold: 0.15 },
  ).observe(carousel);
  carousel.classList.add('carousel-ready');
  carousel.querySelectorAll('button').forEach(button => {button.disabled = false;});
  render();
  updateTimer();
}
