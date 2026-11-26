import type { ReactNode } from "react";
import { Sidebar } from "@/widgets/sidebar";
import { Topbar } from "@/widgets/topbar";
import { RequireAuth } from "./require-auth";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div className="grid min-h-screen flex-1 md:grid-cols-[248px_1fr]">
        <Sidebar className="sticky top-0 hidden h-screen overflow-y-auto md:flex" />
        <div className="min-w-0 px-4 pt-4 pb-10 md:px-8 md:pt-5.5">
          <header className="mb-7">
            <Topbar />
          </header>
          <main>{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
