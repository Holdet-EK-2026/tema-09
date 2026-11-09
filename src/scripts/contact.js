const form = document.querySelector("#contact-form");
const confirmation = document.querySelector(".contact-confirmation");
const summary = document.querySelector(".form-error-summary");
const fields = ["name", "email", "message"].map((id) =>
  document.getElementById(id),
);
function validateField(field) {
  let message = "";
  if (!field.value.trim())
    message =
      field.id === "name"
        ? "Skriv dit navn."
        : field.id === "email"
          ? "Skriv din e-mail."
          : "Skriv en besked.";
  else if (!field.validity.valid)
    message =
      field.id === "email"
        ? "Skriv en gyldig e-mailadresse."
        : "Kontrollér feltets indhold.";
  document.getElementById(`${field.id}-error`).textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return message;
}
fields.forEach((field) =>
  field.addEventListener("input", () => {
    if (field.hasAttribute("aria-invalid")) validateField(field);
  }),
);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const errors = fields.map(validateField).filter(Boolean);
  summary.hidden = !errors.length;
  summary.textContent = errors.length
    ? `Beskeden er ikke afprøvet. ${errors.join(" ")}`
    : "";
  if (errors.length) {
    summary.focus();
    return;
  }
  // Figma definerer et demoflow: ingen fetch, lagring eller afsendelse af persondata.
  form.hidden = true;
  confirmation.hidden = false;
  confirmation.focus();
});
document.querySelector("[data-contact-reset]").addEventListener("click", () => {
  form.reset();
  fields.forEach((field) => {
    field.removeAttribute("aria-invalid");
    document.getElementById(`${field.id}-error`).textContent = "";
  });
  summary.hidden = true;
  confirmation.hidden = true;
  form.hidden = false;
  fields[0].focus();
});
const subject = new URL(location.href).searchParams.get("emne");
if (["Spørgsmål", "Idé til et event", "Samarbejde"].includes(subject))
  form.elements.subject.value = subject;

// Uden JavaScript forbliver submit deaktiveret, så demodata ikke havner i en URL.
form.querySelector('[type="submit"]').disabled = false;
