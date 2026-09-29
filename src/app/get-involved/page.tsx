import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { getGetInvolvedContent, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Get involved",
  description: "Partner with, volunteer for or donate to Junior Achievement Zambia.",
};

function Tick() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 size-5 shrink-0 text-teal"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function GetInvolvedPage() {
  const [content, site] = await Promise.all([getGetInvolvedContent(), getSiteSettings()]);
  const donateLines = content.donate.details.split("\n").filter((l) => l.trim());

  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Partner, volunteer or donate"
        text={content.intro}
        photo={content.heroPhoto}
      >
        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
          {[
            ["#partner", "Partner or sponsor"],
            ["#volunteer", "Volunteer"],
            ["#donate", "Donate"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center rounded-full border-2 border-white/70 px-5 text-sm font-bold hover:bg-white hover:text-dark"
            >
              {label}
            </a>
          ))}
        </nav>
      </PageHero>

      {/* Partner */}
      <section id="partner" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-sm font-bold tracking-widest text-teal uppercase">Partner or sponsor</p>
            <h2 className="mt-2 text-3xl leading-tight font-extrabold text-dark sm:text-4xl">
              Invest in Zambia&apos;s future workforce
            </h2>
            <p className="mt-4 text-lg text-dark/80">{content.partner.text}</p>
            <ul className="mt-6 space-y-3">
              {content.partner.ways.map((way) => (
                <li key={way} className="flex gap-3 font-semibold text-dark">
                  <Tick />
                  {way}
                </li>
              ))}
            </ul>
            <Button href="/contact?topic=partner" variant="teal" className="mt-8">
              Talk to us about partnering
            </Button>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/photos/coy-africa-flags.jpg"
              alt="Student teams on stage at a regional JA competition"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={60}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Volunteer */}
      <section id="volunteer" className="scroll-mt-24 bg-pearl py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
          <div className="relative order-last aspect-[4/3] overflow-hidden rounded-3xl md:order-first">
            <Image
              src="/photos/reading-session.jpg"
              alt="A volunteer helping a student read"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              quality={60}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold tracking-widest text-teal uppercase">Volunteer</p>
            <h2 className="mt-2 text-3xl leading-tight font-extrabold text-dark sm:text-4xl">Share what you know</h2>
            <p className="mt-4 text-lg text-dark/80">{content.volunteer.text}</p>
            <ul className="mt-6 space-y-3">
              {content.volunteer.roles.map((role) => (
                <li key={role} className="flex gap-3 font-semibold text-dark">
                  <Tick />
                  {role}
                </li>
              ))}
            </ul>
            <Button href="/contact?topic=volunteer" variant="teal" className="mt-8">
              Sign up to volunteer
            </Button>
          </div>
        </div>
      </section>

      {/* Donate */}
      <section id="donate" className="scroll-mt-24 bg-boundless py-16 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-sm font-bold tracking-widest text-lime uppercase">Donate</p>
            <h2 className="mt-2 text-3xl leading-tight font-extrabold sm:text-4xl">Every kwacha counts</h2>
            <p className="mt-4 text-lg text-white/85">{content.donate.text}</p>
          </div>
          <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/15 sm:p-8">
            <h3 className="text-xl font-extrabold">How to give</h3>
            <ul className="mt-4 space-y-2 text-white/90">
              {donateLines.map((line) => (
                <li key={line} className="font-semibold">
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/70">
              Questions about giving? Email{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-aqua underline">
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
