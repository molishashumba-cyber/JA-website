type Props = {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
  center?: boolean;
};

export function SectionHeading({ eyebrow, title, text, light = false, center = false }: Props) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p className={`text-sm font-bold tracking-widest uppercase ${light ? "text-lime" : "text-azure"}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-3xl leading-tight font-extrabold sm:text-4xl ${light ? "text-white" : "text-dark"}`}>
        {title}
      </h2>
      {text && <p className={`mt-4 text-lg leading-relaxed ${light ? "text-white/85" : "text-dark/75"}`}>{text}</p>}
    </div>
  );
}
