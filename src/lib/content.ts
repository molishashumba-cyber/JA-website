// Single place the website reads its content from.
// When Supabase is connected (environment variables set), content comes from
// the database the admin area edits. Until then, starter content is shown.
// Page text blocks fall back to starter text for any field not yet filled in,
// and team members / impact stories show samples until real ones are added.

import * as placeholder from "@/content/placeholder";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  AboutContent,
  GetInvolvedContent,
  HomeContent,
  ImpactContent,
  ImpactStory,
  JAEvent,
  NewsPost,
  Partner,
  Person,
  Photo,
  Program,
  SiteSettings,
} from "@/lib/types";

const FALLBACK_PHOTO: Photo = placeholder.home.hero.photo;

function photo(url: string | null, alt: string): Photo | undefined {
  return url ? { src: url, alt } : undefined;
}

function check<T>(result: { data: T | null; error: { message: string } | null }, what: string): T {
  if (result.error) throw new Error(`Could not load ${what}: ${result.error.message}`);
  return result.data as T;
}

async function getSetting<T extends object>(key: string, defaults: T): Promise<T> {
  const db = createPublicClient();
  const row = check<{ value: unknown } | null>(
    await db.from("settings").select("value").eq("key", key).maybeSingle(),
    `setting "${key}"`,
  );
  return { ...defaults, ...((row?.value as Partial<T>) ?? {}) };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return placeholder.site;
  return getSetting("site", placeholder.site);
}

export async function getHomeContent(): Promise<HomeContent> {
  if (!isSupabaseConfigured) return placeholder.home;
  const db = createPublicClient();
  const [home, stats] = await Promise.all([
    getSetting<Omit<HomeContent, "stats">>("home", placeholder.home),
    db.from("stats").select("value, label").order("sort_order"),
  ]);
  return { ...home, stats: check(stats, "stats") ?? [] };
}

type ProgramRow = {
  slug: string;
  name: string;
  audience: string;
  summary: string;
  accent: Program["accent"];
  photo_url: string | null;
  photo_alt: string;
  body: string;
};

const programColumns = "slug, name, audience, summary, accent, photo_url, photo_alt, body";

function toProgram(row: ProgramRow): Program {
  const starter = placeholder.programs.find((p) => p.slug === row.slug);
  return {
    slug: row.slug,
    name: row.name,
    audience: row.audience,
    summary: row.summary,
    accent: row.accent,
    photo: photo(row.photo_url, row.photo_alt),
    body: row.body || starter?.body,
    // Program photo galleries aren't editable yet; they come from the starter content.
    gallery: starter?.gallery,
  };
}

export async function getPrograms(): Promise<Program[]> {
  if (!isSupabaseConfigured) return placeholder.programs;
  const db = createPublicClient();
  const rows = check(
    await db.from("programs").select(programColumns).eq("published", true).order("sort_order"),
    "programs",
  );
  return (rows as ProgramRow[]).map(toProgram);
}

export async function getProgram(slug: string): Promise<Program | undefined> {
  if (!isSupabaseConfigured) return placeholder.programs.find((p) => p.slug === slug);
  const db = createPublicClient();
  const row = check(
    await db.from("programs").select(programColumns).eq("slug", slug).eq("published", true).maybeSingle(),
    "program",
  );
  return row ? toProgram(row as ProgramRow) : undefined;
}

type NewsRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  photo_url: string | null;
  photo_alt: string;
  published_at: string;
  body?: string;
};

function toNewsPost(row: NewsRow): NewsPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.published_at,
    photo: photo(row.photo_url, row.photo_alt) ?? FALLBACK_PHOTO,
    body: row.body,
  };
}

const newsColumns = "slug, title, excerpt, category, photo_url, photo_alt, published_at";

// Latest published posts (newest first). Also used for the full news list.
export async function getLatestNews(limit = 3): Promise<NewsPost[]> {
  if (!isSupabaseConfigured) return placeholder.news.slice(0, limit);
  const db = createPublicClient();
  // Security rules only return posts whose publish date has passed.
  const rows = check(
    await db
      .from("news_posts")
      .select(newsColumns)
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(limit),
    "news",
  );
  return (rows as NewsRow[]).map(toNewsPost);
}

export async function getNewsPost(slug: string): Promise<NewsPost | undefined> {
  if (!isSupabaseConfigured) return placeholder.news.find((p) => p.slug === slug);
  const db = createPublicClient();
  const row = check(
    await db
      .from("news_posts")
      .select(`${newsColumns}, body`)
      .eq("slug", slug)
      .not("published_at", "is", null)
      .maybeSingle(),
    "news post",
  );
  return row ? toNewsPost(row as NewsRow) : undefined;
}

