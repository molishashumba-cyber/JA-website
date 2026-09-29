import { BirdSymbol } from "@/components/BirdSymbol";
import { Button } from "@/components/Button";

type Props = {
  title?: string;
  text?: string;
};

// Closing call-to-action used at the bottom of most pages.
export function CtaBand({
  title = "Help shape the future of Zambia's young people",
  text = "Partner with us, volunteer your time or make a donation.",
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-lime text-dark">
      <BirdSymbol className="absolute -top-8 right-8 -z-10 hidden h-72 w-auto lg:block" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="max-w-2xl text-3xl leading-tight font-extrabold sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-lg font-medium">{text}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/get-involved#partner" variant="dark">
            Partner with us
          </Button>
          <Button href="/get-involved#volunteer" variant="outlineDark">
            Volunteer
          </Button>
          <Button href="/get-involved#donate" variant="outlineDark">
            Donate
          </Button>
        </div>
      </div>
    </section>
  );
}
