import type { Metadata } from "next";
import { FormPage } from "@/components/FormPage";

export const metadata: Metadata = {
  title: "Partner with us",
  description: "Partner with or sponsor Junior Achievement Zambia.",
};

export default function PartnerPage() {
  return (
    <FormPage
      type="partner"
      eyebrow="Partner or sponsor"
      title="Invest in Zambia's next generation"
      intro="Sponsor a program or event, engage your employees as volunteers, or host students in your workplace."
      photo={{ src: "/photos/coy-africa-flags.jpg", alt: "Student teams on stage at a regional JA competition" }}
      points={[
        "Our partnerships team contacts you to learn about your goals.",
        "We propose options that fit your budget and priorities.",
        "You see the impact through visits, reports and events.",
      ]}
    />
  );
}
