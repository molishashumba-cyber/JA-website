import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/admin/auth";
import { getCollection } from "@/lib/admin/schema";
import { AdminPageTitle } from "../../AdminPageTitle";

export async function generateMetadata(props: PageProps<"/admin/content/[collection]">): Promise<Metadata> {
  const { collection } = await props.params;
  return { title: getCollection(collection)?.label ?? "Content" };
}

export default async function CollectionListPage(props: PageProps<"/admin/content/[collection]">) {
  const { collection: key } = await props.params;
  const { deleted } = await props.searchParams;
  const collection = getCollection(key);
  if (!collection) notFound();

  const { supabase } = await requireStaff();
  let query = supabase.from(collection.table).select("*");
  for (const o of collection.orderBy) query = query.order(o.column, { ascending: o.ascending, nullsFirst: true });
  const { data: rows, error } = await query.limit(500);

  const imageField = collection.fields.find((f) => f.type === "image");

  return (
    <>
      <AdminPageTitle
        title={collection.label}
        description={collection.description}
        actions={
          <Link
            href={`/admin/content/${collection.key}/new`}
            className="inline-flex min-h-11 items-center rounded-full bg-teal px-5 font-bold text-white hover:bg-teal-dark"
          >
            + Add {collection.singular}
          </Link>
        }
      />
      {deleted && <p className="mb-4 rounded-xl bg-lime/20 p-3 font-semibold text-dark ring-1 ring-lime">✓ Deleted.</p>}
      {error && <p className="rounded-xl bg-white p-4 text-dark">Couldn&apos;t load this list: {error.message}</p>}
      {rows && rows.length === 0 && (
        <p className="rounded-2xl bg-white p-6 text-dark/80 ring-1 ring-dark/10">
          Nothing here yet. Click <strong>Add {collection.singular}</strong> to create the first one.
        </p>
      )}
      <ul className="space-y-2">
        {rows?.map((row) => {
          const img = imageField ? (row[imageField.name] as string | null) : null;
          return (
            <li key={row.id}>
              <Link
                href={`/admin/content/${collection.key}/${row.id}`}
                className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-dark/10 hover:ring-2 hover:ring-teal"
              >
                {imageField && (
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-pearl">
                    {img && <Image src={img} alt="" fill sizes="56px" className="object-cover" unoptimized />}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-dark">
                    {String(row[collection.titleField] ?? "Untitled")}
                  </span>
                  {collection.subtitle && (
                    <span className="block truncate text-sm text-dark/60">{collection.subtitle(row)}</span>
                  )}
                </span>
                <span className="text-sm font-bold text-teal">Edit →</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
