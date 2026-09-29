// Single place the website reads its content from.
// For now it returns starter content; in Stage 3 these functions will
// read from Supabase instead, so pages won't need to change.

import * as placeholder from "@/content/placeholder";

export async function getSiteSettings() {
  return placeholder.site;
}

export async function getHomeContent() {
  return placeholder.home;
}

export async function getPrograms() {
  return placeholder.programs;
}

export async function getProgram(slug: string) {
  return placeholder.programs.find((p) => p.slug === slug);
}

export async function getLatestNews(limit = 3) {
  return placeholder.news.slice(0, limit);
}

export async function getPartners() {
  return placeholder.partners;
}
