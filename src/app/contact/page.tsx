import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with Junior Achievement Zambia.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name}, ${site.address}`)}`;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We would love to hear from you"
        text="Questions, partnerships, volunteering or bringing JA to your school: get in touch."
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-5 md:gap-16">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-extrabold text-dark">Contact details</h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-xs font-bold tracking-widest text-teal uppercase">Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`} className="text-lg font-semibold text-dark hover:text-teal">
                    {site.email}
                  </a>
                </dd>
              </div>
              {site.phone && (
                <div>
                  <dt className="text-xs font-bold tracking-widest text-teal uppercase">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      className="text-lg font-semibold text-dark hover:text-teal"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-bold tracking-widest text-teal uppercase">Office</dt>
                <dd className="text-lg font-semibold text-dark">{site.address}</dd>
                <dd>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-teal hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-widest text-teal uppercase">Follow us</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {site.social.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center rounded-full border-2 border-dark/15 px-4 text-sm font-bold text-dark hover:border-teal hover:text-teal"
                    >
                      {s.label}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* The contact form arrives in Stage 5. */}
          <div id="form" className="rounded-3xl bg-pearl p-6 sm:p-8 md:col-span-3">
            <h2 className="text-2xl font-extrabold text-dark">Send us a message</h2>
            <p className="mt-3 text-lg text-dark/80">
              Our online contact form is coming very soon. In the meantime, email us at{" "}
              <a href={`mailto:${site.email}`} className="font-bold text-teal underline">
                {site.email}
              </a>{" "}
              and we&apos;ll get back to you.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
