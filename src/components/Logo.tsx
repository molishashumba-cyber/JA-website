import Image from "next/image";

type Props = {
  variant?: "color" | "white";
  className?: string;
};

// Horizontal lockup: symbol + "Junior Achievement Zambia | Member of JA Worldwide"
export function Logo({ variant = "color", className }: Props) {
  const src = variant === "white" ? "/brand/lockup-horizontal-white.svg" : "/brand/lockup-horizontal.svg";
  return (
    <Image
      src={src}
      alt="Junior Achievement Zambia, Member of JA Worldwide"
      width={580}
      height={141}
      className={className}
      unoptimized
      preload
    />
  );
}