export async function getPartners(): Promise<Partner[]> {
  if (!isSupabaseConfigured) return placeholder.partners;
  const db = createPublicClient();
  const rows = check(
    await db.from("partners").select("name, logo_url, website_url").eq("published", true).order("sort_order"),
    "partners",
  );
  return (rows as { name: string; logo_url: string | null; website_url: string | null }[]).map((r) => ({
    name: r.name,
    logo: r.logo_url ?? undefined,
    url: r.website_url ?? undefined,
  }));
}

export async function getAboutContent(): Promise<AboutContent> {
  if (!isSupabaseConfigured) return placeholder.about;
  return getSetting("about", placeholder.about);
}

export async function getImpactContent(): Promise<ImpactContent> {
  if (!isSupabaseConfigured) return placeholder.impact;
  return getSetting("impact", placeholder.impact);
}

export async function getGetInvolvedContent(): Promise<GetInvolvedContent> {
  if (!isSupabaseConfigured) return placeholder.getInvolved;
  return getSetting("get_involved", placeholder.getInvolved);
}

type PersonRow = {
  name: string;
  role: string;
  bio: string;
  photo_url: string | null;
  person_group: Person["group"];
};

export async function getPeople(group: Person["group"]): Promise<Person[]> {
  const samples = placeholder.people.filter((p) => p.group === group);
  if (!isSupabaseConfigured) return samples;
  const db = createPublicClient();
  const rows = check(
    await db
      .from("people")
      .select("name, role, bio, photo_url, person_group")
      .eq("person_group", group)
      .eq("published", true)
      .order("sort_order"),
    "people",
  ) as PersonRow[];
  if (rows.length === 0) return samples;
  return rows.map((r) => ({
    name: r.name,
    role: r.role,
    bio: r.bio,
    photo: photo(r.photo_url, r.name),
    group: r.person_group,
  }));
}

type StoryRow = {
  title: string;
  quote: string;
  person: string;
  body: string;
  photo_url: string | null;
  photo_alt: string;
  video_url: string | null;
};

export async function getImpactStories(): Promise<ImpactStory[]> {
  if (!isSupabaseConfigured) return placeholder.impactStories;
  const db = createPublicClient();
  const rows = check(
    await db
      .from("impact_stories")
      .select("title, quote, person, body, photo_url, photo_alt, video_url")
      .eq("published", true)
      .order("sort_order"),
    "impact stories",
  ) as StoryRow[];
  if (rows.length === 0) return placeholder.impactStories;
  return rows.map((r) => ({
    title: r.title,
    quote: r.quote,
    person: r.person,
    body: r.body,
    photo: photo(r.photo_url, r.photo_alt),
    videoUrl: r.video_url ?? undefined,
  }));
}

type EventRow = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  location: string;
  starts_at: string;
  ends_at: string | null;
  registration_url: string | null;
  photo_url: string | null;
  photo_alt: string;
};

const eventColumns = "slug, title, summary, body, location, starts_at, ends_at, registration_url, photo_url, photo_alt";

function toEvent(r: EventRow): JAEvent {
  return {
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    body: r.body,
    location: r.location,
    startsAt: r.starts_at,
    endsAt: r.ends_at ?? undefined,
    registrationUrl: r.registration_url ?? undefined,
    photo: photo(r.photo_url, r.photo_alt),
  };
}

// Events that haven't finished yet, soonest first; plus the most recent past events.
export async function getEvents(): Promise<{ upcoming: JAEvent[]; past: JAEvent[] }> {
  if (!isSupabaseConfigured) return { upcoming: [], past: [] };
  const db = createPublicClient();
  // Rounded to the hour so the cached query stays stable between visits.
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const [upcoming, past] = await Promise.all([
    db.from("events").select(eventColumns).eq("published", true).gte("starts_at", cutoff).order("starts_at"),
    db
      .from("events")
      .select(eventColumns)
      .eq("published", true)
      .lt("starts_at", cutoff)
      .order("starts_at", { ascending: false })
      .limit(6),
  ]);
  return {
    upcoming: (check(upcoming, "events") as EventRow[]).map(toEvent),
    past: (check(past, "past events") as EventRow[]).map(toEvent),
  };
}

export async function getEvent(slug: string): Promise<JAEvent | undefined> {
  if (!isSupabaseConfigured) return undefined;
  const db = createPublicClient();
  const row = check(
    await db.from("events").select(eventColumns).eq("slug", slug).eq("published", true).maybeSingle(),
    "event",
  );
  return row ? toEvent(row as EventRow) : undefined;
}
