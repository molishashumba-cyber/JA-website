# Junior Achievement Zambia website

The new website for Junior Achievement Zambia, a member of JA Worldwide. **The Future Starts Here.**

Built with [Next.js](https://nextjs.org) and hosted on Vercel. Content will be stored in Supabase and edited through a private admin area.

## Build progress

| Stage | What | Status |
|---|---|---|
| 1 | Foundations: brand colours, Montserrat font, logo, header, footer, mobile menu | Done |
| 2 | Home page design (placeholder content) | Done, awaiting feedback |
| 3 | Content store (Supabase database + photo storage) | Next |
| 4 | All public pages | |
| 5 | Forms (contact, volunteer, partnership) | |
| 6 | Admin area with secure login and submissions dashboard | |
| 7 | Load real content | |
| 8 | Polish, speed and accessibility testing, team guide | |

## Where things live

- `src/app/`: the pages of the site (`page.tsx` in each folder is one page)
- `src/components/`: reusable building blocks (header, footer, buttons, cards)
- `src/content/placeholder.ts`: starter text and numbers, to be replaced by the admin area in Stage 3
- `src/lib/content.ts`: the one place pages read content from
- `public/brand/`: official JA Zambia logo files (from the brand `.ai` file)
- `public/photos/`: photos. They are resized and converted to small modern formats automatically for each device.

## Brand

Colours and type follow the JA Worldwide Brand Guidelines 2026:
Transforming Teal `#008B9C`, Leadership Lime `#8FC440`, Immersive Blue-Black `#22404D` and Enterprise Aqua `#00C0CA`, plus the wider JA palette defined in `src/app/globals.css`. The typeface is Montserrat.

## For developers

```bash
npm install
npm run dev     # local preview at http://localhost:3000
npm run lint
npm run build
```
