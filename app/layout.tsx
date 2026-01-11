import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextGen - Youth Civic Engagement",
  description: "Empowering young Nigerians to participate in civic life, build community, and shape the future through awareness, participation, and accountability.",
  keywords: ["civic engagement", "youth", "Nigeria", "democracy", "voter awareness", "community"],
  icons: {
    icon: '/nextgen-logo.png',
    apple: '/nextgen-logo.png',
  },
  openGraph: {
    title: "NextGen - Youth Civic Engagement",
    description: "Empowering young Nigerians to participate in civic life and shape the future.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
