// Checks the database setup and security rules against an in-memory Postgres.
// Run: npm run test:db
import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";
const R = new URL("../", import.meta.url).pathname;
const db = new PGlite();
// Minimal stand-ins for what Supabase provides
await db.exec(`
create role anon nologin; create role authenticated nologin;
create schema auth; create table auth.users (id uuid primary key, email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema auth to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;
create schema storage;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id uuid default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security;
`);
const run = async (f) => { await db.exec(fs.readFileSync(R + f, "utf8")); console.log("ran", f); };
await run("migrations/0001_content_schema.sql");
await run("migrations/0001_content_schema.sql"); // re-runnable
await run("migrations/0002_staff_access.sql");
await run("migrations/0002_staff_access.sql");
await db.exec(`grant usage on schema public to anon, authenticated; grant all on all tables in schema public to anon, authenticated;`);
await run("seed.sql"); await run("seed.sql");
const count = async (t) => (await db.query(`select count(*)::int n from ${t}`)).rows[0].n;
console.log("programs", await count("public.programs"), "stats", await count("public.stats"), "news", await count("public.news_posts"));

const staff = "11111111-1111-1111-1111-111111111111", stranger = "22222222-2222-2222-2222-222222222222";
await db.exec(`insert into auth.users values ('${staff}', 'admin@ja.org'), ('${stranger}', 'Colleague@ja.org'); insert into public.admin_users (user_id, email, role) values ('${staff}', 'a@b.c', 'admin');`);
async function as(role, sub, sql) {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${sub ?? ""}', false); set role ${role};`);
  try { const r = await db.query(sql); return r.rows ?? r; } catch (e) { return "ERROR: " + e.message; } finally { await db.exec("reset role"); }
}
const checks = [
  ["visitor reads programs", await as("anon", null, "select count(*)::int n from public.programs"), (r) => r[0].n === 9],
  ["visitor can't see draft news", await as("anon", null, "select count(*)::int n from public.news_posts"), (r) => r[0].n === 0],
  ["staff sees draft news", await as("authenticated", staff, "select count(*)::int n from public.news_posts"), (r) => r[0].n === 3],
  ["visitor submits form", await as("anon", null, "insert into public.form_submissions (form_type, name, email, message) values ('contact','A','a@b.c','hi')"), (r) => !String(r).startsWith("ERROR")],
  ["visitor can't read forms", await as("anon", null, "select count(*)::int n from public.form_submissions"), (r) => r[0].n === 0],
  ["visitor can't pre-mark handled", await as("anon", null, "insert into public.form_submissions (form_type, name, email, status) values ('contact','A','a@b.c','handled')"), (r) => String(r).startsWith("ERROR")],
  ["logged-in non-staff can't read forms", await as("authenticated", stranger, "select count(*)::int n from public.form_submissions"), (r) => r[0].n === 0],
  ["staff reads forms", await as("authenticated", staff, "select count(*)::int n from public.form_submissions"), (r) => r[0].n === 1],
  ["visitor can't edit programs", await as("anon", null, "update public.programs set name='x' returning id"), (r) => Array.isArray(r) && r.length === 0],
  ["non-staff can't insert programs", await as("authenticated", stranger, "insert into public.programs (slug, name) values ('x','x')"), (r) => String(r).startsWith("ERROR")],
  ["non-staff can't make self admin", await as("authenticated", stranger, `insert into public.admin_users (user_id, email) values ('${stranger}','x')`), (r) => String(r).startsWith("ERROR")],
  ["staff edits program", await as("authenticated", staff, "update public.programs set name='Cha-Ching!' where slug='cha-ching' returning updated_at"), (r) => Array.isArray(r) && r.length === 1],
  ["staff publishes news", await as("authenticated", staff, "update public.news_posts set published_at = now() - interval '1 minute' where slug='meet-the-team' returning id"), (r) => r.length === 1],
  ["visitor sees published news", await as("anon", null, "select slug from public.news_posts"), (r) => r.length === 1],
  ["scheduled post hidden", await as("authenticated", staff, "update public.news_posts set published_at = now() + interval '1 day' where slug='meet-the-team' returning id").then(() => as("anon", null, "select slug from public.news_posts")), (r) => r.length === 0],
  ["non-staff can't grant access", await as("authenticated", stranger, "select public.grant_staff_access('colleague@ja.org', 'admin')"), (r) => String(r).includes("Only admins")],
  ["visitor can't call grant", await as("anon", null, "select public.grant_staff_access('colleague@ja.org', 'admin')"), (r) => String(r).startsWith("ERROR")],
  ["admin grant: unknown email reported", await as("authenticated", staff, "select public.grant_staff_access('nobody@ja.org') as r"), (r) => r[0].r === "not_found"],
  ["admin grants editor (email case-insensitive)", await as("authenticated", staff, "select public.grant_staff_access(' colleague@JA.org ') as r"), (r) => r[0].r === "ok"],
  ["new editor can now read submissions", await as("authenticated", stranger, "select count(*)::int n from public.form_submissions"), (r) => r[0].n === 1],
  ["editor can't grant access", await as("authenticated", stranger, "select public.grant_staff_access('admin@ja.org', 'editor')"), (r) => String(r).includes("Only admins")],
  ["editor can't delete submissions", await as("authenticated", stranger, "delete from public.form_submissions returning id"), (r) => Array.isArray(r) && r.length === 0],
  ["admin can't remove own access", await as("authenticated", staff, `select public.remove_staff_access('${staff}')`), (r) => String(r).includes("own access")],
  ["admin removes editor", await as("authenticated", staff, `select public.remove_staff_access('${stranger}')`).then(() => as("authenticated", stranger, "select count(*)::int n from public.form_submissions")), (r) => r[0].n === 0],
  ["bad slug rejected", await as("authenticated", staff, "insert into public.programs (slug, name) values ('Bad Slug','x')"), (r) => String(r).startsWith("ERROR")],
];
let ok = true;
for (const [name, res, test] of checks) { let pass = false; try { pass = test(res); } catch {} ok &&= pass; console.log(pass ? "PASS" : "FAIL", name, pass ? "" : JSON.stringify(res)); }
console.log(ok ? "ALL PASSED" : "SOME FAILED");
process.exit(ok ? 0 : 1);
