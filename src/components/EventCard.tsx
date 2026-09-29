import Link from "next/link";
import { dayAndMonth, formatEventDate } from "@/lib/dates";
import type { JAEvent } from "@/lib/types";

export function EventCard({ event }: { event: JAEvent }) {
  const { day, month } = dayAndMonth(event.startsAt);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-dark/10 transition hover:shadow-lg sm:p-5"
    >
      <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl bg-azure text-white">
        <span className="text-2xl leading-none font-extrabold">{day}</span>
        <span className="text-xs font-bold uppercase">{month}</span>
      </div>
      <div>
        <h3 className="text-lg leading-snug font-extrabold text-dark group-hover:text-azure">{event.title}</h3>
        <p className="mt-1 text-sm font-semibold text-dark/80">
          {formatEventDate(event.startsAt, event.endsAt)}
          {event.location && ` · ${event.location}`}
        </p>
        {event.summary && <p className="mt-2 text-dark/75">{event.summary}</p>}
      </div>
    </Link>
  );
}
