import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "동행방",
  title: "동행방 | 소그룹 체크인과 기도제목 기록",
  description: "카톡에 흘러가는 소그룹 안부와 기도제목을 리더가 함께 기억하도록 돕는 모바일 체크인 앱",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "동행방 | 소그룹 체크인과 기도제목 기록",
    description: "소그룹 안부와 기도제목을 리더가 함께 기억하도록 돕는 모바일 체크인 앱",
    siteName: "동행방",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "동행방 | 소그룹 체크인과 기도제목 기록",
    description: "소그룹 안부와 기도제목을 리더가 함께 기억하도록 돕는 모바일 체크인 앱",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2F6F5E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
