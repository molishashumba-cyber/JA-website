import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
};

export function AdminPageTitle({ title, description, back, actions }: Props) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="text-sm font-bold text-teal hover:underline">
          ← {back.label}
        </Link>
      )}
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-dark/70">{description}</p>}
        </div>
        {actions}
      </div>
    </div>
  );
}
