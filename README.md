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
| 6     | Admin area with secure login and submissions dashboard                         |                 |
| 7     | Load real content                                                              |                 |
| 8     | Polish, speed and accessibility testing, team guide                            |                 |

## Where things live

- `src/app/`: the pages of the site (`page.tsx` in each folder is one page)
- `src/components/`: reusable building blocks (header, footer, buttons, cards)
- `src/content/placeholder.ts`: starter text and numbers, shown until Supabase is connected
- `src/lib/content.ts`: the one place pages read content from (Supabase when connected)
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

## Form email alerts (optional)

Form submissions are always saved in Supabase (`form_submissions`). To also get an email for each one:

1. Create a free account at [resend.com](https://resend.com) **using info@jazambia.org** (until a domain is verified, Resend only delivers to the account's own address).
2. In Resend, go to **API Keys → Create API key** (permission: _Sending access_) and copy it.
3. In Vercel, add the environment variable `RESEND_API_KEY` with that key (and optionally `FORM_ALERT_EMAIL` if alerts should go somewhere other than info@jazambia.org), then redeploy.

Alerts come from `onboarding@resend.dev`; replying goes straight to the person who filled in the form. Once the jazambia.org domain is verified in Resend (later, when you're ready to touch domain settings), set `FORM_ALERT_FROM` to an address on your own domain.

## Brand

Colours and type follow the JA Worldwide Brand Guidelines 2026:
Transforming Teal `#008B9C`, Leadership Lime `#8FC440`, Immersive Blue-Black `#22404D` and Enterprise Aqua `#00C0CA`, plus the wider JA palette defined in `src/app/globals.css`. The typeface is Montserrat.

## For developers

```bash
npm install
npm run dev     # local preview at http://localhost:3000
npm run lint
npm run build
npm run test:db # checks database setup and security rules
```
