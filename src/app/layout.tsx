import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { allowIndexing, siteUrl } from "@/lib/site-url";
import "./globals.css";

// Montserrat is the JA Worldwide brand typeface.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Junior Achievement Zambia",
  openGraph: {
    type: "website",
    siteName: "Junior Achievement Zambia",
    locale: "en_ZM",
  },
  twitter: { card: "summary_large_image" },
  robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
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
      <body className="flex min-h-dvh flex-col font-sans">{children}</body>
    </html>
  );
}
