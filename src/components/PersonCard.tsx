import Image from "next/image";
import type { Person } from "@/lib/types";

export function PersonCard({ person }: { person: Person }) {
  const initials = person.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-dark/10">
      <div className="relative aspect-[4/5] bg-ice">
        {person.photo ? (
          <Image
            src={person.photo.src}
            alt={person.photo.alt}
            fill
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
            quality={60}
            className="object-cover object-top"
          />
        ) : (
          <span
            className="flex size-full items-center justify-center text-4xl font-extrabold text-teal"
            aria-hidden="true"
          >
            {initials}
          </span>
        )}
        {person.sample && (
          <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-dark">
            Sample
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg leading-snug font-extrabold text-dark">{person.name}</h3>
        <p className="text-sm font-semibold text-azure">{person.role}</p>
        {person.bio && <p className="mt-2 text-sm text-dark/75">{person.bio}</p>}
      </div>
    </div>
  );
}
