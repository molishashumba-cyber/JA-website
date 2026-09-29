import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProgramCard } from "@/components/ProgramCard";
import { getPrograms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Cha-Ching, the JA Company Program, Company of the Year, Girls LEAD Camp, Job Shadows, Innovation Camps and more: hands-on programs for young Zambians.",
};

export default async function ProgramsPage() {
  const programs = await getPrograms();
  return (
    <>
      <PageHero
        eyebrow="Our programs"
        title="Hands-on learning for every stage"
        text="Financial literacy, entrepreneurship and work readiness, delivered with volunteers from the business world."
      />
      <section className="bg-pearl py-14 sm:py-20">
        <ul className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {programs.map((program) => (
            <li key={program.slug}>
              <ProgramCard program={program} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
