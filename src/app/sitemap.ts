import type { MetadataRoute } from "next";
import { getEvents, getLatestNews, getPrograms } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";

// A list of every public page, to help Google find them. Updates as content changes.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programs, news, events] = await Promise.all([getPrograms(), getLatestNews(500), getEvents()]);
  const page = (path: string, priority: number, lastModified?: string) => ({
    url: `${siteUrl}${path}`,
    priority,
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    page("/", 1),
    page("/about", 0.8),
    page("/programs", 0.9),
    ...programs.map((p) => page(`/programs/${p.slug}`, 0.8)),
    page("/impact", 0.7),
    page("/get-involved", 0.9),
    page("/get-involved/partner", 0.7),
    page("/get-involved/volunteer", 0.7),
    page("/news", 0.7),
    ...news.map((n) => page(`/news/${n.slug}`, 0.6, n.date)),
    page("/events", 0.7),
    ...[...events.upcoming, ...events.past].map((e) => page(`/events/${e.slug}`, 0.6)),
    page("/contact", 0.6),
  ];
}
