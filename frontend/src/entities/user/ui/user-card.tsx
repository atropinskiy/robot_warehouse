import { Text } from "@/shared/ui";
import type { User } from "../model/types";

/** «Иван Петров» → «ИП», «Оператор» → «ОП». */
function getInitials(name: string) {
  const words = name.trim().split(/\s+/);
  const initials =
    words.length > 1 ? words.map((word) => word[0]).join("") : words[0];
  return initials.slice(0, 2).toUpperCase();
}

export function UserCard({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border p-2.5">
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-135 from-info to-ai text-xs font-bold text-background"
      >
        {getInitials(user.name)}
      </span>
      <div className="min-w-0">
        <Text className="truncate font-medium">{user.name}</Text>
        <Text variant="caption" tone="muted" className="truncate">
          {user.email}
        </Text>
      </div>
    </div>
  );
}
