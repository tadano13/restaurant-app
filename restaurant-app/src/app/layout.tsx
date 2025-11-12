import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // [cite: 382]

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Restaurant QR Ordering System", // You can customize this
  description: "Order food easily from your table.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}