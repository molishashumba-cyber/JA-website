import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Our impact" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Our impact" title="500,000 students and counting" />
      <ComingSoon />
    </>
  );
}
