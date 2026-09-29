import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Events" };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Events" title="Company of the Year, LEAD Camp and more" />
      <ComingSoon />
    </>
  );
}
