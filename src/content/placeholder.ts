// Starter content. Shown when Supabase isn't connected, and used to fill any
// field or list the team hasn't filled in yet (see src/lib/content.ts).
// Items marked `sample: true` are illustrative and are labelled on the site.

import type {
  AboutContent,
  GetInvolvedContent,
  HomeContent,
  ImpactContent,
  ImpactStory,
  NewsPost,
  Partner,
  Person,
  Photo,
  Program,
  SiteSettings,
} from "@/lib/types";

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
    photo: { src: "/photos/cha-ching-reader.jpg", alt: "A pupil reading a Cha-Ching comic book in class" },
    body: "Cha-Ching introduces children to four simple money habits: earn, save, spend and donate. Short cartoons follow a band of friends as they make everyday money decisions, and classroom activities help pupils practise the same choices.\n\nTeachers and JA volunteers use Cha-Ching comic books and lesson plans to make money conversations fun, so good habits start early and last a lifetime.",
    gallery: [
      { src: "/photos/cha-ching-books.jpg", alt: "Pupils holding up Cha-Ching comic books" },
      { src: "/photos/cha-ching-school-group.jpg", alt: "A school group with their Cha-Ching books" },
      { src: "/photos/cha-ching-pupils.jpg", alt: "Primary school pupils at a Cha-Ching session" },
    ],
  },
  {
    slug: "company-program",
    name: "JA Company Program",
    audience: "Secondary school",
    summary: "Students set up and run a real business, from idea and sales to closing the books.",
    accent: "teal",
    photo: { src: "/photos/students-group.jpg", alt: "A group of JA Zambia students in school uniforms" },
    body: "In the JA Company Program, students form a real company. They choose a product, raise capital, elect a management team, produce and sell, and finally close the company and report to their shareholders.\n\nVolunteers from the business community coach each team along the way. Students finish with practical experience of entrepreneurship, teamwork and financial management, and the best companies go on to compete at Company of the Year.",
    gallery: [
      { src: "/photos/school-assembly.jpg", alt: "Students gathered outside their school" },
      { src: "/photos/school-group-books.jpg", alt: "A school group holding JA materials" },
    ],
  },
  {
    slug: "company-of-the-year",
    name: "Company of the Year",
    audience: "Company Program teams",
    summary: "The national competition where the best student companies pitch to judges for the top prize.",
    accent: "aqua",
    photo: { src: "/photos/coy-stage.jpg", alt: "Students presenting on stage at Company of the Year" },
    body: "Company of the Year is the national showcase for student companies from the JA Company Program. Teams present their business, answer questions from a panel of judges and exhibit their products.\n\nWinners represent Zambia at regional JA competitions, pitching alongside student entrepreneurs from across Africa.",
    gallery: [
      { src: "/photos/coy-pitch.jpg", alt: "Students pitching at Company of the Year" },
      {
        src: "/photos/coy-africa-flags.jpg",
        alt: "Student teams on stage with African flags at the regional competition",
      },
      { src: "/photos/panel-discussion.jpg", alt: "Judges and guests at a panel discussion" },
    ],
  },
  {
    slug: "girls-lead-camp",
    name: "Girls LEAD Camp",
    audience: "Young women",
    summary: "A leadership camp that connects girls with inspiring women role models and mentors.",
    accent: "jade",
    photo: { src: "/photos/girls-lead-camp.jpg", alt: "Girls LEAD Camp participants" },
    body: "Girls LEAD Camp brings girls together with women leaders from business and public life. Through workshops, mentoring and honest conversations, participants build confidence, explore careers and practise leadership.\n\nEvery camp is made possible by partners who share our belief that when girls lead, communities rise.",
    gallery: [
      { src: "/photos/lead-camp-stage.jpg", alt: "The Girls LEAD Camp stage" },
      { src: "/photos/camp-group.jpg", alt: "Girls LEAD Camp participants together outdoors" },
      { src: "/photos/camp-selfie.jpg", alt: "Two participants smiling together at camp" },
    ],
  },
  {
    slug: "job-shadows",
    name: "Job Shadows",
    audience: "Secondary school",
    summary: "Students spend a day in a real workplace to explore careers and see skills in action.",
    accent: "azure",
    body: "Job Shadows give students a day in a real workplace. They follow professionals through their working day, ask questions and see how the skills they learn at school are used on the job.\n\nFor host companies, it is a simple and rewarding way to inspire the next generation of talent.",
  },
  {
    slug: "innovation-camps",
    name: "Innovation Camps",
    audience: "Youth",
    summary: "Fast-paced challenges where teams solve a real business problem and pitch their idea.",
    accent: "yellow",
    body: "Innovation Camps are fast-paced challenges. Teams of students are given a real business or community problem, work with volunteer mentors to develop a solution, and pitch their idea to a panel of judges, all in a single day.\n\nStudents practise creativity, teamwork, problem-solving and public speaking.",
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
    body: "This is a sample post showing how a news article will look. Your team will be able to write and publish real news from the admin area.\n\nEach post has a main photo, a short summary for the news list, and as many paragraphs as you need.",
    sample: true,
  },
  {
    slug: "student-companies-take-flight",
    title: "Student companies take flight",
    excerpt: "Company Program teams from across Lusaka prepare their businesses for the national stage.",
    date: "2026-08-28",
    category: "Programs",
    photo: { src: "/photos/students-group.jpg", alt: "JA Zambia students standing together" },
    body: "This is a sample post showing how a news article will look. Your team will be able to write and publish real news from the admin area.\n\nEach post has a main photo, a short summary for the news list, and as many paragraphs as you need.",
    sample: true,
  },
  {
    slug: "meet-the-team",
    title: "Meet the people behind JA Zambia",
    excerpt: "Our staff and board share why they believe in the future of Zambia's young people.",
    date: "2026-08-10",
    category: "Our team",
    photo: { src: "/photos/team-and-board.jpg", alt: "JA Zambia staff and board members" },
    body: "This is a sample post showing how a news article will look. Your team will be able to write and publish real news from the admin area.\n\nEach post has a main photo, a short summary for the news list, and as many paragraphs as you need.",
    sample: true,
  },
];

