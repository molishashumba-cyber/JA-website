// Generates supabase/seed.sql from the starter content in src/content/placeholder.ts.
// Run: node scripts/generate-seed.mts > supabase/seed.sql
import { home, news, programs, site } from "../src/content/placeholder.ts";

const q = (v: unknown) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const json = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;
const out: string[] = [
  "-- Starter content for the JA Zambia website. Safe to run more than once:",
  "-- it only adds rows that don't exist yet and never overwrites your edits.",
  "",
];

const { stats, ...homeBlocks } = home;
out.push(
  `insert into public.settings (key, value) values`,
  `  ('site', ${json(site)}),`,
  `  ('home', ${json(homeBlocks)})`,
  `on conflict (key) do nothing;`,
  "",
);

out.push(
  `insert into public.stats (value, label, sort_order)`,
  `select * from (values`,
  stats.map((s, i) => `  (${q(s.value)}, ${q(s.label)}, ${i})`).join(",\n"),
  `) as v(value, label, sort_order)`,
  `where not exists (select 1 from public.stats);`,
  "",
);

out.push(
  `insert into public.programs (slug, name, audience, summary, accent, photo_url, photo_alt, sort_order) values`,
  programs
    .map(
      (p, i) =>
        `  (${q(p.slug)}, ${q(p.name)}, ${q(p.audience)}, ${q(p.summary)}, ${q(p.accent)}, ${q(p.photo?.src)}, ${q(p.photo?.alt ?? "")}, ${i})`,
    )
    .join(",\n"),
  `on conflict (slug) do nothing;`,
  "",
);

out.push(
  `-- Sample news posts are added as drafts (not visible on the site) so they`,
  `-- can be used as examples in the admin area.`,
  `insert into public.news_posts (slug, title, excerpt, category, photo_url, photo_alt, published_at) values`,
  news
    .map(
      (n) =>
        `  (${q(n.slug)}, ${q(n.title)}, ${q(n.excerpt)}, ${q(n.category)}, ${q(n.photo.src)}, ${q(n.photo.alt)}, null)`,
    )
    .join(",\n"),
  `on conflict (slug) do nothing;`,
  "",
);

console.log(out.join("\n"));
