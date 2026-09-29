import Image from "next/image";
import type { Partner } from "@/lib/types";

export function PartnerLogo({ partner }: { partner: Partner }) {
  if (!partner.logo) {
    return (
      <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-dark/15 px-2 text-center text-sm font-semibold text-dark/75">
        {partner.name}
      </div>
    );
  }

  const logo = (
    <div className="relative h-24 rounded-xl bg-white ring-1 ring-dark/10">
      <Image
        src={partner.logo}
        alt={partner.name}
        fill
        sizes="200px"
        unoptimized={partner.logo.endsWith(".svg")}
        className="object-contain p-4 grayscale transition hover:grayscale-0"
      />
    </div>
  );

  return partner.url ? (
    <a href={partner.url} target="_blank" rel="noopener noreferrer" aria-label={partner.name}>
      {logo}
    </a>
  ) : (
    logo
  );
}
