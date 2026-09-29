import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "News" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="News & blog" title="Stories from the JA Zambia community" />
      <ComingSoon />
    </>
  );
}
