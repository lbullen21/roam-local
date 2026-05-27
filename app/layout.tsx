import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roam Local — Summer Day Planner",
  description:
    "Plan your perfect summer day with local outdoor activities and dining picks, powered by AI.",
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
