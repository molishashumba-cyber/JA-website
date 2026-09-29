import type { Metadata } from "next";
import { FormPage } from "@/components/FormPage";

export const metadata: Metadata = {
  title: "Volunteer",
  description: "Sign up to volunteer with Junior Achievement Zambia.",
};

export default function VolunteerPage() {
  return (
    <FormPage
      type="volunteer"
      eyebrow="Volunteer"
      title="Share your experience with young Zambians"
      intro="Mentor a class, advise a student company, judge a competition or host a Job Shadow. No teaching experience needed."
      photo={{ src: "/photos/reading-session.jpg", alt: "A volunteer helping a student read" }}
      points={[
        "Our team reviews your details and contacts you.",
        "We match you with an opportunity that suits your time and skills.",
        "You receive a short briefing and materials before you start.",
      ]}
    />
  );
}
