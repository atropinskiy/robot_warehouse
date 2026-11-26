import type { ReactNode } from "react";
import { Sidebar } from "@/widgets/sidebar";
import { Topbar } from "@/widgets/topbar";

// TODO: проверять сессию и редиректить неавторизованных на вход (F4.3).
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen flex-1 md:grid-cols-[248px_1fr]">
      <Sidebar className="sticky top-0 hidden h-screen overflow-y-auto md:flex" />
      <div className="min-w-0 px-4 pt-4 pb-10 md:px-8 md:pt-5.5">
        <header className="mb-7">
          <Topbar />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
