import { Button } from "@/components/Button";

// Temporary content for pages that are built in Stage 4.
export function ComingSoon({ children }: { children?: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl rounded-2xl bg-pearl p-6 sm:p-8">
        <p className="text-lg font-semibold text-dark">This page is being built.</p>
        <p className="mt-2 text-dark/75">The full page will arrive in the next stage of the new JA Zambia website.</p>
        {children}
        <Button href="/" variant="teal" className="mt-6">
          Back to home
        </Button>
      </div>
    </section>
  );
}
