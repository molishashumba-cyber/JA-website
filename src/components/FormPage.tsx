import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { SiteForm } from "@/components/SiteForm";
import type { FormType } from "@/lib/forms";
import type { Photo } from "@/lib/types";

type Props = {
  type: FormType;
  eyebrow: string;
  title: string;
  intro: string;
  photo: Photo;
  points: string[];
};

// Layout for the Volunteer and Partner sign-up pages.
export function FormPage({ type, eyebrow, title, intro, photo, points }: Props) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={intro} />
      <section className="py-12 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <SiteForm type={type} />
          </div>
          <aside className="space-y-6 lg:col-span-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                quality={60}
                className="object-cover"
              />
            </div>
            <div className="rounded-3xl bg-pearl p-6">
              <h2 className="text-lg font-extrabold text-dark">What happens next?</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-dark/80">
                {points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
