import { Text } from "@/shared/ui";
import type { NavItem } from "../model/nav-items";
import { NavLink } from "./nav-link";

export function NavItemLink({ item }: { item: NavItem }) {
  const Icon = item.icon;

  return (
    <li>
      <NavLink href={item.href}>
        <Icon aria-hidden="true" />
        {item.label}
        {item.count !== undefined && (
          <Text
            as="span"
            variant="mono"
            tone="muted"
            className="ml-auto rounded-md bg-muted px-1.5 text-[11px] font-medium"
          >
            {item.count}
          </Text>
        )}
      </NavLink>
    </li>
  );
}
