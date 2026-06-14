import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-family",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simustratum — Practice. Speak. Defend.",
  description:
    "Simustratum puts you in front of AI panelists who ask hard questions — just like in your real defense, seminar, or oral exam. Practice until it feels easy.",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="overflow-x-hidden bg-cream font-inter text-ink">
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
