import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteItem, saveItem } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { requireStaff } from "@/lib/admin/auth";
import { getCollection } from "@/lib/admin/schema";
import { toFormValue } from "@/lib/admin/values";
import { AdminPageTitle } from "../../../AdminPageTitle";

export const metadata: Metadata = { title: "Edit" };

export default async function EditItemPage(props: PageProps<"/admin/content/[collection]/[id]">) {
  const { collection: key, id } = await props.params;
  const { created } = await props.searchParams;
  const collection = getCollection(key);
  if (!collection) notFound();

  const { supabase } = await requireStaff();
  const { data: row } = await supabase.from(collection.table).select("*").eq("id", id).maybeSingle();
  if (!row) notFound();

  const values = Object.fromEntries(collection.fields.map((f) => [f.name, toFormValue(f, row[f.name], row)]));
  const publicPath = collection.publicPath?.(row);

  return (
    <>
      <AdminPageTitle
        title={String(row[collection.titleField] || `Edit ${collection.singular}`)}
        back={{ href: `/admin/content/${collection.key}`, label: collection.label }}
        actions={
          publicPath && (
            <Link href={publicPath} target="_blank" className="text-sm font-bold text-azure hover:underline">
              View on website ↗
            </Link>
          )
        }
      />
      {created && (
        <p className="mb-4 rounded-xl bg-lime/20 p-3 font-semibold text-dark ring-1 ring-lime">
          ✓ Created. It&apos;s now on the website
          {collection.fields.some((f) => f.name === "published_at") ? " if it has a publish date" : ""}.
        </p>
      )}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-dark/10 sm:p-6">
        <AdminForm fields={collection.fields} values={values} action={saveItem.bind(null, collection.key, id)} />
      </div>
      <form action={deleteItem.bind(null, collection.key, id)} className="mt-8">
        <ConfirmButton message={`Delete this ${collection.singular}? This can't be undone.`}>
          Delete this {collection.singular}
        </ConfirmButton>
      </form>
    </>
  );
}
