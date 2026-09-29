import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

export type StaffRole = "admin" | "editor";

// Checks the visitor is logged in AND on the team list. Use at the top of
// every admin page and every admin action.
export async function requireStaff() {
  // Admin pages depend on who is logged in, so they are never pre-built.
  await connection();
  if (!isSupabaseConfigured) redirect("/admin/login");
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: staff } = await supabase.from("admin_users").select("role").eq("user_id", user.id).maybeSingle();
  if (!staff) redirect("/admin/no-access");

  return { supabase, user, role: staff.role as StaffRole };
}

export async function requireAdmin() {
  const session = await requireStaff();
  if (session.role !== "admin") redirect("/admin");
  return session;
}
