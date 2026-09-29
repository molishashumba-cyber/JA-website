import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Get involved" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Get involved" title="Partner, volunteer or donate" />
      {/* Anchors used by links elsewhere on the site */}
      <span id="partner" />
      <span id="volunteer" />
      <span id="donate" />
      <ComingSoon />
    </>
  );
}
