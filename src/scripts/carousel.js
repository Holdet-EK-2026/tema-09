const instances = new Map();
function initCarousel(carousel) {
  if (instances.has(carousel)) return;
  const cards = [...carousel.querySelectorAll(".gallery-card")];
  const viewport = carousel.querySelector(".gallery-window");
  const toggle = carousel.querySelector("[data-carousel-toggle]");
  const label = carousel.querySelector("[data-carousel-toggle-label]");
  const position = carousel.querySelector("[data-carousel-position]");
  const status = carousel.querySelector("[data-carousel-status]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const motionReason =
    toggle.querySelector(".carousel-motion-reason") ||
    document.createElement("small");
  motionReason.className = "carousel-motion-reason";
  motionReason.textContent = "Reduceret bevægelse";
  toggle.append(motionReason);
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let phase = 0,
    frame = 0,
    last = null,
    visible = false,
    hovered = false;
  let focused = false,
    explicitPlay = false,
    userPaused = false,
    pointer = null,
    target = null;
  let disposed = false;
  const mod = (n, m) => ((n % m) + m) % m;
  function render() {
    const width = viewport.clientWidth;
    const step = width <= 600 ? 195 : Math.max(240, Math.min(300, width / 5.5));
    const active = mod(Math.round(phase), cards.length);
    cards.forEach((card, index) => {
      const slot =
        mod(index - phase + cards.length / 2, cards.length) - cards.length / 2;
      const distance = Math.abs(slot);
      const focus = Math.exp(-0.6 * slot * slot);
      card.style.setProperty("--x", `${slot * step}px`);
      card.style.setProperty("--z", `${-220 + 280 * focus}px`);
      card.style.setProperty("--angle", `${-28 * Math.tanh(slot / 1.5)}deg`);
      card.style.setProperty("--scale", String(0.6 + 0.4 * focus));
      card.style.opacity = String(Math.max(0, Math.min(1, (3 - distance) * 2)));
      card.style.zIndex = String(Math.round(focus * 100));
      card.classList.toggle("is-active", index === active);
      card.setAttribute("aria-hidden", String(index !== active));
    });
    carousel.dataset.phase = String(phase);
    carousel.dataset.activeIndex = String(active);
    position.textContent = `${active + 1} / ${cards.length}`;
  }
  function reason() {
    return !visible
      ? "offscreen"
      : document.hidden
        ? "hidden-tab"
        : reduced.matches
          ? "reduced-motion"
          : userPaused
            ? "user"
            : pointer
              ? "pointer"
              : !explicitPlay && focused
                ? "focus"
                : !explicitPlay && hovered
                  ? "hover"
                  : "none";
  }
  function tick(now) {
    frame = 0;
    // Synchronize controls before another frame if a browser updates the query
    // before delivering its change event. Never animate against that preference.
    if (carousel.dataset.reducedMotion !== String(reduced.matches)) {
      target = null;
      schedule();
      return;
    }
    const dt = last === null ? 0 : Math.min(now - last, 50);
    last = now;
    if (target !== null) {
      const delta = target - phase;
      phase += Math.sign(delta) * Math.min(Math.abs(delta), dt / 350);
      if (Math.abs(target - phase) < 0.0001) {
        phase = target;
        target = null;
      }
    } else if (reason() === "none") phase += dt / 12000;
    if (target === null) phase = mod(phase, cards.length);
    render();
    if (visible && !document.hidden && (target !== null || reason() === "none"))
      frame = requestAnimationFrame(tick);
    else last = null;
  }
  function schedule() {
    if (disposed) return;
    const why = reason();
    carousel.dataset.pauseReason = why;
    carousel.dataset.autoplay = why === "none" ? "running" : "paused";
    carousel.dataset.userPaused = String(userPaused);
    carousel.dataset.reducedMotion = String(reduced.matches);
    const offersPlay = userPaused || (!explicitPlay && (focused || hovered));
    toggle.disabled = reduced.matches;
    motionReason.hidden = !reduced.matches;
    toggle.title = reduced.matches
      ? "Din browser melder reduceret bevægelse. Brug pilene eller swipe for at skifte billede."
      : "";
    label.textContent = reduced.matches
      ? "Automatik fra"
      : offersPlay
        ? "Afspil"
        : "Pause";
    toggle.setAttribute(
      "aria-label",
      reduced.matches
        ? "Automatik fra: Din browser melder reduceret bevægelse. Brug pilene eller swipe."
        : offersPlay
          ? "Afspil kontinuerlig bevægelse"
          : "Sæt kontinuerlig bevægelse på pause",
    );
    if (
      why === "offscreen" ||
      why === "hidden-tab" ||
      (why !== "none" && target === null)
    ) {
      cancelAnimationFrame(frame);
      frame = 0;
      last = null;
    } else if (!frame) {
      last = null;
      frame = requestAnimationFrame(tick);
    }
  }
  function manual(direction) {
    userPaused = true;
    explicitPlay = false;
    target =
      direction > 0
        ? Math.floor(phase + 0.001) + 1
        : Math.ceil(phase - 0.001) - 1;
    // Keep the target in the same unwrapped coordinate system during manual motion.
    if (target < 0) {
      phase += cards.length;
      target += cards.length;
    }
    if (reduced.matches) {
      phase = mod(target, cards.length);
      target = null;
      render();
    }
    status.textContent = `Billede ${mod(Math.round(target ?? phase), cards.length) + 1} af ${cards.length}.`;
    schedule();
  }
  let requestedPlay = null;
  let handledTouchAt = -Infinity;
  function changePlayback(start) {
    requestedPlay = null;
    userPaused = !start;
    explicitPlay = start;
    target = null;
    schedule();
  }
  toggle.addEventListener(
    "pointercancel",
    () => {
      requestedPlay = null;
    },
    options,
  );
  toggle.addEventListener(
    "pointerdown",
    () => {
      requestedPlay = userPaused || (!explicitPlay && (focused || hovered));
    },
    options,
  );
  toggle.addEventListener(
    "pointerup",
    (e) => {
      if (e.pointerType !== "touch") return;
      // iOS can suppress the synthesized click when focus changes the label.
      // Apply the captured touch intent once, without waiting for that click.
      handledTouchAt = e.timeStamp;
      changePlayback(
        requestedPlay ?? (userPaused || (!explicitPlay && (focused || hovered))),
      );
      e.preventDefault();
    },
    options,
  );
  toggle.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Enter" || e.code === "Space") requestedPlay = null;
    },
    options,
  );
  toggle.addEventListener(
    "click",
    (e) => {
      // Ignore only a duplicate compatibility click, never keyboard activation.
      if (e.detail > 0 && e.timeStamp - handledTouchAt < 500) return;
      const start =
        requestedPlay ??
        (userPaused || (!explicitPlay && (focused || hovered)));
      changePlayback(start);
    },
    options,
  );
  carousel
    .querySelector("[data-carousel-previous]")
    .addEventListener("click", () => manual(-1), options);
  carousel
    .querySelector("[data-carousel-next]")
    .addEventListener("click", () => manual(1), options);
  viewport.addEventListener(
    "keydown",
    (e) => {
      if (e.target.closest("button")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        manual(e.key === "ArrowRight" ? 1 : -1);
      }
      if (e.code === "Space") {
        e.preventDefault();
        userPaused = !userPaused;
        explicitPlay = !userPaused;
        schedule();
      }
    },
    options,
  );
  viewport.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "mouse" && !e.target.closest(".carousel-tools")) {
        hovered = true;
        schedule();
      }
    },
    options,
  );
  viewport.addEventListener(
    "pointerleave",
    () => {
      hovered = false;
      schedule();
    },
    options,
  );
  carousel.addEventListener(
    "focusin",
    (e) => {
      if (!carousel.contains(e.relatedTarget)) explicitPlay = false;
      focused = true;
      schedule();
    },
    options,
  );
  carousel.addEventListener(
    "focusout",
    (e) => {
      focused = carousel.contains(e.relatedTarget);
      if (!focused) explicitPlay = false;
      schedule();
    },
    options,
  );
  viewport.addEventListener(
    "pointerdown",
    (e) => {
      if (e.target.closest("button") || e.button > 0) return;
      pointer = { id: e.pointerId, x: e.clientX, y: e.clientY };
      viewport.setPointerCapture(e.pointerId);
      schedule();
    },
    options,
  );
  function release(e) {
    if (!pointer || pointer.id !== e.pointerId) return;
    const dx = e.clientX - pointer.x,
      dy = e.clientY - pointer.y;
    pointer = null;
    if (
      e.type === "pointerup" &&
      Math.abs(dx) > 45 &&
      Math.abs(dx) > Math.abs(dy)
    )
      manual(dx < 0 ? 1 : -1);
    else schedule();
  }
  viewport.addEventListener("pointerup", release, options);
  viewport.addEventListener("pointercancel", release, options);
  viewport.addEventListener(
    "lostpointercapture",
    () => {
      pointer = null;
      schedule();
    },
    options,
  );
  document.addEventListener("visibilitychange", schedule, options);
  function motionChange() {
    target = null;
    render();
    schedule();
  }
  // Keep this MediaQueryList subscription explicit across embedded browser lifecycles.
  reduced.addEventListener("change", motionChange);
  window.addEventListener("resize", render, options);
  const visibility = new IntersectionObserver(
    (entries) => {
      visible =
        entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25;
      carousel.classList.toggle("carousel-visible", visible);
      schedule();
    },
    { threshold: 0.25 },
  );
  visibility.observe(viewport);
  const photos = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      const images = [...carousel.querySelectorAll("img[data-gallery-source]")];
      images.forEach((img) => {
        img.src = img.dataset.gallerySource;
        img.srcset = img.dataset.gallerySrcset;
      });
      Promise.all(images.map((img) => img.decode().catch(() => {}))).then(
        () => {
          if (!disposed) carousel.dataset.photosReady = "true";
        },
      );
      photos.disconnect();
    },
    { rootMargin: "150px" },
  );
  photos.observe(viewport);
  const removal = new MutationObserver(() => {
    if (!carousel.isConnected) destroy();
  });
  removal.observe(document.body, { childList: true, subtree: true });
  function destroy() {
    disposed = true;
    cancelAnimationFrame(frame);
    controller.abort();
    reduced.removeEventListener("change", motionChange);
    visibility.disconnect();
    photos.disconnect();
    removal.disconnect();
    instances.delete(carousel);
  }
  instances.set(carousel, destroy);
  carousel.querySelector(".carousel-tools").hidden = false;
  carousel.classList.add("carousel-ready", "carousel-continuous");
  render();
  schedule();
}
function initialize() {
  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
}
function cleanup() {
  [...instances.values()].forEach((fn) => fn());
}
initialize();
document.addEventListener("astro:page-load", initialize);
document.addEventListener("astro:before-swap", cleanup);
window.addEventListener("pagehide", cleanup);
window.addEventListener("pageshow", initialize);
