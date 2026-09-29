import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveItem } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { requireStaff } from "@/lib/admin/auth";
import { getCollection } from "@/lib/admin/schema";
import { toFormValue } from "@/lib/admin/values";
import { AdminPageTitle } from "../../../AdminPageTitle";

export const metadata: Metadata = { title: "Add" };

const DEFAULTS: Record<string, unknown> = { published: true, accent: "teal", person_group: "team", sort_order: 0 };

export default async function NewItemPage(props: PageProps<"/admin/content/[collection]/new">) {
  const { collection: key } = await props.params;
  const collection = getCollection(key);
  if (!collection) notFound();
  await requireStaff();

  const values = Object.fromEntries(collection.fields.map((f) => [f.name, toFormValue(f, DEFAULTS[f.name])]));

  return (
    <>
      <AdminPageTitle
        title={`Add ${collection.singular}`}
        back={{ href: `/admin/content/${collection.key}`, label: collection.label }}
      />
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-dark/10 sm:p-6">
        <AdminForm
          fields={collection.fields}
          values={values}
          action={saveItem.bind(null, collection.key, null)}
          submitLabel={`Create ${collection.singular}`}
        />
      </div>
    </>
  );
}
