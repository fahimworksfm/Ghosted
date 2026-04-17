import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apply Now | MegaCorp Industries™ Careers",
  description:
    "Submit your resume for guaranteed rejection. Our ATS evaluates all candidates with equal disdain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-950">{children}</body>
    </html>
  );
}
