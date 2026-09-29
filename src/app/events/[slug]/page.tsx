import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { Prose } from "@/components/Prose";
import { formatEventDate } from "@/lib/dates";
import { getEvent, getEvents } from "@/lib/content";

export async function generateStaticParams() {
  const { upcoming, past } = await getEvents();
  return [...upcoming, ...past].map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(props: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getEvent(slug);
  return { title: event?.title ?? "Event", description: event?.summary };
}

export default async function EventPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = await getEvent(slug);
  if (!event) notFound();

  return (
    <>
      <PageHero eyebrow="Event" title={event.title} text={event.summary} photo={event.photo}>
        <p className="mt-4 font-bold text-lime">
          {formatEventDate(event.startsAt, event.endsAt)}
          {event.location && ` · ${event.location}`}
        </p>
        {event.registrationUrl && (
          <Button href={event.registrationUrl} className="mt-6">
            Register
          </Button>
        )}
      </PageHero>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Prose text={event.body} />
        <Button href="/events" variant="outlineDark" className="mt-10">
          ← All events
        </Button>
      </div>
    </>
  );
}
