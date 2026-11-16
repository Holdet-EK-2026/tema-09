export const EVENT_IMAGE_BUCKET = "event-images";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const types = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export function imageExtension(file) {
  const extension = types[file?.type];
  if (!extension) throw new Error("Vælg et JPG-, PNG- eller WebP-billede. SVG og andre filtyper accepteres ikke.");
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error("Billedet skal være mellem 1 byte og 5 MB.");
  return extension;
}

export async function inspectImage(file, objectUrl) {
  await validateImageHeader(file);
  const image = new Image();
  image.src = objectUrl;
  try { await image.decode(); } catch { throw new Error("Filen kunne ikke læses som et billede."); }
  const width = image.naturalWidth, height = image.naturalHeight;
  if (!width || !height || width > 8192 || height > 8192 || width * height > 40000000)
    throw new Error("Billedet er for stort. Brug højst 8192 px pr. side og 40 megapixel.");
  return { width, height };
}

export async function validateImageHeader(file) {
  imageExtension(file);
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const signature = String.fromCharCode(...bytes);
  const matches = file.type === "image/png"
    ? [137,80,78,71,13,10,26,10].every((byte,index)=>bytes[index]===byte)
    : file.type === "image/jpeg"
      ? bytes[0]===255 && bytes[1]===216 && bytes[2]===255
      : signature.startsWith("RIFF") && signature.slice(8,12)==="WEBP";
  if (!matches) throw new Error("Filens indhold matcher ikke billedtypen. Vælg et gyldigt JPG-, PNG- eller WebP-billede.");
}

export async function uploadEventImage(client, file) {
  await validateImageHeader(file);
  const extension = imageExtension(file);
  const path = `events/${crypto.randomUUID()}.${extension}`;
  const bucket = client.storage.from(EVENT_IMAGE_BUCKET);
  const { error } = await bucket.upload(path, file, {
    contentType: file.type, cacheControl: "31536000", upsert: false,
  });
  if (error) throw error;
  return { path, url: bucket.getPublicUrl(path).data.publicUrl };
}

export async function removeEventImage(client, image) {
  if (!/^events\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(image.path)) throw new Error("Ugyldig billedsti.");
  const { error } = await client.storage.from(EVENT_IMAGE_BUCKET).remove([image.path]);
  if (error) throw error;
}
