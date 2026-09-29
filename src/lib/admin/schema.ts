// What the admin area can edit, and how each field looks.
// Lists (programs, news…) are database tables; "pages" are text blocks in `settings`.

export type AdminField = {
  name: string; // column name (lists) or dotted path (pages), e.g. "hero.title"
  label: string;
  type:
    | "text"
    | "textarea"
    | "longtext"
    | "slug"
    | "url"
    | "email"
    | "number"
    | "checkbox"
    | "select"
    | "datetime"
    | "image" // lists: URL column (+ altColumn); pages: { src, alt }
    | "lines" // one item per line → string[]
    | "pairs" // "Label | link" per line → { [keys[0]], [keys[1]] }[]
    | "gallery"; // list of photos → { src, alt }[]
  required?: boolean;
  hint?: string;
  options?: { value: string; label: string }[];
  altColumn?: string; // image field in lists: column holding the photo description
  slugFrom?: string; // slug field: which field to build it from
  pairKeys?: [string, string];
  folder?: string; // storage folder for uploads
};

export type AdminCollection = {
  key: string; // used in the admin URL
  table: string;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  subtitle?: (row: Record<string, unknown>) => string;
  orderBy: { column: string; ascending: boolean }[];
  publicPath?: (row: Record<string, unknown>) => string | null;
  fields: AdminField[];
};

const sortOrder: AdminField = {
  name: "sort_order",
  label: "Position in list",
  type: "number",
  hint: "Lower numbers appear first.",
};
const published: AdminField = { name: "published", label: "Show on the website", type: "checkbox" };
const photo = (folder: string): AdminField => ({
  name: "photo_url",
  label: "Photo",
  type: "image",
  altColumn: "photo_alt",
  folder,
});

const zambiaDateTime = (iso: unknown) =>
  typeof iso === "string"
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Lusaka",
      })
    : "";

