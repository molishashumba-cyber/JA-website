import type { Metadata } from "next";
import { removeAccess } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { requireAdmin } from "@/lib/admin/auth";
import { AdminPageTitle } from "../AdminPageTitle";
import { GrantForm } from "./GrantForm";

export const metadata: Metadata = { title: "Team access" };

export default async function TeamPage(props: PageProps<"/admin/team">) {
  const { supabase, user } = await requireAdmin();
  const { removed } = await props.searchParams;
  const { data: staff } = await supabase
    .from("admin_users")
    .select("user_id, email, role, created_at")
    .order("created_at");

  return (
    <>
      <AdminPageTitle title="Team access" description="Who can log in to this admin area." />
      {removed && (
        <p className="mb-4 rounded-xl bg-lime/20 p-3 font-semibold text-dark ring-1 ring-lime">✓ Access removed.</p>
      )}

      <ul className="space-y-2">
        {staff?.map((s) => (
          <li
            key={s.user_id}
            className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-dark/10"
          >
            <span className="font-bold text-dark">{s.email}</span>
            <span className="rounded-full bg-pearl px-2 py-0.5 text-xs font-bold text-dark/70">
              {s.role === "admin" ? "Admin" : "Editor"}
            </span>
            {s.user_id === user.id ? (
              <span className="ml-auto text-sm text-dark/60">You</span>
            ) : (
              <form action={removeAccess.bind(null, s.user_id)} className="ml-auto">
                <ConfirmButton small message={`Remove admin-area access for ${s.email}?`}>
                  Remove access
                </ConfirmButton>
              </form>
            )}
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-dark/10">
        <h2 className="text-lg font-extrabold text-dark">Give someone access</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-dark/80">
          <li>
            In <strong>Supabase → Authentication → Users</strong>, click <strong>Add user → Create new user</strong>.
            Enter their email and a temporary password, and tick <strong>Auto Confirm User</strong>.
          </li>
          <li>Enter the same email below and choose their role.</li>
          <li>
            Send them the website&apos;s /admin link and their temporary password. They can change it under My account.
          </li>
        </ol>
        <p className="mt-3 text-sm text-dark/60">
          <strong>Editors</strong> can edit everything and manage submissions. <strong>Admins</strong> can also delete
          submissions and manage team access.
        </p>
        <GrantForm />
      </section>
    </>
  );
}
