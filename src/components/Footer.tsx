import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getSiteSettings } from "@/lib/content";
import { mainNav } from "@/lib/navigation";

export async function Footer() {
  const site = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Logo variant="white" className="h-12 w-auto" />
          <p className="mt-5 text-2xl font-extrabold">{site.tagline}</p>
          <p className="mt-2 text-white/75">Inspiring and preparing young Zambians to succeed in a global economy.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-bold tracking-widest text-lime uppercase">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-y-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/85 hover:text-aqua">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold tracking-widest text-lime uppercase">Get in touch</h2>
          <ul className="mt-4 space-y-2 text-white/85">
            <li>{site.address}</li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-aqua">
                {site.email}
              </a>
            </li>
            {site.phone && (
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-aqua">
                  {site.phone}
                </a>
              </li>
            )}
          </ul>
          <ul className="mt-5 flex flex-wrap gap-3">
            {site.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  className="inline-flex min-h-10 items-center rounded-full border border-white/30 px-4 text-sm font-semibold hover:border-aqua hover:text-aqua"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-sm text-white/60 sm:px-6">
          © {year} {site.name}. A member of JA Worldwide.
        </p>
      </div>
    </footer>
  );
}
