// The website's public address, used for Google, sitemaps and link previews.
// Set NEXT_PUBLIC_SITE_URL (e.g. https://jazambia.org) when the site goes live
// on its real domain: that also allows Google to list it.
const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export const siteUrl = explicit || (vercel ? `https://${vercel}` : "http://localhost:3000");

// Until the real domain is set, ask search engines not to list the temporary address.
export const allowIndexing = Boolean(explicit);
