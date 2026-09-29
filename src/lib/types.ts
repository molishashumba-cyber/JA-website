// Shapes of the content the team will edit from the admin area.
// Lists map to Supabase tables; page text blocks are rows in the `settings` table.

export type Photo = {
  src: string;
  alt: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type Program = {
  slug: string;
  name: string;
  audience: string;
  summary: string;
  accent: "teal" | "lime" | "aqua" | "azure" | "jade" | "yellow";
  photo?: Photo;
  body?: string; // paragraphs separated by blank lines
  gallery?: Photo[];
};

export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date
  category: string;
  photo: Photo;
  body?: string; // paragraphs separated by blank lines
  sample?: boolean;
};

export type Partner = {
  name: string;
  logo?: string;
  url?: string;
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    text: string;
    photo: Photo;
  };
  milestone: {
    title: string;
    text: string;
  };
  stats: Stat[];
  feature: {
    eyebrow: string;
    title: string;
    text: string;
    photo: Photo;
  };
};

export type SiteSettings = {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  social: { label: string; url: string }[];
};

export type Person = {
  name: string;
  role: string;
  bio: string;
  photo?: Photo;
  group: "team" | "board" | "alumni";
  sample?: boolean;
};

export type JAEvent = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  location: string;
  startsAt: string; // ISO date-time
  endsAt?: string;
  registrationUrl?: string;
  photo?: Photo;
};

export type ImpactStory = {
  title: string;
  quote: string;
  person: string;
  body: string;
  photo?: Photo;
  videoUrl?: string;
  sample?: boolean;
};

export type AboutContent = {
  intro: string;
  story: string; // paragraphs separated by blank lines
  storyPhoto: Photo;
  vision: string;
  mission: string;
  values: string[];
  alumniText: string;
  alumniUrl: string;
};

export type ImpactContent = {
  intro: string;
  heroPhoto: Photo;
  videos: { title: string; url: string }[];
  gallery: Photo[];
};

export type GetInvolvedContent = {
  intro: string;
  heroPhoto: Photo;
  partner: { text: string; ways: string[] };
  volunteer: { text: string; roles: string[] };
  donate: { text: string; details: string }; // details: bank / mobile money, one item per line
};
