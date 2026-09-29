import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/Prose";
import { formatDate } from "@/lib/dates";
import { getLatestNews, getNewsPost } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getLatestNews(100);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getNewsPost(slug);
  return {
    title: post?.title ?? "News",
    description: post?.excerpt,
    openGraph: post ? { images: [post.photo.src] } : undefined,
  };
}

export default async function NewsPostPage(props: PageProps<"/news/[slug]">) {
  const { slug } = await props.params;
  const post = await getNewsPost(slug);
  if (!post) notFound();

  return (
    <article>
      <header className="bg-dark text-white">
        <div className="mx-auto max-w-3xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16">
          <Link href="/news" className="text-sm font-bold text-lime hover:underline">
            ← All news
          </Link>
          <p className="mt-6 text-sm font-bold tracking-widest text-aqua uppercase">
            {post.category} · <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-extrabold sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-lg text-white/85">{post.excerpt}</p>}
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="relative -mt-2 aspect-[3/2] overflow-hidden rounded-b-3xl sm:rounded-3xl">
          <Image
            src={post.photo.src}
            alt={post.photo.alt}
            fill
            preload
            sizes="(min-width: 768px) 768px, 100vw"
            quality={60}
            className="object-cover"
          />
        </div>
        <Prose text={post.body} className="py-10 sm:py-14" />
      </div>
    </article>
  );
}
