import Link from "next/link";
import type { ReactNode } from "react";

const styles = {
  lime: "bg-lime text-dark hover:bg-[#a0d155]",
  teal: "bg-teal text-white hover:bg-teal-dark",
  dark: "bg-dark text-white hover:bg-boundless",
  outlineLight: "border-2 border-white text-white hover:bg-white hover:text-dark",
  outlineDark: "border-2 border-dark text-dark hover:bg-dark hover:text-white",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
};

export function Button({ href, children, variant = "lime", className = "" }: Props) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-bold transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
