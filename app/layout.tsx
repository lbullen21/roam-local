import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roam Local — Find your next day outside",
  description:
    "Discover trails, parks, viewpoints, and local restaurants nearby — curated by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
