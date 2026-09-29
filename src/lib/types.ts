// Shapes of the content the team will edit from the admin area.
// Each type maps to a Supabase table in Stage 3.

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
};

export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date
  category: string;
  photo: Photo;
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
