"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitForm } from "@/app/actions/forms";
import { forms, HONEYPOT_FIELD, STARTED_FIELD, type Field, type FormState, type FormType } from "@/lib/forms";

const initialState: FormState = { status: "idle" };

const inputClass =
  "mt-1 block w-full rounded-xl border-2 border-dark/15 bg-white px-4 py-3 text-base text-dark placeholder:text-dark/40 focus:border-teal focus:outline-none aria-[invalid=true]:border-red";

type Props = {
  type: FormType;
  // Pre-filled values, e.g. the topic chosen from a link.
  defaults?: Record<string, string>;
};

export function SiteForm({ type, defaults = {} }: Props) {
  const form = forms[type];
  const [state, formAction, pending] = useActionState(submitForm, initialState);
  const [startedAt, setStartedAt] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  // Record when the form was first shown (used to spot instant bot submissions).
  // eslint-disable-next-line react-hooks/set-state-in-effect -- must run in the browser, after first render
  useEffect(() => setStartedAt(String(Date.now())), []);

  // Bring the result message into view and announce it to screen readers.
  useEffect(() => {
    const el = statusRef.current;
    if (state.status === "idle" || !el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl bg-lime/20 p-6 ring-2 ring-lime focus:outline-none"
      >
        <p className="text-xl font-extrabold text-dark">Message received</p>
        <p className="mt-2 text-lg text-dark/80">{state.message}</p>
      </div>
    );
  }

  const values = state.status === "error" ? (state.values ?? {}) : {};
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};

  return (
    <form action={formAction} noValidate className="space-y-5">
      <input type="hidden" name="form_type" value={type} />
      <input type="hidden" name={STARTED_FIELD} value={startedAt} />
      {/* Spam trap: hidden from people, but bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {state.status === "error" && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl bg-red/10 p-4 font-semibold text-dark ring-2 ring-red focus:outline-none"
        >
          {state.message}
        </div>
      )}

      {form.fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={values[field.name] ?? defaults[field.name]}
          error={errors[field.name]}
        />
      ))}

      <p className="text-sm text-dark/60">Fields marked * are required.</p>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal px-8 text-base font-bold text-white transition-colors hover:bg-teal-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : form.submitLabel}
      </button>
    </form>
  );
}

function FieldInput({ field, value, error }: { field: Field; value?: string | string[]; error?: string }) {
  const id = `field-${field.name}`;
  const describedBy = [field.hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const label = (
    <>
      {field.label}
      {field.required && <span aria-hidden="true"> *</span>}
    </>
  );
  const hint = field.hint && (
    <p id={`${id}-hint`} className="mt-1 text-sm text-dark/60">
      {field.hint}
    </p>
  );
  const errorText = error && (
    <p id={`${id}-error`} className="mt-1 flex items-start gap-2 text-sm font-semibold text-dark">
      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-red" aria-hidden="true" />
      {error}
    </p>
  );

  if (field.type === "checkboxes") {
    const checked = Array.isArray(value) ? value : [];
    return (
      <fieldset aria-describedby={describedBy}>
        <legend className="font-bold text-dark">{label}</legend>
        {hint}
        <div className="mt-2 space-y-2">
          {field.options?.map((option) => (
            <label
              key={option}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-2 border-dark/10 bg-white px-4 py-2 has-[:checked]:border-teal"
            >
              <input
                type="checkbox"
                name={field.name}
                value={option}
                defaultChecked={checked.includes(option)}
                className="size-5 accent-teal"
              />
              <span className="text-dark">{option}</span>
            </label>
          ))}
        </div>
        {errorText}
      </fieldset>
    );
  }

  const common = {
    id,
    name: field.name,
    required: field.required,
    maxLength: field.maxLength,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    defaultValue: typeof value === "string" ? value : undefined,
  };

  return (
    <div>
      <label htmlFor={id} className="font-bold text-dark">
        {label}
      </label>
      {hint}
      {field.type === "textarea" ? (
        <textarea {...common} rows={5} className={inputClass} />
      ) : field.type === "select" ? (
        <select {...common} defaultValue={common.defaultValue ?? ""} className={inputClass}>
          <option value="" disabled>
            Choose one…
          </option>
          {field.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input {...common} type={field.type} autoComplete={field.autoComplete} className={inputClass} />
      )}
      {errorText}
    </div>
  );
}
