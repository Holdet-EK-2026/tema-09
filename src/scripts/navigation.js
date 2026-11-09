// De kommende sider har rigtige destinationsadresser, men bygges først i fase 3.
// En forklarende dialog holder fase 1-previewet fri for døde navigationer.
const futureLinks = document.querySelectorAll("[data-future-page]");
const phaseDialog = document.querySelector("#phase-dialog");

futureLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    phaseDialog.showModal();
  });
});
