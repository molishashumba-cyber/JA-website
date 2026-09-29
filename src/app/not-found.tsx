import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <p className="text-sm font-bold tracking-widest text-azure uppercase">Page not found</p>
          <h1 className="mt-2 text-4xl font-extrabold text-dark">We couldn&apos;t find that page</h1>
          <Button href="/" variant="teal" className="mt-8">
            Back to home
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}
