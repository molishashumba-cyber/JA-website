import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Montserrat is the JA Worldwide brand typeface.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Junior Achievement Zambia | The Future Starts Here",
    template: "%s | Junior Achievement Zambia",
  },
  description:
    "Junior Achievement Zambia equips young people with financial literacy, entrepreneurship and work-readiness skills. A member of JA Worldwide.",
};

export const viewport: Viewport = {
  themeColor: "#22404d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
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
      </body>
    </html>
  );
}
