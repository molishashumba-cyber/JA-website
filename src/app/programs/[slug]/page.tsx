import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";
import { getProgram, getPrograms } from "@/lib/content";

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const program = await getProgram(slug);
  return { title: program?.name ?? "Program" };
}

export default async function ProgramPage(props: PageProps<"/programs/[slug]">) {
  const { slug } = await props.params;
  const program = await getProgram(slug);
  if (!program) notFound();

  return (
    <>
      <PageHero eyebrow={program.audience} title={program.name} text={program.summary} />
      <ComingSoon />
    </>
  );
}
