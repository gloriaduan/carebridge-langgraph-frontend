import type { Metadata } from "next";
import { Crimson_Text, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Add your serif font - Crimson Text is elegant for community/care themes
const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Regular, Semi-bold, Bold
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "CareConnect - Community Resource Finder",
  description:
    "Discover local resources, support services, and community programs tailored to your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${crimsonText.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
