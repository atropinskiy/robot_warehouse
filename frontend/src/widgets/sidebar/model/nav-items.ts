import type { ComponentType, SVGProps } from "react";
import { mockWarehouses } from "@/entities/warehouse";
import { routes, type AppRoute } from "@/shared/config";
import {
  AssistantIcon,
  DispatcherIcon,
  HistoryIcon,
  MapEditorIcon,
  MembersIcon,
  SettingsIcon,
  TasksIcon,
  WarehouseIcon,
} from "@/shared/icons";

export type NavItem = {
  href: AppRoute;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  count?: number;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

// TODO: счётчики брать из API (склады пользователя, задания в очереди).
const MOCK_QUEUED_TASKS = 14;

export const mainNavigation: NavGroup[] = [
  {
    items: [
      {
        href: routes.warehouses,
        label: "Склады",
        icon: WarehouseIcon,
        count: mockWarehouses.length,
      },
      { href: routes.dispatch, label: "Диспетчерская", icon: DispatcherIcon },
      { href: routes.mapEditor, label: "Редактор карты", icon: MapEditorIcon },
      {
        href: routes.tasks,
        label: "Задания",
        icon: TasksIcon,
        count: MOCK_QUEUED_TASKS,
      },
      { href: routes.history, label: "История", icon: HistoryIcon },
    ],
  },
  {
    label: "Команда",
    items: [
      { href: routes.members, label: "Участники", icon: MembersIcon },
      { href: routes.assistant, label: "AI-помощник", icon: AssistantIcon },
    ],
  },
];

export const footerNavigation: NavItem[] = [
  { href: routes.settings, label: "Настройки", icon: SettingsIcon },
];
