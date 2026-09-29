import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { savePage } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import * as placeholder from "@/content/placeholder";
import { requireStaff } from "@/lib/admin/auth";
import { getPage } from "@/lib/admin/schema";
import { getPath, toFormValue } from "@/lib/admin/values";
import { AdminPageTitle } from "../../AdminPageTitle";

export async function generateMetadata(props: PageProps<"/admin/pages/[key]">): Promise<Metadata> {
  const { key } = await props.params;
  return { title: getPage(key)?.label ?? "Page" };
}

const DEFAULTS: Record<string, object> = {
  home: placeholder.home,
  about: placeholder.about,
  impact: placeholder.impact,
  get_involved: placeholder.getInvolved,
  site: placeholder.site,
};

export default async function EditPagePage(props: PageProps<"/admin/pages/[key]">) {
  const { key } = await props.params;
  const page = getPage(key);
  if (!page) notFound();

  const { supabase } = await requireStaff();
  const { data: row } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
  const current = { ...DEFAULTS[key], ...(row?.value ?? {}) };
  const values = Object.fromEntries(page.fields.map((f) => [f.name, toFormValue(f, getPath(current, f.name))]));

  return (
    <>
      <AdminPageTitle
        title={page.label}
        description={page.description}
        actions={
          <Link href={page.publicPath} target="_blank" className="text-sm font-bold text-azure hover:underline">
            View on website ↗
          </Link>
        }
      />
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-dark/10 sm:p-6">
        <AdminForm fields={page.fields} values={values} action={savePage.bind(null, key)} />
      </div>
    </>
  );
}
