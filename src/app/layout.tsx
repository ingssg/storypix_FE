import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import GtagWrapper from "@/components/gtagWrapper";
import { Suspense } from "react";

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
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
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
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CMDTLDZ8M4"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-CMDTLDZ8M4');
          `}
        </Script>
      </head>
      <body
        className={`${pretendard.className} ${hammersmith.className} font-pretendard`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <GtagWrapper />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
