import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./api/query-provider";

export const metadata: Metadata = {
  title: "Robot Warehouse",
  description: "Платформа управления роботами на виртуальном складе",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