export const partners: Partner[] = [
  { name: "Partner 1 logo" },
  { name: "Partner 2 logo" },
  { name: "Partner 3 logo" },
  { name: "Partner 4 logo" },
  { name: "Partner 5 logo" },
  { name: "Partner 6 logo" },
];

const photo = (file: string, alt: string): Photo => ({ src: `/photos/${file}.jpg`, alt });

export const about: AboutContent = {
  intro:
    "For 20 years, Junior Achievement Zambia has helped young people discover what they are capable of, in classrooms, camps and competitions across the country.",
  story:
    "Junior Achievement Zambia is part of JA Worldwide, one of the world's largest youth-serving organisations, active in more than 100 countries.\n\nWorking with schools, volunteers and partners, we deliver hands-on programs in financial literacy, entrepreneurship and work readiness. Over two decades, more than 500,000 Zambian students have taken part.\n\n[Placeholder: add JA Zambia's own story here, such as when and how it started, key milestones, and what makes the Zambian program special.]",
  storyPhoto: photo("school-assembly", "JA Zambia volunteers with students outside a school"),
  vision: "A world in which young people have the skillset and mindset to build thriving communities.",
  mission: "JA inspires and prepares young people to succeed in a global economy.",
  values: [
    "Believe in the boundless potential of young people.",
    "Advocate for the impact of relevant, hands-on learning.",
    "Teach principled, market-based economics and entrepreneurship that build a more sustainable world.",
    "Approach our work with passion, honesty, integrity and excellence.",
    "Seek out diverse backgrounds, perspectives and talents in our staff, volunteers and boards to reflect the communities we serve.",
    "Nurture the power of partnership and collaboration.",
  ],
  alumniText:
    "Once a JA student, always part of the JA family. Our alumni stay connected through Gather, JA Worldwide's global alumni community, where they network, mentor and give back.",
  alumniUrl: "https://gatheralumni.org",
};

export const people: Person[] = [1, 2, 3, 4, 5].map((n) => ({
  name: "Name to be added",
  role: "Role to be added",
  bio: "",
  photo: photo(`staff-headshot-${n}`, "JA Zambia team member"),
  group: "team",
  sample: true,
}));

export const impactStories: ImpactStory[] = [
  {
    title: "A student's story",
    quote: "[Placeholder: a short quote from a JA student about what they learned.]",
    person: "Student name, school",
    body: "",
    photo: photo("cha-ching-reader", "A pupil reading a Cha-Ching comic book"),
    sample: true,
  },
  {
    title: "A volunteer's story",
    quote: "[Placeholder: a short quote from a volunteer or teacher about the difference JA makes.]",
    person: "Volunteer name, company",
    body: "",
    photo: photo("reading-session", "A volunteer helping a student read"),
    sample: true,
  },
];

export const gallery: Photo[] = [
  photo("coy-stage", "Students presenting at Company of the Year 2025"),
  photo("cha-ching-books", "Pupils holding up Cha-Ching comic books"),
  photo("lead-camp-stage", "The Girls LEAD Camp stage"),
  photo("cha-ching-pupils", "Primary school pupils at a Cha-Ching session"),
  photo("coy-africa-flags", "Student teams on stage with African flags"),
  photo("camp-friends", "Camp participants on a wooden bridge"),
  photo("school-group-books", "A school group holding JA materials"),
  photo("coy-pitch", "Students pitching to judges"),
  photo("camp-selfie", "Two participants smiling together at camp"),
  photo("reading-session", "A volunteer helping a student read"),
  photo("panel-discussion", "Judges and guests at a panel discussion"),
  photo("cha-ching-school-group", "A school group with their Cha-Ching books"),
];

export const impact: ImpactContent = {
  intro:
    "Every number here is a young person who has learned to save, started a business, pitched an idea or discovered a career.",
  heroPhoto: photo("cha-ching-school-group", "A large school group holding Cha-Ching books"),
  videos: [],
  gallery,
};

export const getInvolved: GetInvolvedContent = {
  intro:
    "JA programs are powered by partners, volunteers and donors. However you get involved, you help a young Zambian build the skills to succeed.",
  heroPhoto: photo("panel-discussion", "Partners and guests at a JA Zambia event"),
  partner: {
    text: "Partner with JA Zambia to invest in the next generation of entrepreneurs, employees and leaders, and see the impact first-hand.",
    ways: [
      "Sponsor a program in schools of your choice",
      "Sponsor a flagship event such as Company of the Year or Girls LEAD Camp",
      "Give your employees meaningful volunteering opportunities",
      "Host students for Job Shadow days",
    ],
  },
  volunteer: {
    text: "Share your experience and inspire young people. No teaching experience is needed: we provide training and materials.",
    roles: [
      "Classroom volunteer or mentor",
      "Company Program business adviser",
      "Judge at Company of the Year or an Innovation Camp",
      "Job Shadow host at your workplace",
    ],
  },
  donate: {
    text: "Your gift puts JA programs into more classrooms and gives more young people the chance to learn by doing.",
    details: "[Placeholder: bank account details]\n[Placeholder: mobile money number]",
  },
};
