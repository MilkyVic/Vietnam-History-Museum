import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import SiteHeader from "@/components/SiteHeader";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bảo tàng số 1954–1975",
  description:
    "Khám phá cuộc kháng chiến chống Mỹ cứu nước (1954–1975) qua dòng thời gian, bản đồ và tư liệu có trích dẫn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="site-container">
          <SiteHeader />
          <main>{children}</main>
          <footer>© {new Date().getFullYear()} Bảo tàng số 1954–1975 • Phiên bản trình diễn phục vụ học tập</footer>
        </div>
      </body>
    </html>
  );
}
