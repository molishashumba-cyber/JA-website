"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import * as placeholder from "@/content/placeholder";
import { requireAdmin, requireStaff } from "@/lib/admin/auth";
import { getCollection, getPage, type AdminField } from "@/lib/admin/schema";
import { parseField, setPath, slugify } from "@/lib/admin/values";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CONTENT_TAG } from "@/lib/supabase/public";
import { createSessionClient } from "@/lib/supabase/server";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

// Makes the public website show the change straight away.
function refreshWebsite() {
  updateTag(CONTENT_TAG);
}

function friendlyDbError(error: { code?: string; message: string }) {
  if (error.code === "23505") return "That web address is already used by another item. Please choose a different one.";
  if (error.code === "42501") return "You don't have permission to do that.";
  console.error("Admin save failed:", error);
  return "Sorry, that didn't save. Please try again.";
}

// ── Login ────────────────────────────────────────────────────

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured) return { status: "error", message: "The website isn't connected to Supabase yet." };
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { status: "error", message: "Please enter your email and password." };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      status: "error",
      message:
        error.status === 429
          ? "Too many attempts. Please wait a few minutes and try again."
          : "That email and password don't match. Please try again.",
    };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireStaff();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 10) return { status: "error", message: "Please use at least 10 characters." };
  if (password !== confirm) return { status: "error", message: "The two passwords don't match." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Your password has been changed." };
}

// ── Lists (programs, news, events…) ─────────────────────────

function readFields(fields: AdminField[], formData: FormData) {
  const record: Record<string, unknown> = {};
  const fieldErrors: Record<string, string> = {};
  for (const field of fields) {
    const parsed = parseField(field, formData);
    if (!parsed.ok) {
      fieldErrors[field.name] = parsed.error;
      continue;
    }
    record[field.name] = parsed.value;
    if (field.type === "image" && field.altColumn) record[field.altColumn] = parsed.alt ?? "";
  }
  return { record, fieldErrors };
}

export async function saveItem(
  collectionKey: string,
  id: string | null,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase } = await requireStaff();
  const collection = getCollection(collectionKey);
  if (!collection) return { status: "error", message: "Unknown section." };

  const { record, fieldErrors } = readFields(collection.fields, formData);

  // Build the web address from the title when it's left empty.
  const slugField = collection.fields.find((f) => f.type === "slug");
  if (slugField) {
    const typed = slugify(String(record[slugField.name] ?? ""));
    const fromTitle = slugify(String(record[slugField.slugFrom ?? collection.titleField] ?? ""));
    record[slugField.name] = typed || fromTitle;
    if (!record[slugField.name]) fieldErrors[slugField.name] = "Please enter a web address.";
  }

  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  if (id) {
    const { error } = await supabase.from(collection.table).update(record).eq("id", id);
    if (error) return { status: "error", message: friendlyDbError(error) };
    refreshWebsite();
    return { status: "success", message: "Saved. The website has been updated." };
  }

  const { data, error } = await supabase.from(collection.table).insert(record).select("id").single();
  if (error) return { status: "error", message: friendlyDbError(error) };
  refreshWebsite();
  redirect(`/admin/content/${collection.key}/${data.id}?created=1`);
}

export async function deleteItem(collectionKey: string, id: string) {
  const { supabase } = await requireStaff();
  const collection = getCollection(collectionKey);
  if (!collection) return;
  const { error } = await supabase.from(collection.table).delete().eq("id", id);
  if (error) throw new Error(friendlyDbError(error));
  refreshWebsite();
  redirect(`/admin/content/${collection.key}?deleted=1`);
}

// ── Page text blocks (settings) ─────────────────────────────

const PAGE_DEFAULTS: Record<string, object> = {
  home: Object.fromEntries(Object.entries(placeholder.home).filter(([k]) => k !== "stats")),
  about: placeholder.about,
  impact: placeholder.impact,
  get_involved: placeholder.getInvolved,
  site: placeholder.site,
};

export async function savePage(pageKey: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireStaff();
  const page = getPage(pageKey);
  if (!page) return { status: "error", message: "Unknown page." };

  const { data: row, error: readError } = await supabase
    .from("settings")
    .select("value")
    .eq("key", pageKey)
    .maybeSingle();
  if (readError) return { status: "error", message: friendlyDbError(readError) };

  const value: Record<string, unknown> = structuredClone({ ...PAGE_DEFAULTS[pageKey], ...(row?.value ?? {}) });
  const fieldErrors: Record<string, string> = {};

  for (const field of page.fields) {
    const parsed = parseField(field, formData);
    if (!parsed.ok) {
      fieldErrors[field.name] = parsed.error;
      continue;
    }
    if (field.type === "image") {
      // Page photos can be replaced but not left empty.
      if (parsed.value) setPath(value, field.name, { src: parsed.value, alt: parsed.alt ?? "" });
      continue;
    }
    setPath(value, field.name, parsed.value);
  }

  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  const { error } = await supabase.from("settings").upsert({ key: pageKey, value });
  if (error) return { status: "error", message: friendlyDbError(error) };
  refreshWebsite();
  return { status: "success", message: "Saved. The website has been updated." };
}

// ── Form submissions ────────────────────────────────────────

export async function setSubmissionStatus(id: string, status: "new" | "handled") {
  const { supabase } = await requireStaff();
  await supabase.from("form_submissions").update({ status }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteSubmission(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("form_submissions").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}

// ── Team access ─────────────────────────────────────────────

export async function grantAccess(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const email = String(formData.get("email") ?? "").trim();
  const role = formData.get("role") === "admin" ? "admin" : "editor";
  if (!email) return { status: "error", message: "Please enter an email address." };

  const { data, error } = await supabase.rpc("grant_staff_access", { p_email: email, p_role: role });
  if (error) return { status: "error", message: error.message };
  if (data === "not_found") {
    return {
      status: "error",
      message: `There's no login for ${email} yet. Create one first in Supabase (Authentication → Users → Add user), then try again.`,
    };
  }
  return {
    status: "success",
    message: `${email} can now use the admin area as ${role === "admin" ? "an admin" : "an editor"}.`,
  };
}

export async function removeAccess(userId: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("remove_staff_access", { p_user_id: userId });
  if (error) throw new Error(error.message);
  redirect("/admin/team?removed=1");
}