export const collections: AdminCollection[] = [
  {
    key: "news",
    table: "news_posts",
    label: "News & blog",
    singular: "news post",
    description: "Write, schedule and publish news posts.",
    titleField: "title",
    subtitle: (r) =>
      !r.published_at
        ? "Draft (not on the website)"
        : new Date(String(r.published_at)) > new Date()
          ? `Scheduled for ${zambiaDateTime(r.published_at)}`
          : `Published ${zambiaDateTime(r.published_at)}`,
    orderBy: [{ column: "published_at", ascending: false }],
    publicPath: (r) => (r.published_at ? `/news/${r.slug}` : null),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "slug",
        label: "Web address",
        type: "slug",
        slugFrom: "title",
        hint: "Filled in automatically from the title if left empty.",
      },
      { name: "category", label: "Category", type: "text", hint: "For example: Events, Programs, Partners." },
      {
        name: "excerpt",
        label: "Short summary",
        type: "textarea",
        hint: "Shown on the news list and in link previews.",
      },
      photo("news"),
      { name: "body", label: "Article", type: "longtext", hint: "Leave an empty line between paragraphs." },
      {
        name: "published_at",
        label: "Publish date and time",
        type: "datetime",
        hint: "Empty = draft (hidden). A future date = scheduled: it appears automatically at that time. Zambian time.",
      },
    ],
  },
  {
    key: "events",
    table: "events",
    label: "Events",
    singular: "event",
    description: "Upcoming and past events such as COY and LEAD Camp.",
    titleField: "title",
    subtitle: (r) => `${zambiaDateTime(r.starts_at)}${r.location ? ` · ${r.location}` : ""}`,
    orderBy: [{ column: "starts_at", ascending: false }],
    publicPath: (r) => (r.published ? `/events/${r.slug}` : null),
    fields: [
      { name: "title", label: "Event name", type: "text", required: true },
      {
        name: "slug",
        label: "Web address",
        type: "slug",
        slugFrom: "title",
        hint: "Filled in automatically from the name if left empty.",
      },
      { name: "starts_at", label: "Starts", type: "datetime", required: true, hint: "Zambian time." },
      { name: "ends_at", label: "Ends", type: "datetime", hint: "Optional." },
      { name: "location", label: "Location", type: "text" },
      { name: "summary", label: "Short summary", type: "textarea" },
      { name: "body", label: "Full description", type: "longtext", hint: "Leave an empty line between paragraphs." },
      { name: "registration_url", label: "Registration link", type: "url", hint: "Optional. Adds a Register button." },
      photo("events"),
      published,
    ],
  },
  {
    key: "programs",
    table: "programs",
    label: "Programs",
    singular: "program",
    description: "The programs shown on the Home and Programs pages.",
    titleField: "name",
    subtitle: (r) => `${r.audience || ""}${r.published ? "" : " · Hidden"}`,
    orderBy: [{ column: "sort_order", ascending: true }],
    publicPath: (r) => (r.published ? `/programs/${r.slug}` : null),
    fields: [
      { name: "name", label: "Program name", type: "text", required: true },
      {
        name: "slug",
        label: "Web address",
        type: "slug",
        slugFrom: "name",
        hint: "Changing this breaks old links to the program page.",
      },
      { name: "audience", label: "Who it's for", type: "text", hint: "For example: Primary school, Secondary school." },
      { name: "summary", label: "One-line summary", type: "textarea", required: true },
      {
        name: "body",
        label: "Full description",
        type: "longtext",
        hint: "Shown on the program's own page. Leave an empty line between paragraphs.",
      },
      photo("programs"),
      {
        name: "accent",
        label: "Card colour",
        type: "select",
        options: [
          { value: "teal", label: "Teal" },
          { value: "lime", label: "Lime" },
          { value: "aqua", label: "Aqua" },
          { value: "azure", label: "Azure" },
          { value: "jade", label: "Jade" },
          { value: "yellow", label: "Yellow" },
        ],
      },
      sortOrder,
      published,
    ],
  },
  {
    key: "people",
    table: "people",
    label: "Team, board & alumni",
    singular: "person",
    description: "People shown on the About page.",
    titleField: "name",
    subtitle: (r) =>
      `${{ team: "Team", board: "Board", alumni: "Alumni" }[String(r.person_group)] ?? ""}${r.role ? ` · ${r.role}` : ""}${r.published ? "" : " · Hidden"}`,
    orderBy: [
      { column: "person_group", ascending: false },
      { column: "sort_order", ascending: true },
    ],
    fields: [
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "role", label: "Role or job title", type: "text" },
      {
        name: "person_group",
        label: "Group",
        type: "select",
        required: true,
        options: [
          { value: "team", label: "Team (staff)" },
          { value: "board", label: "Board" },
          { value: "alumni", label: "Alumni" },
        ],
      },
      { name: "photo_url", label: "Photo", type: "image", folder: "people" },
      { name: "bio", label: "Short bio", type: "textarea", hint: "Optional, one or two sentences." },
      sortOrder,
      published,
    ],
  },
  {
    key: "partners",
    table: "partners",
    label: "Partner logos",
    singular: "partner",
    description: "Logos shown in the partners strip on the Home page.",
    titleField: "name",
    subtitle: (r) => `${r.website_url || ""}${r.published ? "" : " · Hidden"}`,
    orderBy: [{ column: "sort_order", ascending: true }],
    fields: [
      { name: "name", label: "Partner name", type: "text", required: true },
      {
        name: "logo_url",
        label: "Logo",
        type: "image",
        folder: "partners",
        hint: "A PNG with a transparent background or an SVG works best.",
      },
      { name: "website_url", label: "Website", type: "url", hint: "Optional. The logo links here." },
      sortOrder,
      published,
    ],
  },
  {
    key: "stories",
    table: "impact_stories",
    label: "Impact stories",
    singular: "story",
    description: "Student, volunteer and partner stories on the Impact page.",
    titleField: "title",
    subtitle: (r) => `${r.person || ""}${r.published ? "" : " · Hidden"}`,
    orderBy: [{ column: "sort_order", ascending: true }],
    fields: [
      { name: "title", label: "Heading", type: "text", required: true, hint: "For example: A student's story." },
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "person", label: "Who said it", type: "text", hint: "For example: Mwila, Grade 11, Lusaka." },
      { name: "body", label: "More detail", type: "textarea", hint: "Optional." },
      photo("stories"),
      { name: "video_url", label: "YouTube link", type: "url", hint: "Optional. Adds the video to the Impact page." },
      sortOrder,
      published,
    ],
  },
  {
    key: "stats",
    table: "stats",
    label: "Impact numbers",
    singular: "number",
    description: "The big numbers on the Home and Impact pages.",
    titleField: "value",
    subtitle: (r) => String(r.label ?? ""),
    orderBy: [{ column: "sort_order", ascending: true }],
    fields: [
      {
        name: "value",
        label: "Number",
        type: "text",
        required: true,
        hint: "Exactly as it should appear, e.g. 500,000+",
      },
      { name: "label", label: "Label", type: "text", required: true, hint: "e.g. Students reached" },
      sortOrder,
    ],
  },
];

