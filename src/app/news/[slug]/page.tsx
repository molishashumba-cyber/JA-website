import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";
import { getLatestNews, getNewsPost } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getLatestNews(100);
  return posts.map((p) => ({ slug: p.slug }));
}

export const metadata: Metadata = { title: "News" };

export default async function NewsPostPage(props: PageProps<"/news/[slug]">) {
  const { slug } = await props.params;
  const post = await getNewsPost(slug);
  if (!post) notFound();

  return (
    <>
      <PageHero eyebrow={post.category} title={post.title} text={post.excerpt} />
      <ComingSoon />
    </>
  );
}
