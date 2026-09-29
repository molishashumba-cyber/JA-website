import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ProgramCard } from "@/components/ProgramCard";
import { Prose } from "@/components/Prose";
import { SectionHeading } from "@/components/SectionHeading";
import { getProgram, getPrograms } from "@/lib/content";

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const program = await getProgram(slug);
  return { title: program?.name ?? "Program", description: program?.summary };
}

export default async function ProgramPage(props: PageProps<"/programs/[slug]">) {
  const { slug } = await props.params;
  const [program, programs] = await Promise.all([getProgram(slug), getPrograms()]);
  if (!program) notFound();

  const others = programs.filter((p) => p.slug !== program.slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow={program.audience} title={program.name} text={program.summary} photo={program.photo} />

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="About the program" title={`What happens in ${program.name}`} />
            {program.body ? (
              <Prose text={program.body} className="mt-6" />
            ) : (
              <p className="mt-6 text-lg text-dark/75">{program.summary}</p>
            )}
          </div>

          <aside className="h-fit rounded-3xl bg-pearl p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-dark">Bring {program.name} to more young people</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-xs font-bold tracking-widest text-teal uppercase">Who it&apos;s for</dt>
                <dd className="font-semibold text-dark">{program.audience}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-col gap-3">
              <Button href="/get-involved/partner" variant="teal">
                Sponsor this program
              </Button>
              <Button href="/get-involved/volunteer" variant="outlineDark">
                Volunteer
              </Button>
              <Button href="/contact?topic=school" variant="outlineDark">
                Bring it to my school
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {program.gallery && program.gallery.length > 0 && (
        <section className="pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-6 text-2xl font-extrabold text-dark">In pictures</h2>
            <PhotoGallery photos={program.gallery} />
          </div>
        </section>
      )}

      <section className="bg-pearl py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="More programs" title="Explore other JA programs" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.slug}>
                <ProgramCard program={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
