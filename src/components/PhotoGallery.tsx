import Image from "next/image";
import type { Photo } from "@/lib/types";

// Photos load only as they scroll into view. Tapping one opens the full-size image.
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
      {photos.map((photo) => (
        <li key={photo.src} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-pearl">
          <a href={photo.src} target="_blank" rel="noopener noreferrer" aria-label={`Open photo: ${photo.alt}`}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              quality={60}
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
