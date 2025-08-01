import type { Metadata } from "next";
import { Inter, DM_Serif_Text, Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSerifText = DM_Serif_Text({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-nunito",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Neuro Reset Awareness Seminar - Dexabrain",
  description: "Join Prof Andy Hsu & Dr Diana Chan for a free seminar on holistic, neuroscience-backed chronic pain management. September 7, 2025 at West Forum, Trehaus.",
  keywords: ["chronic pain", "neuroscience", "holistic health", "seminar", "Dexabrain"],
  authors: [{ name: "Dexabrain" }],
  openGraph: {
    title: "Neuro Reset Awareness Seminar - Dexabrain",
    description: "Free seminar on holistic, neuroscience-backed chronic pain management",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${dmSerifText.variable} ${nunito.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
