import type { Metadata } from "next";
import Link from "next/link";
import { deleteSubmission, setSubmissionStatus } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { requireStaff } from "@/lib/admin/auth";
import { forms, type FormType } from "@/lib/forms";
import { AdminPageTitle } from "../AdminPageTitle";

export const metadata: Metadata = { title: "Form submissions" };

const TYPES: Record<FormType, string> = { contact: "Contact", volunteer: "Volunteer", partner: "Partnership" };
const PAGE_SIZE = 50;

type Submission = {
  id: string;
  form_type: FormType;
  name: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  message: string;
  details: Record<string, string | string[]>;
  status: "new" | "handled";
  created_at: string;
};

function when(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lusaka",
  });
}

export default async function SubmissionsPage(props: PageProps<"/admin/submissions">) {
  const sp = await props.searchParams;
  const type = typeof sp.type === "string" && sp.type in TYPES ? (sp.type as FormType) : undefined;
  const status = sp.status === "new" || sp.status === "handled" ? sp.status : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const { supabase, role } = await requireStaff();
  let query = supabase
    .from("form_submissions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (type) query = query.eq("form_type", type);
  if (status) query = query.eq("status", status);
  const { data, count } = await query;
  const rows = (data ?? []) as Submission[];

  const link = (changes: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const next = { type, status, ...changes };
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
    const qs = params.toString();
    return `/admin/submissions${qs ? `?${qs}` : ""}`;
  };
  const exportParams = new URLSearchParams();
  if (type) exportParams.set("type", type);
  if (status) exportParams.set("status", status);

  const pill = (active: boolean) =>
    `inline-flex min-h-9 items-center rounded-full px-3 text-sm font-bold ${active ? "bg-dark text-white" : "bg-white text-dark ring-1 ring-dark/15 hover:ring-teal"}`;

  return (
    <>
      <AdminPageTitle
        title="Form submissions"
        description="Messages from the Contact, Volunteer and Partner forms."
        actions={
          <a
            href={`/admin/export?${exportParams}`}
            className="inline-flex min-h-11 items-center rounded-full border-2 border-azure px-4 font-bold text-azure hover:bg-azure hover:text-white"
          >
            Download spreadsheet (CSV)
          </a>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href={link({ type: undefined, page: undefined })} className={pill(!type)}>
          All forms
        </Link>
        {(Object.keys(TYPES) as FormType[]).map((t) => (
          <Link key={t} href={link({ type: t, page: undefined })} className={pill(type === t)}>
            {TYPES[t]}
          </Link>
        ))}
        <span className="mx-1 w-px bg-dark/15" aria-hidden="true" />
        <Link href={link({ status: undefined, page: undefined })} className={pill(!status)}>
          Any status
        </Link>
        <Link href={link({ status: "new", page: undefined })} className={pill(status === "new")}>
          New
        </Link>
        <Link href={link({ status: "handled", page: undefined })} className={pill(status === "handled")}>
          Handled
        </Link>
      </div>

      {rows.length === 0 && (
        <p className="rounded-2xl bg-white p-6 text-dark/80 ring-1 ring-dark/10">No submissions here yet.</p>
      )}

      <ul className="space-y-3">
        {rows.map((s) => {
          const labels = Object.fromEntries(forms[s.form_type].fields.map((f) => [f.name, f.label]));
          return (
            <li
              key={s.id}
              className={`rounded-2xl bg-white shadow-sm ring-1 ${s.status === "new" ? "ring-2 ring-teal" : "ring-dark/10"}`}
            >
              <details>
                <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 p-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${s.status === "new" ? "bg-azure text-white" : "bg-pearl text-dark/80"}`}
                  >
                    {s.status === "new" ? "New" : "Handled"}
                  </span>
                  <span className="text-xs font-bold tracking-widest text-azure uppercase">{TYPES[s.form_type]}</span>
                  <span className="font-bold text-dark">{s.name}</span>
                  <span className="text-sm text-dark/75">{s.organisation}</span>
                  <span className="ml-auto text-sm text-dark/75">{when(s.created_at)}</span>
                </summary>
                <div className="border-t border-dark/10 p-4">
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-bold text-dark/75 uppercase">Email</dt>
                      <dd>
                        <a href={`mailto:${s.email}`} className="font-semibold text-azure underline">
                          {s.email}
                        </a>
                      </dd>
                    </div>
                    {s.phone && (
                      <div>
                        <dt className="text-xs font-bold text-dark/75 uppercase">Phone</dt>
                        <dd>
                          <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="font-semibold text-azure underline">
                            {s.phone}
                          </a>
                        </dd>
                      </div>
                    )}
                    {Object.entries(s.details ?? {}).map(([k, v]) =>
                      (Array.isArray(v) ? v.length : v) ? (
                        <div key={k}>
                          <dt className="text-xs font-bold text-dark/75 uppercase">{labels[k] ?? k}</dt>
                          <dd className="text-dark">{Array.isArray(v) ? v.join(", ") : v}</dd>
                        </div>
                      ) : null,
                    )}
                  </dl>
                  {s.message && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-dark/75 uppercase">Message</p>
                      <p className="mt-1 whitespace-pre-line text-dark">{s.message}</p>
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${s.email}?subject=${encodeURIComponent("Re: your message to JA Zambia")}`}
                      className="inline-flex min-h-9 items-center rounded-full bg-azure px-4 text-sm font-bold text-white"
                    >
                      Reply by email
                    </a>
                    <form action={setSubmissionStatus.bind(null, s.id, s.status === "new" ? "handled" : "new")}>
                      <button className="min-h-9 rounded-full border-2 border-dark/15 px-4 text-sm font-bold text-dark hover:bg-pearl">
                        {s.status === "new" ? "Mark as handled" : "Mark as new"}
                      </button>
                    </form>
                    {role === "admin" && (
                      <form action={deleteSubmission.bind(null, s.id)} className="ml-auto">
                        <ConfirmButton small message="Delete this submission? This can't be undone.">
                          Delete
                        </ConfirmButton>
                      </form>
                    )}
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ul>

      {(count ?? 0) > PAGE_SIZE && (
        <nav className="mt-6 flex items-center gap-3" aria-label="Pages">
          {page > 1 && (
            <Link href={link({ page: String(page - 1) })} className={pill(false)}>
              ← Newer
            </Link>
          )}
          <span className="text-sm text-dark/75">
            Page {page} of {Math.ceil((count ?? 0) / PAGE_SIZE)}
          </span>
          {page * PAGE_SIZE < (count ?? 0) && (
            <Link href={link({ page: String(page + 1) })} className={pill(false)}>
              Older →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
