import Link from "next/link";
import type { Program } from "@/lib/types";

const accents: Record<Program["accent"], string> = {
  teal: "bg-teal",
  lime: "bg-lime",
  aqua: "bg-aqua",
  azure: "bg-azure",
  jade: "bg-jade",
  yellow: "bg-yellow",
};

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-dark/10 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-teal/40"
    >
      <span className={`absolute inset-x-0 top-0 h-1.5 ${accents[program.accent]}`} aria-hidden="true" />
      <span className="text-xs font-bold tracking-widest text-azure uppercase">{program.audience}</span>
      <h3 className="mt-2 text-xl font-extrabold text-dark">{program.name}</h3>
      <p className="mt-2 flex-1 text-dark/75">{program.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-azure group-hover:gap-2">
        Learn more <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
