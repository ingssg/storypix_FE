import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const hammersmith = localFont({
  src: "../fonts/HammersmithOne-Regular.ttf",
  display: "swap",
  variable: "--font-hammersmith",
});

export const metadata: Metadata = {
  title: "StoryPix",
  description: "for Children",
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  formatDetection: {
    email: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} ${hammersmith.className} font-pretendard`}>{children}</body>
    </html>
  );
}
