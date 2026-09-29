import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { PersonCard } from "@/components/PersonCard";
import { Prose } from "@/components/Prose";
import { SectionHeading } from "@/components/SectionHeading";
import { getAboutContent, getPeople } from "@/lib/content";

export const metadata: Metadata = {
  title: "About us",
  description: "Our story, mission, vision and the people behind Junior Achievement Zambia.",
};

export default async function AboutPage() {
  const [about, team, board] = await Promise.all([getAboutContent(), getPeople("team"), getPeople("board")]);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Twenty years of inspiring young Zambians"
        text={about.intro}
        photo={{ src: "/photos/team-and-board.jpg", alt: "JA Zambia staff and board members" }}
      />

      {/* Our story */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading eyebrow="Our story" title="Part of a global movement, rooted in Zambia" />
            <Prose text={about.story} className="mt-6" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src={about.storyPhoto.src}
              alt={about.storyPhoto.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={60}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="bg-dark py-16 text-white sm:py-24" aria-labelledby="mission-heading">
        <h2 id="mission-heading" className="sr-only">
          Mission and vision
        </h2>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2">
          <div className="rounded-3xl bg-teal p-8 sm:p-10">
            <p className="text-sm font-bold tracking-widest uppercase">Our mission</p>
            <p className="mt-3 text-2xl leading-snug font-extrabold sm:text-3xl">{about.mission}</p>
          </div>
          <div className="rounded-3xl bg-lime p-8 text-dark sm:p-10">
            <p className="text-sm font-bold tracking-widest uppercase">Our vision</p>
            <p className="mt-3 text-2xl leading-snug font-extrabold sm:text-3xl">{about.vision}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-pearl py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Our values"
            title="How we work"
            text="Shared by every JA organisation around the world."
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {about.values.map((value, i) => (
              <li key={value} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-dark/10">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-aqua font-extrabold text-dark"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p className="font-semibold text-dark">{value}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section id="team" className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Our team" title="The people who make it happen" />
            <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {team.map((person, i) => (
                <li key={`${person.name}-${i}`}>
                  <PersonCard person={person} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Board */}
      {board.length > 0 && (
        <section id="board" className="bg-pearl py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Board of directors" title="Guided by leaders from across Zambia" />
            <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {board.map((person, i) => (
                <li key={`${person.name}-${i}`}>
                  <PersonCard person={person} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Alumni */}
      <section id="alumni" className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
          <div className="relative order-last aspect-[4/3] overflow-hidden rounded-3xl md:order-first">
            <Image
              src="/photos/camp-friends.jpg"
              alt="Young people together on a bridge at a JA camp"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={60}
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading eyebrow="Alumni" title="Once JA, always JA" text={about.alumniText} />
            <Button href={about.alumniUrl} variant="teal" className="mt-8">
              Join Gather, the JA alumni network
            </Button>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
