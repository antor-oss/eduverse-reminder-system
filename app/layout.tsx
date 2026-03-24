import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduVerse Reminder System",
  description: "University reminder system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}