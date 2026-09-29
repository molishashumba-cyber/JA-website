// Starter content used until the Supabase content store is connected (Stage 3).
// Items marked `sample: true` are illustrative and will be replaced by real posts.

import type { HomeContent, NewsPost, Partner, Program, SiteSettings } from "@/lib/types";

export const site: SiteSettings = {
  name: "Junior Achievement Zambia",
  tagline: "The Future Starts Here",
  email: "info@jazambia.org",
  phone: "",
  address: "Lusaka, Zambia",
  social: [
    { label: "Facebook", url: "https://www.facebook.com/" },
    { label: "Instagram", url: "https://www.instagram.com/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
  ],
};

export const home: HomeContent = {
  hero: {
    eyebrow: "Junior Achievement Zambia",
    title: "The Future Starts Here",
    text: "We equip young Zambians with the skills and mindset to manage money, launch businesses and lead in their communities.",
    photo: { src: "/photos/student-smiling.jpg", alt: "A smiling JA Zambia student in school uniform" },
  },
  milestone: {
    title: "500,000 students. 20 years in Zambia.",
    text: "Two decades of classrooms, camps, competitions and mentors, and we are just getting started.",
  },
  stats: [
    { value: "500,000+", label: "Students reached" },
    { value: "20", label: "Years in Zambia" },
    { value: "9", label: "Hands-on programs" },
    { value: "100+", label: "Countries in the JA network" },
  ],
  feature: {
    eyebrow: "Girls LEAD Camp",
    title: "When girls lead, communities rise",
    text: "Our Girls LEAD Camp brings young women together with female role models from business and public life to build confidence, leadership and career ambition.",
    photo: { src: "/photos/girls-lead-camp.jpg", alt: "Mentors and girls in Girls LEAD t-shirts at the LEAD Camp" },
  },
};

export const programs: Program[] = [
  {
    slug: "cha-ching",
    name: "Cha-Ching",
    audience: "Primary school",
    summary: "Fun cartoons and activities that teach children to earn, save, spend and donate wisely.",
    accent: "lime",
  },
  {
    slug: "company-program",
    name: "JA Company Program",
    audience: "Secondary school",
    summary: "Students set up and run a real business, from idea and sales to closing the books.",
    accent: "teal",
    photo: { src: "/photos/students-group.jpg", alt: "A group of JA Zambia students in school uniforms" },
  },
  {
    slug: "company-of-the-year",
    name: "Company of the Year",
    audience: "Company Program teams",
    summary: "The national competition where the best student companies pitch to judges for the top prize.",
    accent: "aqua",
  },
  {
    slug: "girls-lead-camp",
    name: "Girls LEAD Camp",
    audience: "Young women",
    summary: "A leadership camp that connects girls with inspiring women role models and mentors.",
    accent: "jade",
    photo: { src: "/photos/girls-lead-camp.jpg", alt: "Girls LEAD Camp participants" },
  },
  {
    slug: "job-shadows",
    name: "Job Shadows",
    audience: "Secondary school",
    summary: "Students spend a day in a real workplace to explore careers and see skills in action.",
    accent: "azure",
  },
  {
    slug: "innovation-camps",
    name: "Innovation Camps",
    audience: "Youth",
    summary: "Fast-paced challenges where teams solve a real business problem and pitch their idea.",
    accent: "yellow",
  },
  {
    slug: "its-tyme",
    name: "Its-Tyme",
    audience: "Youth",
    summary: "Program description to be supplied by the JA Zambia team.",
    accent: "teal",
  },
  {
    slug: "ja-deep",
    name: "JA Deep",
    audience: "Youth",
    summary: "Program description to be supplied by the JA Zambia team.",
    accent: "lime",
  },
  {
    slug: "social-equity",
    name: "Social Equity",
    audience: "Youth",
    summary: "Program description to be supplied by the JA Zambia team.",
    accent: "aqua",
  },
];

export const news: NewsPost[] = [
  {
    slug: "girls-lead-camp-highlights",
    title: "Highlights from this year's Girls LEAD Camp",
    excerpt: "Mentors, role models and big ambitions: a look back at our leadership camp for young women.",
    date: "2026-09-15",
    category: "Events",
    photo: { src: "/photos/girls-lead-camp.jpg", alt: "Girls LEAD Camp mentors and participants" },
    sample: true,
  },
  {
    slug: "student-companies-take-flight",
    title: "Student companies take flight",
    excerpt: "Company Program teams from across Lusaka prepare their businesses for the national stage.",
    date: "2026-08-28",
    category: "Programs",
    photo: { src: "/photos/students-group.jpg", alt: "JA Zambia students standing together" },
    sample: true,
  },
  {
    slug: "meet-the-team",
    title: "Meet the people behind JA Zambia",
    excerpt: "Our staff and board share why they believe in the future of Zambia's young people.",
    date: "2026-08-10",
    category: "Our team",
    photo: { src: "/photos/team-and-board.jpg", alt: "JA Zambia staff and board members" },
    sample: true,
  },
];

export const partners: Partner[] = [
  { name: "Partner 1" },
  { name: "Partner 2" },
  { name: "Partner 3" },
  { name: "Partner 4" },
  { name: "Partner 5" },
  { name: "Partner 6" },
];
