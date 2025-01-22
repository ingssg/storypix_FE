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
