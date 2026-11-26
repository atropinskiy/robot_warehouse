import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ActiveNavLink } from "./active-nav-link";
import { navLinkClassName } from "./nav-link-styles";

type NavLinkProps = {
  href: string;
  children: ReactNode;
};

/**
 * Пункт меню с подсветкой активного раздела.
 * Suspense нужен для cacheComponents: на динамических роутах usePathname
 * приостанавливает рендер, и без границы сборка упадёт.
 */
export function NavLink({ href, children }: NavLinkProps) {
  return (
    <Suspense
      fallback={
        <Link href={href} className={navLinkClassName}>
          {children}
        </Link>
      }
    >
      <ActiveNavLink href={href}>{children}</ActiveNavLink>
    </Suspense>
  );
}
