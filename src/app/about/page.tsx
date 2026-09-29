import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "About us" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="About us" title="Twenty years of inspiring young Zambians" />
      <ComingSoon />
    </>
  );
}
