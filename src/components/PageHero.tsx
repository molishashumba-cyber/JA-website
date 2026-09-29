import { BirdSymbol } from "@/components/BirdSymbol";

type Props = {
  eyebrow: string;
  title: string;
  text?: string;
};

export function PageHero({ eyebrow, title, text }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-dark text-white">
      <BirdSymbol color="#285f74" className="absolute -top-10 -right-16 -z-10 hidden h-72 w-auto sm:block" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-bold tracking-widest text-lime uppercase">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-4xl leading-tight font-extrabold sm:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-lg text-white/85">{text}</p>}
      </div>
    </section>
  );
}