export type AdminPage = {
  key: string; // settings row key
  label: string;
  description: string;
  publicPath: string;
  fields: AdminField[];
};

export const pages: AdminPage[] = [
  {
    key: "home",
    label: "Home page",
    description: "Main banner, milestone banner and featured story.",
    publicPath: "/",
    fields: [
      { name: "hero.eyebrow", label: "Main banner: small heading", type: "text" },
      { name: "hero.title", label: "Main banner: headline", type: "text", required: true },
      { name: "hero.text", label: "Main banner: text", type: "textarea" },
      { name: "hero.photo", label: "Main banner: photo", type: "image", folder: "home" },
      { name: "milestone.title", label: "Milestone banner: headline", type: "text" },
      { name: "milestone.text", label: "Milestone banner: text", type: "textarea" },
      { name: "feature.eyebrow", label: "Featured story: small heading", type: "text" },
      { name: "feature.title", label: "Featured story: headline", type: "text" },
      { name: "feature.text", label: "Featured story: text", type: "textarea" },
      { name: "feature.photo", label: "Featured story: photo", type: "image", folder: "home" },
    ],
  },
  {
    key: "about",
    label: "About page",
    description: "Our story, mission, vision, values and alumni.",
    publicPath: "/about",
    fields: [
      { name: "intro", label: "Introduction", type: "textarea" },
      { name: "story", label: "Our story", type: "longtext", hint: "Leave an empty line between paragraphs." },
      { name: "storyPhoto", label: "Our story: photo", type: "image", folder: "about" },
      { name: "mission", label: "Mission", type: "textarea" },
      { name: "vision", label: "Vision", type: "textarea" },
      { name: "values", label: "Values", type: "lines", hint: "One value per line." },
      { name: "alumniText", label: "Alumni: text", type: "textarea" },
      { name: "alumniUrl", label: "Alumni: link", type: "url" },
    ],
  },
  {
    key: "impact",
    label: "Impact page",
    description: "Introduction, videos and photo gallery.",
    publicPath: "/impact",
    fields: [
      { name: "intro", label: "Introduction", type: "textarea" },
      { name: "heroPhoto", label: "Banner photo", type: "image", folder: "impact" },
      {
        name: "videos",
        label: "Videos",
        type: "pairs",
        pairKeys: ["title", "url"],
        hint: "One per line: Video title | YouTube link",
      },
      { name: "gallery", label: "Photo gallery", type: "gallery", folder: "gallery" },
    ],
  },
  {
    key: "get_involved",
    label: "Get Involved page",
    description: "Partner, volunteer and donation information.",
    publicPath: "/get-involved",
    fields: [
      { name: "intro", label: "Introduction", type: "textarea" },
      { name: "heroPhoto", label: "Banner photo", type: "image", folder: "get-involved" },
      { name: "partner.text", label: "Partner: text", type: "textarea" },
      { name: "partner.ways", label: "Partner: ways to partner", type: "lines", hint: "One per line." },
      { name: "volunteer.text", label: "Volunteer: text", type: "textarea" },
      { name: "volunteer.roles", label: "Volunteer: roles", type: "lines", hint: "One per line." },
      { name: "donate.text", label: "Donate: text", type: "textarea" },
      {
        name: "donate.details",
        label: "Donate: how to give",
        type: "longtext",
        hint: "Bank details, mobile money numbers or a link. Each line is shown separately.",
      },
    ],
  },
  {
    key: "site",
    label: "Contact details",
    description: "Email, phone, address and social media links shown across the site.",
    publicPath: "/contact",
    fields: [
      { name: "email", label: "Email address", type: "email", required: true },
      { name: "phone", label: "Phone number", type: "text" },
      { name: "address", label: "Office address", type: "textarea" },
      {
        name: "social",
        label: "Social media links",
        type: "pairs",
        pairKeys: ["label", "url"],
        hint: "One per line: Name | link, e.g. Facebook | https://facebook.com/jazambia",
      },
      { name: "tagline", label: "Tagline", type: "text" },
    ],
  },
];

export function getCollection(key: string) {
  return collections.find((c) => c.key === key);
}

export function getPage(key: string) {
  return pages.find((p) => p.key === key);
}
