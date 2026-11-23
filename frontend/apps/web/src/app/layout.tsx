import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THEN-CHOT | Cổng An Ninh Thông Minh (SecurityGate)",
  description:
    "Hệ thống kiểm soát và giám sát cổng an ninh thông minh THEN-CHOT — THEN CÀI XÓM ẤP",
};

const THEME_INIT_SCRIPT = `(function(){try{var k='then-chot-theme';var s=localStorage.getItem(k);var t=(s==='dark'||s==='light')?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
