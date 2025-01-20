import type { Metadata } from "next";
import "./globals.css";

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
      <body
        className={`${""}`}
      >
        {children}
      </body>
    </html>
  );
}
