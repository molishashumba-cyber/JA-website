import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

// Header and footer for the public website (the admin area has its own layout).
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-lime px-4 py-2 font-bold text-dark focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
