import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { PhotoGallery } from "@/components/PhotoGallery";
import { SectionHeading } from "@/components/SectionHeading";
import { YouTubeVideo } from "@/components/YouTubeVideo";
import { getHomeContent, getImpactContent, getImpactStories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our impact",
  description: "Key numbers, stories, photos and videos from Junior Achievement Zambia.",
};

export default async function ImpactPage() {
  const [impact, home, stories] = await Promise.all([getImpactContent(), getHomeContent(), getImpactStories()]);
  const videos = [
    ...impact.videos,
    ...stories.filter((s) => s.videoUrl).map((s) => ({ title: s.title, url: s.videoUrl! })),
  ];

  return (
    <>
      <PageHero eyebrow="Our impact" title={home.milestone.title} text={impact.intro} photo={impact.heroPhoto} />

      {/* Key numbers */}
      {home.stats.length > 0 && (
        <section aria-labelledby="numbers-heading" className="bg-white">
          <h2 id="numbers-heading" className="sr-only">
            Key numbers
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
      )}

      {/* Stories */}
      {stories.length > 0 && (
        <section className="bg-pearl py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Stories" title="In their own words" />
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {stories.map((story, i) => (
                <li
                  key={`${story.title}-${i}`}
                  className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-dark/10 sm:flex-row"
                >
                  {story.photo && (
                    <div className="relative aspect-[4/3] shrink-0 sm:aspect-auto sm:w-2/5">
                      <Image
                        src={story.photo.src}
                        alt={story.photo.alt}
                        fill
                        sizes="(min-width: 768px) 20vw, 100vw"
                        quality={60}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <figure className="flex flex-col justify-center p-6">
                    {story.sample && (
                      <span className="mb-3 self-start rounded-full bg-pearl px-3 py-1 text-xs font-bold text-dark">
                        Sample story
                      </span>
                    )}
                    <p className="text-sm font-bold tracking-widest text-teal uppercase">{story.title}</p>
                    <blockquote className="mt-3 text-xl leading-snug font-bold text-dark">
                      &ldquo;{story.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 font-semibold text-dark/70">{story.person}</figcaption>
                    {story.body && <p className="mt-3 text-dark/75">{story.body}</p>}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Videos" title="See JA Zambia in action" />
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {videos.map((video) => (
                <li key={video.url}>
                  <YouTubeVideo url={video.url} title={video.title} />
                  <p className="mt-3 font-bold text-dark">{video.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Gallery */}
      {impact.gallery.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Gallery" title="Moments from our programs" />
            <div className="mt-10">
              <PhotoGallery photos={impact.gallery} />
            </div>
          </div>
        </section>
      )}

      <CtaBand title="Help us reach the next 500,000" />
    </>
  );
}
