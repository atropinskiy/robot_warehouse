import type { Metadata } from "next";
import "./globals.css";

import { ConnectionStatusBanner } from "@/features/connection-status";

export const metadata: Metadata = {
  title: "Robot Warehouse — Диспетчерская склада",
  description: "Платформа управления роботами на симулируемом складе в реальном времени",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ConnectionStatusBanner />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
