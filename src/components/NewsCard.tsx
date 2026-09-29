import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/dates";
import type { NewsPost } from "@/lib/types";

export function NewsCard({ post }: { post: NewsPost }) {
  const date = formatDate(post.date);

  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-dark/10 transition hover:shadow-lg"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-pearl">
        <Image
          src={post.photo.src}
          alt={post.photo.alt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          quality={60}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {post.sample && (
          <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-dark">
            Sample post
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold tracking-widest text-azure uppercase">
          {post.category} · <time dateTime={post.date}>{date}</time>
        </p>
        <h3 className="mt-2 text-lg leading-snug font-extrabold text-dark group-hover:text-azure">{post.title}</h3>
        <p className="mt-2 text-dark/75">{post.excerpt}</p>
      </div>
    </Link>
  );
}
