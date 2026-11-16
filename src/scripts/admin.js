import { createClient } from "@supabase/supabase-js";
import { inspectImage, uploadEventImage, removeEventImage } from "../lib/event-images.js";
const url = import.meta.env.PUBLIC_SUPABASE_URL,
  key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const status = document.querySelector("#admin-status"),
  login = document.querySelector("#admin-login"),
  workspace = document.querySelector("#admin-workspace"),
  editor = document.querySelector("#admin-editor");
const retry = document.querySelector("#admin-retry");
const imageFile = document.querySelector("#admin-image-file"),
  imagePreview = document.querySelector("#admin-image-preview"),
  imageStatus = document.querySelector("#admin-image-status"),
  imageClear = document.querySelector("#admin-image-clear");
let selectedImage = null, imageInfo = null, previewUrl = null, pendingUpload = null,
  imageRevision = 0, saving = false;
let client,
  editing = null,
  rows = [],
  revision = 0;
const message = (text) => {
  status.textContent = text;
  retry.hidden = true;
};
function hidePrivate() {
  clearImageChoice();
  workspace.hidden = true;
  editor.hidden = true;
  document.querySelector("#admin-events").replaceChildren();
  rows = [];
  editing = null;
}
function busy(form, value) {
  form.querySelectorAll("button, input, select, textarea").forEach((b) => (b.disabled = value));
}
function clearImageChoice(keepFile = false) {
  ++imageRevision;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
  selectedImage = null;
  imageInfo = null;
  if (!keepFile) imageFile.value = "";
  imageFile.setCustomValidity("");
  imageFile.disabled = false;
  imagePreview.removeAttribute("src");
  imagePreview.hidden = true;
  imageClear.hidden = true;
  imageStatus.textContent = "";
  editor.elements.image_url.required = true;
  editor.elements.image_url.readOnly = false;
}
async function discardUpload() {
  if (!pendingUpload) return true;
  try {
    await removeEventImage(client, pendingUpload);
    pendingUpload = null;
    imageFile.disabled = false;
    return true;
  } catch {
    imageStatus.textContent = "Det ubrugte upload kunne ikke ryddes op. Prøv at gemme eller annullere igen, når forbindelsen virker.";
    return false;
  }
}
imageFile.addEventListener("change", async () => {
  const file = imageFile.files[0];
  if (!await discardUpload()) return;
  clearImageChoice(true);
  if (!file) return;
  const mine = imageRevision;
  imageFile.setCustomValidity("Billedet kontrolleres. Vent et øjeblik.");
  imageStatus.textContent = "Kontrollerer billedet…";
  const objectUrl = URL.createObjectURL(file);
  try {
    const info = await inspectImage(file, objectUrl);
    if (mine !== imageRevision) { URL.revokeObjectURL(objectUrl); return; }
    selectedImage = file;
    imageInfo = info;
    imageFile.setCustomValidity("");
    previewUrl = objectUrl;
    imagePreview.src = objectUrl;
    imagePreview.hidden = false;
    imageClear.hidden = false;
    editor.elements.image_url.required = false;
    editor.elements.image_url.readOnly = true;
    imageStatus.textContent = `${file.name} · ${info.width} × ${info.height} px. Klar til upload ved Gem event.`;
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    if (mine !== imageRevision) return;
    imageFile.setCustomValidity(error.message);
    imageStatus.textContent = error.message;
    imageClear.hidden = false;
  }
});
imageClear.addEventListener("click", async () => {
  if (await discardUpload()) clearImageChoice();
});
function fail(error) {
  message(
    error?.code === "23505"
      ? "Sluggen findes allerede. Vælg en anden."
      : "Handlingen mislykkedes. Kontrollér forbindelsen og din adgang, og prøv igen.",
  );
  retry.hidden = false;
}
async function load() {
  const { data, error } = await client
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false });
  if (error) {
    hidePrivate();
    fail(error);
    return;
  }
  rows = data;
  const list = document.querySelector("#admin-events");
  list.replaceChildren();
  for (const row of rows) {
    const item = document.createElement("li"),
      title = document.createElement("strong");
    title.textContent = `${row.title} · ${row.status === "published" ? "Publiceret" : "Draft"}`;
    item.append(title, document.createElement("br"));
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "button secondary";
    edit.textContent = "Redigér";
    edit.addEventListener("click", () => openEditor(row));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "button secondary";
    remove.textContent = "Slet";
    remove.addEventListener("click", async () => {
      if (
        !confirm(
          `Slet “${row.title}”? Dette kan ikke fortrydes i administrationen.`,
        )
      )
        return;
      remove.disabled = true;
      const { error, data } = await client
        .from("events")
        .delete()
        .eq("id", row.id)
        .select("id");
      if (error || data.length !== 1) {
        fail(error);
        remove.disabled = false;
        return;
      }
      if (editing === row.id) {
        editor.hidden = true;
        editing = null;
      }
      await load();
      message("Eventet er slettet.");
    });
    item.append(edit, remove);
    list.append(item);
  }
  message(
    rows.length
      ? `${rows.length} events indlæst.`
      : "Ingen events endnu. Opret det første event.",
  );
}
async function openEditor(row) {
  if (saving || !await discardUpload()) return;
  clearImageChoice();
  editing = row?.id || null;
  editor.reset();
  for (const field of editor.elements) {
    if (!field.name) continue;
    const value = row?.[field.name];
    field.value =
      field.type === "datetime-local"
        ? value
          ? value.slice(0, 16)
          : ""
        : (value ??
          (field.name === "status"
            ? "draft"
            : field.name === "category"
              ? "Meetup"
              : ""));
  }
  editor.elements.slug.readOnly = !!row;
  document.querySelector("#editor-title").textContent = row
    ? "Redigér event"
    : "Opret event";
  editor.hidden = false;
  editor.elements.title.focus();
}
async function access() {
  const mine = ++revision;
  hidePrivate();
  login.hidden = true;
  message("Kontrollerer adgang…");
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (mine !== revision) return;
  if (error || !user) {
    login.hidden = false;
    message("Log ind med din godkendte administratorkonto.");
    return;
  }
  const { data, error: membershipError } = await client
    .from("event_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (mine !== revision) return;
  if (membershipError || !data) {
    await client.auth.signOut();
    login.hidden = false;
    message("Kontoen er ikke godkendt til administration.");
    return;
  }
  workspace.hidden = false;
  await load();
}
if (!url || !key) {
  message("Administration er ikke konfigureret. Kontakt projektets ejer.");
} else {
  client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  login.addEventListener("submit", async (e) => {
    e.preventDefault();
    busy(login, true);
    message("Logger ind…");
    try {
      const { error } = await client.auth.signInWithPassword({
        email: login.elements.email.value.trim(),
        password: login.elements.password.value,
      });
      login.elements.password.value = "";
      if (error) {
        message("Login mislykkedes. Kontrollér e-mail og adgangskode.");
        return;
      }
      await access();
    } catch {
      fail();
    } finally {
      busy(login, false);
    }
  });
  document
    .querySelector("#admin-logout")
    .addEventListener("click", async () => {
      if (saving || !await discardUpload()) return;
      ++revision;
      hidePrivate();
      const { error } = await client.auth.signOut();
      login.hidden = false;
      message(
        error ? "Logout kunne ikke bekræftes. Prøv igen." : "Du er logget ud.",
      );
    });
  document
    .querySelector("#admin-new")
    .addEventListener("click", () => openEditor(null));
  document.querySelector("#admin-cancel").addEventListener("click", async () => {
    if (saving || !await discardUpload()) return;
    clearImageChoice();
    editor.hidden = true;
    editing = null;
  });
  document
    .querySelector("#admin-reload")
    .addEventListener("click", async () => { if (await discardUpload()) access(); });
  editor.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (saving || !editor.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(editor));
    Object.keys(fields).forEach((k) => (fields[k] = fields[k].trim()));
    try {
      new Intl.DateTimeFormat("da-DK", { timeZone: fields.timezone });
    } catch {
      message("Tidszonen er ugyldig. Brug en IANA-tidszone.");
      return;
    }
    fields.starts_at = new Date(fields.starts_at + "Z").toISOString();
    fields.ends_at = new Date(fields.ends_at + "Z").toISOString();
    if (fields.ends_at <= fields.starts_at) {
      message("Slut skal ligge efter start.");
      return;
    }
    if (
      !selectedImage && !/^https:\/\/.+/.test(fields.image_url) &&
      !/^\/images\/[a-zA-Z0-9._-]+$/.test(fields.image_url)
    ) {
      message(
        "Billedet skal bruge HTTPS eller et eksisterende /images/-asset.",
      );
      return;
    }
    saving = true;
    busy(workspace, true);
    const mine = revision;
    message(selectedImage ? "Uploader billede og gemmer event…" : "Gemmer event…");
    try {
      if (selectedImage) {
        pendingUpload ||= await uploadEventImage(client, selectedImage);
        fields.image_url = pendingUpload.url;
        fields.details = {
          ...(rows.find(row => row.id === editing)?.details || {}),
          coverWidth: imageInfo.width, coverHeight: imageInfo.height,
        };
      }
      if (mine !== revision) { await discardUpload(); return; }
      const query = editing
        ? client.from("events").update(fields).eq("id", editing)
        : client.from("events").insert(fields);
      const { error, data } = await query.select("id");
      if (error || data.length !== 1) {
        await discardUpload();
        fail(error);
        return;
      }
      editor.hidden = true;
      pendingUpload = null;
      clearImageChoice();
      editing = null;
      await load();
      message(
        "Eventet er gemt. Publicerede ændringer vises ved næste sideindlæsning.",
      );
    } catch {
      await discardUpload();
      fail();
    } finally {
      saving = false;
      busy(workspace, false);
      // Retain the same file until a failed cleanup is retried or the event is saved.
      imageFile.disabled = Boolean(pendingUpload);
    }
  });
  client.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      ++revision;
      hidePrivate();
      login.hidden = false;
      message("Du er logget ud.");
    } else if (event === "TOKEN_REFRESHED") {
      setTimeout(() => access(), 0);
    }
  });
  retry.addEventListener("click", async () => {
    if (await discardUpload()) access().catch(() => fail());
  });
  access().catch(() => {
    hidePrivate();
    login.hidden = false;
    fail();
  });
}
