import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { NewsCard } from "@/components/NewsCard";
import { PageHero } from "@/components/PageHero";
import { getLatestNews } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description: "News and stories from Junior Achievement Zambia.",
};

export default async function NewsPage() {
  const posts = await getLatestNews(60);

  return (
    <>
      <PageHero eyebrow="News & blog" title="Stories from the JA Zambia community" />
      <section className="bg-pearl py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {posts.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <NewsCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-xl rounded-2xl bg-white p-6 text-lg text-dark/80 ring-1 ring-dark/10">
              New stories are on their way. Check back soon, or follow us on social media for the latest updates.
            </p>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
