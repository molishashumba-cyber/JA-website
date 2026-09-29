import Image from "next/image";
import { BirdSymbol } from "@/components/BirdSymbol";
import { Button } from "@/components/Button";
import { NewsCard } from "@/components/NewsCard";
import { ProgramCard } from "@/components/ProgramCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getHomeContent, getLatestNews, getPartners, getPrograms } from "@/lib/content";

export default async function HomePage() {
  const [home, programs, news, partners] = await Promise.all([
    getHomeContent(),
    getPrograms(),
    getLatestNews(3),
    getPartners(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-dark text-white">
        <Image
          src={home.hero.photo.src}
          alt={home.hero.photo.alt}
          fill
          preload
          sizes="100vw"
          quality={60}
          className="-z-20 object-cover object-[70%_30%]"
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-t from-dark via-dark/70 to-dark/10 md:bg-gradient-to-r md:from-dark md:via-dark/75 md:to-transparent"
          aria-hidden="true"
        />
        <div className="mx-auto flex min-h-[82svh] max-w-7xl flex-col justify-end px-4 pt-40 pb-12 sm:px-6 md:min-h-[640px] md:justify-center md:pb-20">
          <div className="max-w-xl">
            <p className="text-sm font-bold tracking-widest text-lime uppercase">{home.hero.eyebrow}</p>
            <h1 className="mt-3 text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              {home.hero.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/90 sm:text-xl">{home.hero.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/programs">Explore our programs</Button>
              <Button href="/get-involved" variant="outlineLight">
                Partner with us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Milestone banner */}
      <section className="relative isolate overflow-hidden bg-lime text-dark">
        <BirdSymbol className="absolute -top-8 right-8 -z-10 hidden h-80 w-auto lg:block" />
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-bold tracking-widest uppercase">Celebrating a milestone</p>
            <h2 className="mt-2 text-3xl leading-tight font-extrabold sm:text-5xl">{home.milestone.title}</h2>
            <p className="mt-3 text-lg font-medium">{home.milestone.text}</p>
          </div>
          <Button href="/impact" variant="dark" className="self-start">
            See our impact
          </Button>
        </div>
      </section>

      {/* Impact stats */}
      <section aria-labelledby="stats-heading" className="bg-white">
        <h2 id="stats-heading" className="sr-only">
          Our impact in numbers
        </h2>
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-dark/10 lg:grid-cols-4">
          {home.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse bg-white px-4 py-8 text-center sm:py-12">
              <dt className="mt-1 text-sm font-semibold text-dark/70 sm:text-base">{stat.label}</dt>
              <dd className="text-3xl font-extrabold text-teal sm:text-5xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Programs */}
      <section className="bg-pearl py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Our programs"
              title="Learning by doing, from primary school to first job"
              text="Every JA program is hands-on and led by volunteers from the business world."
            />
            <div className="hidden sm:block md:self-end">
              <Button href="/programs" variant="outlineDark">
                All programs
              </Button>
            </div>
          </div>
          {/* Swipeable row on phones, grid on larger screens */}
          <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
            {programs.map((program) => (
              <li key={program.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
                <ProgramCard program={program} />
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm font-semibold text-dark/60 sm:hidden">Swipe to see all {programs.length} programs →</p>
          <div className="mt-6 sm:hidden">
            <Button href="/programs" variant="outlineDark" className="w-full">
              All programs
            </Button>
          </div>
        </div>
      </section>

      {/* Feature story */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src={home.feature.photo.src}
                alt={home.feature.photo.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                quality={60}
                className="object-cover"
              />
            </div>
            <div className="absolute -right-3 -bottom-3 -z-10 h-full w-full rounded-3xl bg-lime" aria-hidden="true" />
          </div>
          <div>
            <SectionHeading eyebrow={home.feature.eyebrow} title={home.feature.title} text={home.feature.text} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/programs/girls-lead-camp" variant="teal">
                About LEAD Camp
              </Button>
              <Button href="/events" variant="outlineDark">
                Upcoming events
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="bg-pearl py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Latest news" title="Stories from the JA Zambia community" />
            <Button href="/news" variant="outlineDark" className="self-start md:self-end">
              All news
            </Button>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((post) => (
              <li key={post.slug}>
                <NewsCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Get involved */}
      <section className="relative isolate overflow-hidden bg-dark py-16 text-white sm:py-24">
        <BirdSymbol color="#285f74" className="absolute -right-20 -bottom-24 -z-10 h-96 w-auto" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            light
            eyebrow="Get involved"
            title="Help shape the future of Zambia's young people"
            text="Whether you give your time, your expertise or your support, you open doors for the next generation."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Partner or sponsor",
                text: "Fund a program, sponsor an event or bring your company's people into the classroom.",
                href: "/get-involved#partner",
                cta: "Become a partner",
              },
              {
                title: "Volunteer",
                text: "Share your experience as a mentor, judge, job-shadow host or classroom volunteer.",
                href: "/get-involved#volunteer",
                cta: "Volunteer with us",
              },
              {
                title: "Donate",
                text: "Every kwacha helps a young person learn to save, earn and build a business.",
                href: "/get-involved#donate",
                cta: "Make a donation",
              },
            ].map((card) => (
              <li key={card.title} className="flex flex-col rounded-2xl bg-white/5 p-6 ring-1 ring-white/15">
                <h3 className="text-2xl font-extrabold">{card.title}</h3>
                <p className="mt-2 flex-1 text-white/80">{card.text}</p>
                <Button href={card.href} className="mt-6 self-start">
                  {card.cta}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading center eyebrow="Our partners" title="Made possible by organisations who believe in youth" />
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <li
                key={partner.name}
                className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-dark/15 text-sm font-semibold text-dark/50"
              >
                {partner.name} logo
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
