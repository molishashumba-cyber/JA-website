import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Contact us" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Contact" title="We would love to hear from you" />
      <ComingSoon />
    </>
  );
}
