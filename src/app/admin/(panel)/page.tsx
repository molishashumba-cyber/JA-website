import type { Metadata } from "next";
import Link from "next/link";
import { requireStaff } from "@/lib/admin/auth";
import { collections, pages } from "@/lib/admin/schema";
import { AdminPageTitle } from "./AdminPageTitle";

export const metadata: Metadata = { title: "Dashboard" };

const FORM_NAMES = { contact: "Contact", volunteer: "Volunteer", partner: "Partnership" } as const;

export default async function DashboardPage() {
  const { supabase } = await requireStaff();
  const [{ data: newOnes }, { count: total }] = await Promise.all([
    supabase
      .from("form_submissions")
      .select("id, form_type, name, created_at")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("form_submissions").select("id", { count: "exact", head: true }),
  ]);
  const counts = { contact: 0, volunteer: 0, partner: 0 };
  for (const s of newOnes ?? []) counts[s.form_type as keyof typeof counts]++;

  return (
    <>
      <AdminPageTitle title="Dashboard" description="Welcome! Here's what needs your attention." />

      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-dark/10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-dark">New form submissions</h2>
          <Link href="/admin/submissions" className="text-sm font-bold text-teal hover:underline">
            See all ({total ?? 0}) →
          </Link>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3">
          {(Object.keys(counts) as (keyof typeof counts)[]).map((k) => (
            <Link
              key={k}
              href={`/admin/submissions?type=${k}&status=new`}
              className="rounded-xl bg-pearl p-3 text-center hover:ring-2 hover:ring-teal"
            >
              <dd className="text-3xl font-extrabold text-teal">{counts[k]}</dd>
              <dt className="text-sm font-semibold text-dark/70">{FORM_NAMES[k]}</dt>
            </Link>
          ))}
        </dl>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-dark/10">
          <h2 className="text-lg font-extrabold text-dark">Edit pages</h2>
          <ul className="mt-3 space-y-1">
            {pages.map((p) => (
              <li key={p.key}>
                <Link href={`/admin/pages/${p.key}`} className="block rounded-lg px-3 py-2 hover:bg-pearl">
                  <span className="font-bold text-dark">{p.label}</span>
                  <span className="block text-sm text-dark/60">{p.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-dark/10">
          <h2 className="text-lg font-extrabold text-dark">Edit lists</h2>
          <ul className="mt-3 space-y-1">
            {collections.map((c) => (
              <li key={c.key}>
                <Link href={`/admin/content/${c.key}`} className="block rounded-lg px-3 py-2 hover:bg-pearl">
                  <span className="font-bold text-dark">{c.label}</span>
                  <span className="block text-sm text-dark/60">{c.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
