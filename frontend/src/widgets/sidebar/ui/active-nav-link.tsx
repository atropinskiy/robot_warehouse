"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { navLinkActiveClassName, navLinkClassName } from "./nav-link-styles";

type ActiveNavLinkProps = {
  href: string;
  children: ReactNode;
};

export function ActiveNavLink({ href, children }: ActiveNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(navLinkClassName, isActive && navLinkActiveClassName)}
    >
      {children}
    </Link>
  );
}
