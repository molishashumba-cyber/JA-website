// Converting between stored values and what admin forms show / send.
import { supabaseUrl } from "@/lib/supabase/config";
import type { Photo } from "@/lib/types";
import type { AdminField } from "./schema";

export function getPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}

export function setPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let cur = obj;
  for (const k of keys.slice(0, -1)) {
    if (!cur[k] || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys.at(-1)!] = value;
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

// Zambia is on Central Africa Time (UTC+2) all year round.
const ZAMBIA_OFFSET = "+02:00";

export function isoToLocalInput(iso: unknown): string {
  if (typeof iso !== "string" || !iso) return "";
  const d = new Date(new Date(iso).getTime() + 2 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 16);
}

export function localInputToIso(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const d = new Date(`${value}:00${ZAMBIA_OFFSET}`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// Photos may be our own files (/photos/…) or uploads in Supabase Storage.
export function isAllowedImageUrl(url: string) {
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  return Boolean(supabaseUrl) && url.startsWith(`${supabaseUrl}/storage/v1/object/public/`);
}

export function isValidUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

// What a field shows when the form opens.
export type FormValue = string | boolean | Photo | Photo[] | null;

export function toFormValue(field: AdminField, raw: unknown, row?: Record<string, unknown>): FormValue {
  switch (field.type) {
    case "checkbox":
      return Boolean(raw);
    case "datetime":
      return isoToLocalInput(raw);
    case "lines":
      return Array.isArray(raw) ? raw.join("\n") : "";
    case "pairs": {
      const [a, b] = field.pairKeys ?? ["label", "url"];
      return Array.isArray(raw)
        ? raw.map((item: Record<string, string>) => `${item[a] ?? ""} | ${item[b] ?? ""}`).join("\n")
        : "";
    }
    case "image":
      if (raw && typeof raw === "object") return raw as Photo; // page fields store { src, alt }
      if (typeof raw === "string" && raw) {
        return { src: raw, alt: field.altColumn && row ? String(row[field.altColumn] ?? "") : "" };
      }
      return null;
    case "gallery":
      return Array.isArray(raw) ? (raw as Photo[]) : [];
    case "number":
      return raw === null || raw === undefined ? "0" : String(raw);
    default:
      return raw === null || raw === undefined ? "" : String(raw);
  }
}

type Parsed = { ok: true; value: unknown; alt?: string } | { ok: false; error: string };

// Reads one field from a submitted admin form and checks it.
export function parseField(field: AdminField, formData: FormData): Parsed {
  const text = () => String(formData.get(field.name) ?? "").trim();
  const missing = (): Parsed => ({ ok: false, error: `${field.label} is required.` });

  switch (field.type) {
    case "checkbox":
      return { ok: true, value: formData.get(field.name) === "on" };
    case "number": {
      const v = text();
      if (!v) return { ok: true, value: 0 };
      const n = Number(v);
      return Number.isInteger(n)
        ? { ok: true, value: n }
        : { ok: false, error: `${field.label} must be a whole number.` };
    }
    case "datetime": {
      const v = text();
      if (!v) return field.required ? missing() : { ok: true, value: null };
      const iso = localInputToIso(v);
      return iso ? { ok: true, value: iso } : { ok: false, error: `${field.label} is not a valid date and time.` };
    }
    case "lines": {
      const items = text()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      return items.length || !field.required ? { ok: true, value: items } : missing();
    }
    case "pairs": {
      const [a, b] = field.pairKeys ?? ["label", "url"];
      const items: Record<string, string>[] = [];
      for (const line of text().split("\n")) {
        if (!line.trim()) continue;
        const [first, ...rest] = line.split("|");
        const second = rest.join("|").trim();
        if (!first.trim() || !second) return { ok: false, error: `${field.label}: each line needs "name | link".` };
        if (b === "url" && !isValidUrl(second)) {
          return { ok: false, error: `${field.label}: "${second}" isn't a full web link (start it with https://).` };
        }
        items.push({ [a]: first.trim(), [b]: second });
      }
      return { ok: true, value: items };
    }
    case "image": {
      const src = text();
      const alt = String(formData.get(`${field.name}__alt`) ?? "").trim();
      if (!src) return field.required ? missing() : { ok: true, value: null, alt };
      if (!isAllowedImageUrl(src)) return { ok: false, error: `${field.label}: please upload the photo again.` };
      return { ok: true, value: src, alt };
    }
    case "gallery": {
      try {
        const photos = JSON.parse(text() || "[]") as Photo[];
        const clean = photos
          .filter((p) => p && typeof p.src === "string" && isAllowedImageUrl(p.src))
          .map((p) => ({ src: p.src, alt: String(p.alt ?? "").slice(0, 300) }));
        return { ok: true, value: clean };
      } catch {
        return { ok: false, error: `${field.label}: something went wrong, please try again.` };
      }
    }
    case "url": {
      const v = text();
      if (!v) return field.required ? missing() : { ok: true, value: null };
      return isValidUrl(v)
        ? { ok: true, value: v }
        : { ok: false, error: `${field.label} must be a full link starting with https://` };
    }
    case "email": {
      const v = text();
      if (!v) return field.required ? missing() : { ok: true, value: "" };
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
        ? { ok: true, value: v }
        : { ok: false, error: `${field.label} is not a valid email address.` };
    }
    case "select": {
      const v = text();
      if (!v) return field.required ? missing() : { ok: true, value: field.options?.[0]?.value ?? "" };
      return field.options?.some((o) => o.value === v)
        ? { ok: true, value: v }
        : { ok: false, error: `Choose a ${field.label.toLowerCase()}.` };
    }
    default: {
      const v = text();
      if (!v && field.required) return missing();
      return { ok: true, value: v };
    }
  }
}
