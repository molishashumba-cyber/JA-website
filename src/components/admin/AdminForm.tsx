"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import type { AdminField } from "@/lib/admin/schema";
import type { FormValue } from "@/lib/admin/values";
import type { Photo } from "@/lib/types";
import { uploadImage } from "./upload";

const inputClass =
  "mt-1 block w-full rounded-lg border-2 border-dark/15 bg-white px-3 py-2.5 text-base text-dark focus:border-teal focus:outline-none aria-[invalid=true]:border-red";

type Props = {
  fields: AdminField[];
  values: Record<string, FormValue>;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel?: string;
};

export function AdminForm({ fields, values, action, submitLabel = "Save changes" }: Props) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as ActionState);
  const [uploading, setUploading] = useState(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state]);

  const busy = pending || uploading > 0;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {fields.map((field) => (
        <FieldRow key={field.name} field={field} error={errors[field.name]}>
          <FieldInput
            field={field}
            value={values[field.name]}
            invalid={Boolean(errors[field.name])}
            onUploading={(delta) => setUploading((n) => n + delta)}
          />
        </FieldRow>
      ))}

      <div className="sticky bottom-0 -mx-4 border-t border-dark/10 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <div ref={statusRef} role="status" aria-live="polite">
          {state.status === "success" && <p className="mb-2 font-semibold text-dark">✓ {state.message}</p>}
          {state.status === "error" && (
            <p className="mb-2 flex items-start gap-2 font-semibold text-dark">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-red" aria-hidden="true" />
              {state.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-teal px-6 font-bold text-white hover:bg-teal-dark disabled:opacity-60 sm:w-auto"
        >
          {uploading > 0 ? "Uploading photo…" : pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function FieldRow({ field, error, children }: { field: AdminField; error?: string; children: React.ReactNode }) {
  return (
    <div>
      {field.type !== "checkbox" && (
        <label htmlFor={`f-${field.name}`} className="font-bold text-dark">
          {field.label}
          {field.required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      {field.hint && field.type !== "checkbox" && <p className="text-sm text-dark/60">{field.hint}</p>}
      {children}
      {error && (
        <p className="mt-1 flex items-start gap-2 text-sm font-semibold text-dark">
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-red" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function FieldInput({
  field,
  value,
  invalid,
  onUploading,
}: {
  field: AdminField;
  value: FormValue | undefined;
  invalid: boolean;
  onUploading: (delta: number) => void;
}) {
  const id = `f-${field.name}`;
  const str = typeof value === "string" ? value : "";
  const common = { id, name: field.name, "aria-invalid": invalid || undefined, className: inputClass };

  switch (field.type) {
    case "textarea":
      return <textarea {...common} rows={3} defaultValue={str} />;
    case "longtext":
    case "lines":
    case "pairs":
      return <textarea {...common} rows={field.type === "longtext" ? 12 : 6} defaultValue={str} />;
    case "checkbox":
      return (
        <label className="flex min-h-11 items-center gap-3 font-bold text-dark">
          <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} className="size-5 accent-teal" />
          {field.label}
        </label>
      );
    case "select":
      return (
        <select {...common} defaultValue={str || field.options?.[0]?.value}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "number":
      return (
        <input
          {...common}
          type="number"
          step={1}
          inputMode="numeric"
          defaultValue={str}
          className={`${inputClass} max-w-40`}
        />
      );
    case "datetime":
      return <input {...common} type="datetime-local" defaultValue={str} className={`${inputClass} max-w-72`} />;
    case "url":
      return <input {...common} type="url" inputMode="url" placeholder="https://" defaultValue={str} />;
    case "email":
      return <input {...common} type="email" defaultValue={str} />;
    case "image":
      return <ImageInput field={field} initial={(value as Photo | null) ?? null} onUploading={onUploading} />;
    case "gallery":
      return <GalleryInput field={field} initial={Array.isArray(value) ? value : []} onUploading={onUploading} />;
    default:
      return <input {...common} type="text" defaultValue={str} />;
  }
}

function ImageInput({
  field,
  initial,
  onUploading,
}: {
  field: AdminField;
  initial: Photo | null;
  onUploading: (delta: number) => void;
}) {
  const [photo, setPhoto] = useState<Photo | null>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // List items (news, people…) store a photo link and may have no photo;
  // page banners always need one and always have a description.
  const removable = Boolean(field.altColumn) || field.name.endsWith("_url");
  const hasAlt = Boolean(field.altColumn) || !removable;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    onUploading(1);
    try {
      const src = await uploadImage(file, field.folder);
      setPhoto({ src, alt: photo?.alt ?? "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      onUploading(-1);
    }
  }

  return (
    <div className="mt-2 rounded-xl border-2 border-dashed border-dark/15 p-3">
      <input type="hidden" name={field.name} value={photo?.src ?? ""} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-pearl sm:w-48">
          {photo ? (
            <Image src={photo.src} alt="" fill sizes="192px" className="object-contain" unoptimized />
          ) : (
            <span className="flex size-full items-center justify-center text-sm text-dark/50">No photo</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border-2 border-teal px-4 font-bold text-teal hover:bg-teal hover:text-white">
            {busy ? "Uploading…" : photo ? "Replace photo" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="sr-only"
              onChange={onFile}
              disabled={busy}
            />
          </label>
          {photo && removable && (
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="min-h-11 rounded-full px-4 text-sm font-bold text-dark/70 hover:bg-pearl"
            >
              Remove photo
            </button>
          )}
          {hasAlt && photo && (
            <label className="text-sm font-bold text-dark">
              Describe the photo (for blind visitors and Google)
              <input
                name={`${field.name}__alt`}
                defaultValue={photo.alt}
                key={photo.src}
                placeholder="e.g. Students pitching their business to judges"
                className={inputClass}
              />
            </label>
          )}
          {error && <p className="text-sm font-semibold text-dark">⚠ {error}</p>}
        </div>
      </div>
    </div>
  );
}

function GalleryInput({
  field,
  initial,
  onUploading,
}: {
  field: AdminField;
  initial: Photo[];
  onUploading: (delta: number) => void;
}) {
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(0);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    setError("");
    for (const file of files) {
      setBusy((n) => n + 1);
      onUploading(1);
      try {
        const src = await uploadImage(file, field.folder);
        setPhotos((list) => [...list, { src, alt: "" }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setBusy((n) => n - 1);
        onUploading(-1);
      }
    }
  }

  const move = (i: number, by: number) =>
    setPhotos((list) => {
      const next = [...list];
      const j = i + by;
      if (j < 0 || j >= next.length) return list;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className="mt-2">
      <input type="hidden" name={field.name} value={JSON.stringify(photos)} />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.src} className="rounded-xl border-2 border-dark/10 bg-white p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-pearl">
              <Image src={p.src} alt="" fill sizes="200px" className="object-cover" unoptimized />
            </div>
            <input
              aria-label={`Description for photo ${i + 1}`}
              placeholder="Describe the photo"
              defaultValue={p.alt}
              onChange={(e) => {
                const alt = e.target.value;
                setPhotos((list) => list.map((x, k) => (k === i ? { ...x, alt } : x)));
              }}
              className="mt-2 block w-full rounded-md border border-dark/15 px-2 py-1.5 text-sm"
            />
            <div className="mt-2 flex gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                aria-label="Move earlier"
                className="size-9 rounded-md bg-pearl font-bold"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                aria-label="Move later"
                className="size-9 rounded-md bg-pearl font-bold"
              >
                →
              </button>
              <button
                type="button"
                onClick={() => setPhotos((list) => list.filter((_, k) => k !== i))}
                className="ml-auto rounded-md px-2 text-sm font-bold text-dark/70 hover:bg-pearl"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border-2 border-teal px-4 font-bold text-teal hover:bg-teal hover:text-white">
        {busy > 0 ? `Uploading ${busy}…` : "Add photos"}
        <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFiles} />
      </label>
      {error && <p className="mt-2 text-sm font-semibold text-dark">⚠ {error}</p>}
    </div>
  );
}
