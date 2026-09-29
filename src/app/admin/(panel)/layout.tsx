import Link from "next/link";
import { Logo } from "@/components/Logo";
import { requireStaff } from "@/lib/admin/auth";
import { collections, pages } from "@/lib/admin/schema";
import { signOut } from "../actions";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const { user, role } = await requireStaff();

  const groups = [
    {
      title: "Overview",
      links: [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/submissions", label: "Form submissions" },
      ],
    },
    { title: "Pages", links: pages.map((p) => ({ href: `/admin/pages/${p.key}`, label: p.label })) },
    { title: "Lists", links: collections.map((c) => ({ href: `/admin/content/${c.key}`, label: c.label })) },
    {
      title: "Settings",
      links: [
        ...(role === "admin" ? [{ href: "/admin/team", label: "Team access" }] : []),
        { href: "/admin/account", label: "My account" },
      ],
    },
  ];

  const nav = (
    <nav aria-label="Admin" className="space-y-5">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="px-3 text-xs font-bold tracking-widest text-dark/50 uppercase">{g.title}</p>
          <ul className="mt-1">
            {g.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex min-h-10 items-center rounded-lg px-3 font-semibold text-dark hover:bg-pearl hover:text-teal"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-dark/10 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <span className="rounded-full bg-dark px-2 py-0.5 text-xs font-bold text-white">Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden min-h-10 items-center rounded-full px-3 text-sm font-bold text-teal hover:bg-pearl sm:inline-flex"
            >
              View website ↗
            </Link>
            <form action={signOut}>
              <button className="min-h-10 rounded-full border-2 border-dark/15 px-4 text-sm font-bold text-dark hover:bg-pearl">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-6 lg:py-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-20 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-dark/10">{nav}</div>
        </aside>
        <div className="min-w-0 flex-1">
          <details className="mb-4 rounded-2xl bg-white shadow-sm ring-1 ring-dark/10 lg:hidden">
            <summary className="flex min-h-12 cursor-pointer items-center px-4 font-bold text-dark">☰ Menu</summary>
            <div className="border-t border-dark/10 p-3">{nav}</div>
          </details>
          {children}
          <p className="mt-10 text-sm text-dark/50">
            Logged in as {user.email} ({role})
          </p>
        </div>
      </div>
    </>
  );
}
