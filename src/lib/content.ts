// Single place the website reads its content from.
// When Supabase is connected (environment variables set), content comes from
// the database the admin area edits. Until then, starter content is shown.

import * as placeholder from "@/content/placeholder";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import type { HomeContent, NewsPost, Partner, Photo, Program, SiteSettings } from "@/lib/types";

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
};

const programColumns = "slug, name, audience, summary, accent, photo_url, photo_alt";

function toProgram(row: ProgramRow): Program {
  return {
    slug: row.slug,
    name: row.name,
    audience: row.audience,
    summary: row.summary,
    accent: row.accent,
    photo: photo(row.photo_url, row.photo_alt),
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
};

function toNewsPost(row: NewsRow): NewsPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.published_at,
    photo: photo(row.photo_url, row.photo_alt) ?? FALLBACK_PHOTO,
  };
}

const newsColumns = "slug, title, excerpt, category, photo_url, photo_alt, published_at";

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
    await db.from("news_posts").select(newsColumns).eq("slug", slug).not("published_at", "is", null).maybeSingle(),
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
