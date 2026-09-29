# Junior Achievement Zambia website

The new website for Junior Achievement Zambia, a member of JA Worldwide. **The Future Starts Here.**

Built with [Next.js](https://nextjs.org) and hosted on Vercel. Content will be stored in Supabase and edited through a private admin area.

## Build progress

| Stage | What                                                                           | Status          |
| ----- | ------------------------------------------------------------------------------ | --------------- |
| 1     | Foundations: brand colours, Montserrat font, logo, header, footer, mobile menu | Done            |
| 2     | Home page design (placeholder content)                                         | Done            |
| 3     | Content store (Supabase database + photo storage)                              | Done, connected |
| 4     | All public pages                                                               | Done            |
| 5     | Forms (contact, volunteer, partnership)                                        | Done            |
| 6     | Admin area with secure login and submissions dashboard                         | Done            |
| 7     | Load real content                                                              | By the team     |
| 8     | Polish, speed and accessibility testing, team guide                            | Done            |

## Where things live

- `src/app/`: the pages of the site (`page.tsx` in each folder is one page)
- `src/components/`: reusable building blocks (header, footer, buttons, cards)
- `src/content/placeholder.ts`: starter text and numbers, shown until Supabase is connected
- `src/lib/content.ts`: the one place pages read content from (Supabase when connected)
- `src/app/admin/`: the admin area (login, dashboard, editors, submissions, team access)
- `src/lib/admin/schema.ts`: what the admin area can edit, and each field's label and help text
- `supabase/migrations/`: the database design and security rules
- `supabase/seed.sql`: starter content for the database (generated with `npm run seed:generate`)
- `public/brand/`: official JA Zambia logo files (from the brand `.ai` file)
- `public/photos/`: photos. They are resized and converted to small modern formats automatically for each device.

## Connecting Supabase (one-time setup)

1. In [Supabase](https://supabase.com/dashboard), create a new project (name: `ja-zambia-website`, region: the closest to Zambia, e.g. **South Africa (Cape Town)** if offered, otherwise **Frankfurt**). Save the database password somewhere safe.
2. Open **SQL Editor → New query**, paste the whole of `supabase/migrations/0001_content_schema.sql` and click **Run**.
3. Open another new query, paste the whole of `supabase/seed.sql` and click **Run**.
4. In **Project Settings → Data API**, copy the **Project URL**. In **Project Settings → API Keys**, copy the **Publishable key** (starts with `sb_publishable_`, or use the older **anon public** key).
5. In **Vercel → the project → Settings → Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with those values, then redeploy.

Never share or add the **secret** / **service_role** key: the website doesn't need it.

Tip: some ways of copying cut long text off at around 5,000 characters. Before clicking **Run**, scroll to the end of the pasted text and check it matches the end of the file. If it doesn't, paste the file in smaller parts, splitting only between statements (after a `;`).

## Admin area

The admin area is at **/admin** on the website. Team members log in with an email and password.

**First-time setup (once):**

1. In Supabase, go to **Authentication → Users → Add user → Create new user**. Enter your email and a password, and tick **Auto Confirm User**.
2. In **SQL Editor → New query**, paste `supabase/migrations/0002_staff_access.sql` and run it, then paste `supabase/first-admin.sql` and run it. This makes that first login an admin.
3. Recommended: in **Authentication → Sign In / Providers**, turn off **Allow new users to sign up**. (Even if someone signs up, they can't see or change anything without being given access.)

**Adding a colleague:** create their login in Supabase (step 1 above), then give them access on the admin area's **Team access** page. **Editors** can edit everything and manage submissions; **admins** can also delete submissions and manage team access.

**Forgotten password:** an admin can set a new one in Supabase (**Authentication → Users → … → Reset password** or delete and re-create the user). Everyone can change their own password under **My account**.

Changes saved in the admin area appear on the website immediately.

## Form email alerts (optional)

Form submissions are always saved in Supabase (`form_submissions`). To also get an email for each one:

1. Create a free account at [resend.com](https://resend.com) **using info@jazambia.org** (until a domain is verified, Resend only delivers to the account's own address).
2. In Resend, go to **API Keys → Create API key** (permission: _Sending access_) and copy it.
3. In Vercel, add the environment variable `RESEND_API_KEY` with that key (and optionally `FORM_ALERT_EMAIL` if alerts should go somewhere other than info@jazambia.org), then redeploy.

Alerts come from `onboarding@resend.dev`; replying goes straight to the person who filled in the form. Once the jazambia.org domain is verified in Resend (later, when you're ready to touch domain settings), set `FORM_ALERT_FROM` to an address on your own domain.

## Going live on jazambia.org (later)

While the site is on its temporary Vercel address, search engines are asked **not** to list it, so it doesn't compete with the current jazambia.org. When you're ready to switch:

1. In **Vercel → Settings → Domains**, add `jazambia.org` (and `www.jazambia.org`) and follow Vercel's instructions for the DNS records. **This is the step that changes your domain settings; keep your email (MX) records exactly as they are.**
2. In **Vercel → Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` = `https://jazambia.org`, then redeploy. This lets Google list the site, and makes link previews and the sitemap use the real address.
3. Submit `https://jazambia.org/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

## Quality checks (Stage 8)

Tested on a simulated mid-range phone on slow 4G (Lighthouse): performance 95–100, accessibility 100, best practices 100, SEO 100 on the main pages, about 220–280 KB per page. No WCAG 2.1 AA issues found by axe on public pages or admin screens, on phone and desktop sizes.

## Brand

Colours and type follow the JA Worldwide Brand Guidelines 2026:
Transforming Teal `#008B9C`, Leadership Lime `#8FC440`, Immersive Blue-Black `#22404D` and Enterprise Aqua `#00C0CA`, plus the wider JA palette defined in `src/app/globals.css`. The typeface is Montserrat.

## For developers

```bash
npm install
npm run dev     # local preview at http://localhost:3000
npm run lint
npm run build
npm run test:db # checks database setup, security rules and team access
```
