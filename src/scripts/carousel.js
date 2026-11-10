const instances = new Map();

function initCarousel(carousel) {
  if (instances.has(carousel)) return;
  const cards = [...carousel.querySelectorAll(".gallery-card")];
  const viewport = carousel.querySelector(".gallery-window");
  const status = carousel.querySelector("[data-carousel-status]");
  const controls = carousel.querySelector(".carousel-tools");
  const toggle = carousel.querySelector("[data-carousel-toggle]");
  const toggleLabel = carousel.querySelector("[data-carousel-toggle-label]");
  const position = carousel.querySelector("[data-carousel-position]");
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const frames = new Set();
  let disposed = false;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const interval = 4500;
  const interactionDelay = 8000;
  let activeIndex = Number(carousel.dataset.activeIndex) || 0;
  let timer;
  let visible = false;
  let hovered =
    matchMedia("(hover: hover)").matches && viewport.matches(":hover");
  let focused = carousel.contains(document.activeElement);
  let userPaused = carousel.dataset.userPaused === "true";
  let resumeAt = 0;
  let pointer = null;
  let suppressClickUntil = 0;

  function frame(callback) {
    const id = requestAnimationFrame(() => {
      frames.delete(id);
      if (!disposed) callback();
    });
    frames.add(id);
  }
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
        frame(() => frame(() => card.classList.remove("is-wrapping")));
    });
    carousel.dataset.activeIndex = activeIndex;
    position.textContent = `${activeIndex + 1} / ${cards.length}`;
    if (announce)
      status.textContent = `Billede ${activeIndex + 1} af ${cards.length}.`;
  }
  function schedule() {
    clearTimeout(timer);
    if (disposed) return;
    carousel.dataset.userPaused = String(userPaused);
    carousel.dataset.reducedMotion = String(reducedMotion.matches);
    toggle.disabled = reducedMotion.matches;
    toggle.setAttribute(
      "aria-label",
      reducedMotion.matches
        ? "Automatik fra via systemets indstillinger"
        : userPaused
          ? "Afspil automatiske billedskift"
          : "Sæt automatiske billedskift på pause",
    );
    toggleLabel.textContent = reducedMotion.matches
      ? "Automatik fra"
      : userPaused
        ? "Afspil"
        : "Pause";
    const reason = !visible
      ? "offscreen"
      : document.hidden
        ? "hidden-tab"
        : reducedMotion.matches
          ? "reduced-motion"
          : userPaused
            ? "user"
            : hovered
              ? "hover"
              : focused
                ? "focus"
                : pointer
                  ? "pointer"
                  : "none";
    const blocked = reason !== "none";
    carousel.dataset.pauseReason = reason;
    carousel.dataset.autoplay = blocked ? "paused" : "running";
    if (!blocked)
      timer = setTimeout(
        () => {
          if (!carousel.isConnected) return destroy();
          move(1, false);
        },
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
  function toggleAutoplay() {
    if (reducedMotion.matches) {
      status.textContent =
        "Automatiske billedskift er slået fra via systemets indstillinger.";
      return;
    }
    userPaused = !userPaused;
    status.textContent = userPaused
      ? "Automatiske billedskift er sat på pause."
      : "Automatiske billedskift genoptages, når du forlader galleriet.";
    schedule();
  }
  carousel
    .querySelector("[data-carousel-previous]")
    .addEventListener("click", () => move(-1), options);
  carousel
    .querySelector("[data-carousel-next]")
    .addEventListener("click", () => move(1), options);
  toggle.addEventListener("click", toggleAutoplay, options);
  viewport.addEventListener(
    "keydown",
    (event) => {
      // Native knapper håndterer selv Enter/Space. Galleriets genveje gælder selve regionen.
      if (event.target !== viewport) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        select(event.key === "Home" ? 0 : cards.length - 1);
      } else if (event.key === " ") {
        event.preventDefault();
        toggleAutoplay();
      }
    },
    options,
  );
  viewport.addEventListener(
    "pointerenter",
    (event) => {
      if (event.pointerType === "mouse") {
        hovered = true;
        schedule();
      }
    },
    options,
  );
  viewport.addEventListener(
    "pointerleave",
    (event) => {
      if (event.pointerType === "mouse") {
        hovered = false;
        schedule();
      }
    },
    options,
  );
  carousel.addEventListener(
    "focusin",
    () => {
      focused = true;
      schedule();
    },
    options,
  );
  carousel.addEventListener(
    "focusout",
    (event) => {
      focused = carousel.contains(event.relatedTarget);
      schedule();
    },
    options,
  );
  viewport.addEventListener(
    "pointerdown",
    (event) => {
      if (event.target.closest("button")) return;
      if (!event.isPrimary || event.button !== 0) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
      viewport.setPointerCapture(event.pointerId);
      schedule();
    },
    options,
  );
  viewport.addEventListener(
    "pointerup",
    (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      pointer = null;
      resumeAt = performance.now() + interactionDelay;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        suppressClickUntil = performance.now() + 400;
        move(dx < 0 ? 1 : -1);
      } else schedule();
    },
    options,
  );
  viewport.addEventListener(
    "pointercancel",
    () => {
      pointer = null;
      resumeAt = performance.now() + interactionDelay;
      schedule();
    },
    options,
  );
  viewport.addEventListener(
    "lostpointercapture",
    () => {
      if (pointer) {
        pointer = null;
        schedule();
      }
    },
    options,
  );
  viewport.addEventListener(
    "click",
    (event) => {
      if (performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    { ...options, capture: true },
  );
  document.addEventListener("visibilitychange", schedule, options);
  reducedMotion.addEventListener("change", schedule, options);
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      visible =
        entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25;
      carousel.classList.toggle("carousel-visible", visible);
      schedule();
    },
    { threshold: 0.25 },
  );
  visibilityObserver.observe(viewport);
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
          if (!disposed) carousel.dataset.photosReady = "true";
        },
      );
      photoObserver.disconnect();
    },
    { rootMargin: "150px" },
  );
  photoObserver.observe(viewport);
  const removalObserver = new MutationObserver(() => {
    if (!carousel.isConnected) destroy();
  });
  // Fanger også en fjernet wrapper, selv når ingen Astro-navigation finder sted.
  removalObserver.observe(document.body, { childList: true, subtree: true });
  function destroy() {
    disposed = true;
    clearTimeout(timer);
    frames.forEach(cancelAnimationFrame);
    frames.clear();
    controller.abort();
    visibilityObserver.disconnect();
    photoObserver.disconnect();
    removalObserver.disconnect();
    instances.delete(carousel);
    carousel.dataset.autoplay = "stopped";
  }
  instances.set(carousel, destroy);
  controls.hidden = false;
  carousel.classList.add("carousel-ready");
  render();
  schedule();
}

function initialize() {
  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
}
function cleanup() {
  [...instances.values()].forEach((destroy) => destroy());
}
initialize();
document.addEventListener("astro:page-load", initialize);
document.addEventListener("astro:before-swap", cleanup);
window.addEventListener("pagehide", cleanup);
window.addEventListener("pageshow", initialize);
