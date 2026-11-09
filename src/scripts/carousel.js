const carousel = document.querySelector("[data-carousel]");
if (carousel) {
  const cards = [...carousel.querySelectorAll(".gallery-card")];
  const viewport = carousel.querySelector(".gallery-window");
  const pauseButton = carousel.querySelector("[data-carousel-pause]");
  const indicators = [...carousel.querySelectorAll("[data-carousel-slide]")];
  const status = carousel.querySelector("[data-carousel-status]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const interval = 4500;
  const interactionDelay = 8000;
  let activeIndex = 0;
  let timer;
  let visible = false;
  let hovered = false;
  let focused = false;
  let userPaused = false;
  let resumeAt = 0;
  let pointer = null;
  let suppressClickUntil = 0;

  function render(announce = false) {
    cards.forEach((card, index) => {
      // Den nærmeste cirkulære afstand holder begge sider sammen gennem sidste/første.
      const slot =
        ((index - activeIndex + cards.length + 3) % cards.length) - 3;
      const wrapping = Math.abs(Number(card.dataset.slot ?? slot) - slot) > 1;
      card.classList.toggle("is-wrapping", wrapping);
      card.dataset.slot = slot;
      card.classList.toggle("is-active", slot === 0);
      card.setAttribute("aria-hidden", String(slot !== 0));
      if (wrapping)
        requestAnimationFrame(() =>
          requestAnimationFrame(() => card.classList.remove("is-wrapping")),
        );
    });
    indicators.forEach((button, index) =>
      button.setAttribute("aria-pressed", String(index === activeIndex)),
    );
    carousel.dataset.activeIndex = activeIndex;
    if (announce)
      status.textContent = `Billede ${activeIndex + 1} af ${cards.length}.`;
  }
  function schedule() {
    clearTimeout(timer);
    pauseButton.disabled = reducedMotion.matches;
    pauseButton.setAttribute(
      "aria-pressed",
      String(userPaused || reducedMotion.matches),
    );
    pauseButton.textContent = reducedMotion.matches
      ? "Automatik slået fra"
      : userPaused
        ? "Afspil billedskift"
        : "Pause billedskift";
    const blocked =
      !visible ||
      document.hidden ||
      reducedMotion.matches ||
      userPaused ||
      hovered ||
      focused ||
      pointer;
    carousel.dataset.autoplay = blocked ? "paused" : "running";
    if (!blocked)
      timer = setTimeout(
        () => move(1, false),
        Math.max(interval, resumeAt - performance.now()),
      );
  }
  function select(index, manual = true) {
    activeIndex = (index + cards.length) % cards.length;
    if (manual) resumeAt = performance.now() + interactionDelay;
    render(manual);
    schedule();
  }
  function move(direction, manual = true) {
    select(activeIndex + direction, manual);
  }
  carousel
    .querySelectorAll("[data-carousel-direction]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        move(Number(button.dataset.carouselDirection)),
      ),
    );
  indicators.forEach((button) =>
    button.addEventListener("click", () =>
      select(Number(button.dataset.carouselSlide)),
    ),
  );
  pauseButton.addEventListener("click", () => {
    userPaused = !userPaused;
    schedule();
  });
  viewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      select(event.key === "Home" ? 0 : cards.length - 1);
    }
  });
  carousel.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      hovered = true;
      schedule();
    }
  });
  carousel.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") {
      hovered = false;
      schedule();
    }
  });
  carousel.addEventListener("focusin", () => {
    focused = true;
    schedule();
  });
  carousel.addEventListener("focusout", (event) => {
    focused = carousel.contains(event.relatedTarget);
    schedule();
  });
  viewport.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    viewport.setPointerCapture(event.pointerId);
    schedule();
  });
  viewport.addEventListener("pointerup", (event) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer = null;
    resumeAt = performance.now() + interactionDelay;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      suppressClickUntil = performance.now() + 400;
      move(dx < 0 ? 1 : -1);
    } else schedule();
  });
  viewport.addEventListener("pointercancel", () => {
    pointer = null;
    resumeAt = performance.now() + interactionDelay;
    schedule();
  });
  viewport.addEventListener("lostpointercapture", () => {
    if (pointer) {
      pointer = null;
      schedule();
    }
  });
  viewport.addEventListener(
    "click",
    (event) => {
      if (performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true,
  );
  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", schedule);
  new IntersectionObserver(
    (entries) => {
      visible =
        entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25;
      carousel.classList.toggle("carousel-visible", visible);
      schedule();
    },
    { threshold: 0.25 },
  ).observe(viewport);
  // Hent først de store fotovarianter, når brugeren nærmer sig selve galleriet.
  const photoObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      const photos = [...carousel.querySelectorAll("img[data-gallery-source]")];
      photos.forEach((photo) => {
        photo.src = photo.dataset.gallerySource;
        photo.srcset = photo.dataset.gallerySrcset;
      });
      Promise.all(photos.map((photo) => photo.decode().catch(() => {}))).then(
        () => {
          carousel.dataset.photosReady = "true";
        },
      );
      photoObserver.disconnect();
    },
    { rootMargin: "150px" },
  );
  photoObserver.observe(viewport);
  carousel.querySelectorAll("button").forEach((button) => {
    button.disabled = false;
  });
  carousel.classList.add("carousel-ready");
  render();
  schedule();
}
