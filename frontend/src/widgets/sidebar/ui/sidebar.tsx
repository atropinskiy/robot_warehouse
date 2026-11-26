import Image from "next/image";
import Link from "next/link";
import { mockCurrentUser, UserCard } from "@/entities/user";
import { getRobotSpriteSrc, routes } from "@/shared/config";
import { cn } from "@/shared/lib/utils";
import { Text } from "@/shared/ui";
import { footerNavigation, mainNavigation } from "../model/nav-items";
import { NavItemLink } from "./nav-item-link";

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-1 border-r border-border bg-card px-3.5 py-5",
        className,
      )}
    >
      <Link
        href={routes.dashboard}
        className="flex items-center gap-2.5 rounded-lg px-2 pt-1 pb-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Image
          src={getRobotSpriteSrc("mule", "down")}
          alt=""
          width={36}
          height={36}
          unoptimized
          priority
        />
        <span className="font-display text-[13px] leading-[1.15] font-bold tracking-[0.04em] uppercase">
          Robot
          <span className="block text-primary">Warehouse</span>
        </span>
      </Link>

      <nav aria-label="Основная навигация" className="flex flex-1 flex-col">
        {mainNavigation.map((group, index) => (
          <div key={group.label ?? index}>
            {group.label && (
              <Text
                variant="caption"
                className="px-2.5 pt-3.5 pb-1.5 text-[11px] font-medium tracking-[0.08em] text-muted-foreground/70 uppercase"
              >
                {group.label}
              </Text>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavItemLink key={item.href} item={item} />
              ))}
            </ul>
          </div>
        ))}

        <ul className="mt-auto flex flex-col gap-0.5 pt-4">
          {footerNavigation.map((item) => (
            <NavItemLink key={item.href} item={item} />
          ))}
        </ul>
      </nav>

      <div className="mt-2.5">
        <UserCard user={mockCurrentUser} />
      </div>
    </aside>
  );
}
