import Link from "next/link";
import { routes } from "@/shared/config";
import {
  AddIcon,
  AiTaskIcon,
  NotificationsIcon,
  SearchIcon,
} from "@/shared/icons";
import { Button, HStack, Input } from "@/shared/ui";
import { UserMenu } from "./user-menu";

export function Topbar() {
  return (
    <HStack align="center" gap="md">
      {/* TODO: глобальный поиск по складам, роботам и заданиям. */}
      <div className="relative hidden w-full max-w-[420px] md:block">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          aria-label="Поиск"
          placeholder="Поиск склада, робота, задания…"
          className="h-10 rounded-[10px] border-border bg-card pr-16 pl-9"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-[5px] border border-border px-1.5 font-mono text-[11px] text-muted-foreground">
          Ctrl K
        </kbd>
      </div>

      <div className="flex-1" />

      {/* TODO: создание задания из текста через AI (features/ai-task-draft). */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="hidden border-ai/45 bg-card text-ai hover:bg-ai/10 hover:text-ai md:inline-flex"
      >
        <AiTaskIcon aria-hidden="true" />
        Задание из текста
      </Button>

      {/* TODO: центр уведомлений. */}
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label="Уведомления"
        className="relative border-border bg-card"
      >
        <NotificationsIcon aria-hidden="true" />
        <span
          aria-hidden="true"
          className="absolute top-2 right-2 size-2 rounded-full border-2 border-card bg-destructive"
        />
      </Button>

      <Button asChild size="lg" className="font-semibold">
        <Link href={routes.warehouses}>
          <AddIcon aria-hidden="true" />
          Новый склад
        </Link>
      </Button>

      <UserMenu />
    </HStack>
  );
}
