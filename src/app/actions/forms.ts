"use server";

import { sendFormAlert } from "@/lib/email";
import {
  COLUMN_FIELDS,
  forms,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  STARTED_FIELD,
  type FormState,
  type FormType,
} from "@/lib/forms";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createFormClient } from "@/lib/supabase/public";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isFormType(value: unknown): value is FormType {
  return typeof value === "string" && value in forms;
}

export async function submitForm(_prev: FormState, formData: FormData): Promise<FormState> {
  const formType = formData.get("form_type");
  if (!isFormType(formType)) return { status: "error", message: "Something went wrong. Please refresh and try again." };
  const form = forms[formType];

  // Spam traps: a filled-in hidden field, or a form sent faster than a person could type.
  // Bots get a normal-looking "thank you" so they don't retry.
  const started = Number(formData.get(STARTED_FIELD));
  if (formData.get(HONEYPOT_FIELD) || !started || Date.now() - started < MIN_FILL_MS) {
    return { status: "success", message: form.success };
  }

  const values: Record<string, string | string[]> = {};
  const fieldErrors: Record<string, string> = {};

  for (const field of form.fields) {
    if (field.type === "checkboxes") {
      const picked = formData
        .getAll(field.name)
        .map(String)
        .filter((v) => field.options?.includes(v));
      values[field.name] = picked;
      if (field.required && picked.length === 0) fieldErrors[field.name] = "Please choose at least one option.";
      continue;
    }

    const value = String(formData.get(field.name) ?? "").trim();
    values[field.name] = value;
    if (!value) {
      if (field.required) fieldErrors[field.name] = `Please enter your ${field.label.toLowerCase()}.`;
      continue;
    }
    if (value.length > field.maxLength) {
      fieldErrors[field.name] = `Please keep this under ${field.maxLength} characters.`;
    } else if (field.type === "email" && !EMAIL_PATTERN.test(value)) {
      fieldErrors[field.name] = "Please enter a valid email address, like name@example.com.";
    } else if (field.type === "select" && field.options && !field.options.includes(value)) {
      fieldErrors[field.name] = "Please choose one of the options.";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors, values };
  }

  if (!isSupabaseConfigured) {
    return { status: "error", message: "Sorry, the form isn't available right now. Please email us instead.", values };
  }

  const column = (key: (typeof COLUMN_FIELDS)[number]) => (values[key] as string | undefined) || null;
  const details = Object.fromEntries(
    Object.entries(values).filter(([key]) => !(COLUMN_FIELDS as readonly string[]).includes(key)),
  );

  // Insert only: visitors are not allowed to read submissions back.
  const { error } = await createFormClient()
    .from("form_submissions")
    .insert({
      form_type: formType,
      name: column("name"),
      email: column("email"),
      phone: column("phone"),
      organisation: column("organisation"),
      message: column("message") ?? "",
      details,
    });

  if (error) {
    console.error("Saving form submission failed:", error.message);
    return {
      status: "error",
      message: "Sorry, we couldn't send your message just now. Please try again in a moment, or email us.",
      values,
    };
  }

  await sendFormAlert(
    formType,
    form.fields.map((f) => {
      const v = values[f.name];
      return { label: f.label, value: Array.isArray(v) ? v.join(", ") : (v ?? "") };
    }),
    String(values.email),
  );

  return { status: "success", message: form.success };
}
