import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { EventCard } from "@/components/EventCard";
import { PageHero } from "@/components/PageHero";
import { ProgramCard } from "@/components/ProgramCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getEvents, getPrograms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Company of the Year, Girls LEAD Camp and other Junior Achievement Zambia events.",
};

// Programs that are also annual events, shown as "signature events".
const SIGNATURE = ["company-of-the-year", "girls-lead-camp", "innovation-camps"];

export default async function EventsPage() {
  const [{ upcoming, past }, programs] = await Promise.all([getEvents(), getPrograms()]);
  const signature = programs.filter((p) => SIGNATURE.includes(p.slug));

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Company of the Year, LEAD Camp and more"
        text="Competitions, camps and celebrations where young people put their skills on show."
        photo={{ src: "/photos/coy-stage.jpg", alt: "Students presenting on stage at Company of the Year" }}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading eyebrow="Coming up" title="Upcoming events" />
          {upcoming.length > 0 ? (
            <ul className="mt-8 space-y-4">
              {upcoming.map((event) => (
                <li key={event.slug}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 rounded-2xl bg-pearl p-6 text-lg text-dark/80">
              Dates for our next events will be announced soon. Follow us on social media or contact us to hear first.
            </p>
          )}
        </div>
      </section>

      {signature.length > 0 && (
        <section className="bg-pearl py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Signature events" title="The highlights of the JA year" />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {signature.map((p) => (
                <li key={p.slug}>
                  <ProgramCard program={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <SectionHeading eyebrow="Past events" title="Recently" />
            <ul className="mt-8 space-y-4">
              {past.map((event) => (
                <li key={event.slug}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title="Sponsor or volunteer at an event" />
    </>
  );
}
