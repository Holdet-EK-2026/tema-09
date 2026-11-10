function initializeFAQs() {
  document
    .querySelectorAll("[data-faq]:not([data-faq-ready])")
    .forEach((faq) => {
      faq.dataset.faqReady = "true";
      const buttons = [...faq.querySelectorAll("button[aria-controls]")];
      const animations = new Map();
      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
      function setOpen(button, open) {
        const panel = document.getElementById(
          button.getAttribute("aria-controls"),
        );
        const currentHeight = panel.getBoundingClientRect().height;
        animations.get(panel)?.cancel();
        button.setAttribute("aria-expanded", String(open));
        panel.setAttribute("aria-hidden", String(!open));
        panel.inert = !open;
        panel.hidden = false;
        const animation = panel.animate(
          [
            { height: `${currentHeight}px`, opacity: open ? 0 : 1 },
            {
              height: open ? `${panel.scrollHeight}px` : "0px",
              opacity: open ? 1 : 0,
            },
          ],
          {
            duration: reducedMotion.matches ? 0 : 240,
            easing: "ease",
            fill: "none",
          },
        );
        animations.set(panel, animation);
        animation.onfinish = () => {
          panel.hidden = !open;
          animations.delete(panel);
        };
      }
      buttons.forEach((button) => {
        button.disabled = false;
        button.addEventListener("click", () => {
          const open = button.getAttribute("aria-expanded") !== "true";
          buttons.forEach((other) => {
            if (
              other !== button &&
              other.getAttribute("aria-expanded") === "true"
            )
              setOpen(other, false);
          });
          setOpen(button, open);
        });
      });
    });
}
initializeFAQs();
document.addEventListener("astro:page-load", initializeFAQs);
