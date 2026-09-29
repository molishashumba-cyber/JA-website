"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import { slugify } from "@/lib/admin/values";

const MAX_SIDE = 1920;

// Shrinks big photos in the browser before upload, so uploads are quick even
// on slow mobile data. Logos (PNG with transparency) become WebP to keep the
// transparent background; SVGs and small files are uploaded as they are.
async function shrink(file: File): Promise<Blob> {
  if (file.type === "image/svg+xml") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 500_000) return file;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const type = file.type === "image/png" || file.type === "image/webp" ? "image/webp" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82));
  return blob && blob.size < file.size ? blob : file;
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  if (!EXTENSIONS[file.type]) throw new Error("Please choose a JPG, PNG, WebP or SVG image.");
  const blob = await shrink(file);
  if (blob.size > 10 * 1024 * 1024) throw new Error("That image is too large (over 10 MB).");

  const ext = EXTENSIONS[blob.type] ?? EXTENSIONS[file.type];
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "photo";
  const path = `${folder}/${Date.now()}-${base}.${ext}`;

  const supabase = createBrowserSupabase();
  const { error } = await supabase.storage.from("media").upload(path, blob, {
    contentType: blob.type || file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
