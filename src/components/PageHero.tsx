import Image from "next/image";
import { BirdSymbol } from "@/components/BirdSymbol";
import type { Photo } from "@/lib/types";

type Props = {
  eyebrow: string;
  title: string;
  text?: string;
  photo?: Photo;
  children?: React.ReactNode;
};

export function PageHero({ eyebrow, title, text, photo, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-dark text-white">
      {photo ? (
        <>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            preload
            sizes="100vw"
            quality={60}
            className="-z-20 object-cover object-[center_25%]"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-t from-dark via-dark/75 to-dark/30 md:bg-gradient-to-r md:from-dark md:via-dark/80 md:to-dark/20"
            aria-hidden="true"
          />
        </>
      ) : (
        <BirdSymbol color="#285f74" className="absolute -top-10 -right-16 -z-10 hidden h-72 w-auto sm:block" />
      )}
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 ${photo ? "flex min-h-[420px] flex-col justify-end pt-24 pb-12 sm:min-h-[480px] sm:pb-16" : "py-14 sm:py-20"}`}
      >
        <p className="text-sm font-bold tracking-widest text-lime uppercase">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-4xl leading-tight font-extrabold sm:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-lg text-white/90">{text}</p>}
        {children}
      </div>
    </section>
  );
}
