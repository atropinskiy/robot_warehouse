import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Robot Warehouse",
  description: "Платформа управления роботами на виртуальном складе",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
