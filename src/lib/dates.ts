// Dates are shown in Zambian time (Central Africa Time).
const TZ = "Africa/Lusaka";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: TZ });
}

export function formatEventDate(startsAt: string, endsAt?: string) {
  const start = new Date(startsAt);
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  };
  const startText = start.toLocaleDateString("en-GB", opts);
  if (!endsAt) return startText;
  const end = new Date(endsAt);
  const sameDay =
    end.toLocaleDateString("en-GB", { timeZone: TZ }) === start.toLocaleDateString("en-GB", { timeZone: TZ });
  return sameDay ? startText : `${startText} – ${end.toLocaleDateString("en-GB", opts)}`;
}

export function dayAndMonth(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-GB", { day: "numeric", timeZone: TZ }),
    month: d.toLocaleDateString("en-GB", { month: "short", timeZone: TZ }),
  };
}
