import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as icons from "@/shared/icons";
import { Button, HStack, Input } from "@/shared/ui";

const groups = {
  Навигация: {
    WarehouseIcon: "Склады",
    DispatcherIcon: "Диспетчерская",
    MapEditorIcon: "Редактор карты",
    TasksIcon: "Задания",
    HistoryIcon: "История",
    MembersIcon: "Участники",
    AssistantIcon: "AI-помощник",
    SettingsIcon: "Настройки",
  },
  Действия: {
    SearchIcon: "Поиск",
    AiTaskIcon: "Задание из текста",
    NotificationsIcon: "Уведомления",
    AddIcon: "Добавить",
    MoreIcon: "Ещё действия",
    MenuIcon: "Открыть меню",
    MinusIcon: "Убавить",
    EditIcon: "Редактировать",
    DeleteIcon: "Удалить",
    ConfirmIcon: "Подтвердить",
    CloseIcon: "Закрыть",
    FilterIcon: "Фильтровать",
    RefreshIcon: "Обновить",
    CopyIcon: "Копировать",
    SaveIcon: "Сохранить",
    DownloadIcon: "Скачать",
    UploadIcon: "Загрузить",
    ExternalLinkIcon: "Внешняя ссылка",
  },
  "Стрелки и раскрытие": {
    ArrowLeftIcon: "Назад",
    ArrowRightIcon: "Вперёд",
    ArrowUpIcon: "Вверх",
    ArrowDownIcon: "Вниз",
    ChevronLeftIcon: "Предыдущая страница",
    ChevronRightIcon: "Следующая страница",
    ChevronUpIcon: "Свернуть",
    ChevronDownIcon: "Раскрыть",
  },
  Симуляция: {
    PlayIcon: "Запустить",
    PauseIcon: "Пауза",
    StopIcon: "Остановить",
    ResetIcon: "Сбросить",
    RobotIcon: "Робот",
    PackageIcon: "Груз",
  },
  Статусы: {
    InfoIcon: "Информация",
    WarningIcon: "Предупреждение",
  },
  "Редактор карты": {
    ZoomInIcon: "Увеличить",
    ZoomOutIcon: "Уменьшить",
    FullscreenIcon: "Полный экран",
    PanIcon: "Переместить карту",
    SelectIcon: "Выбрать объект",
    StationIcon: "Станция",
  },
} satisfies Record<string, Partial<Record<keyof typeof icons, string>>>;

const meta = { title: "UI Kit/Icons" } satisfies Meta;
export default meta;

export const Catalog: StoryObj<typeof meta> = {
  name: "Каталог",
  render: () => (
    <main className="mx-auto max-w-5xl space-y-8">
      <h1 className="font-display text-2xl font-semibold">Иконки</h1>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Пример использования</h2>
        <HStack align="center" justify="between" className="flex-wrap">
          <div className="relative w-full max-w-xs">
            <icons.SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              type="search"
              aria-label="Поиск по складам"
              placeholder="Поиск склада, робота, задания…"
              className="pl-9"
            />
          </div>

          <HStack align="center" gap="sm" className="flex-wrap">
            <Button type="button" variant="outline" className="text-ai">
              <icons.AiTaskIcon aria-hidden="true" />
              Задание из текста
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Уведомления"
            >
              <icons.NotificationsIcon aria-hidden="true" />
            </Button>
            <Button type="button">
              <icons.AddIcon aria-hidden="true" />
              Новый склад
            </Button>
          </HStack>
        </HStack>
      </section>

      {Object.entries(groups).map(([title, entries]) => (
        <section key={title} className="space-y-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3">
            {Object.entries(entries).map(([name, label]) => {
              const Icon = icons[name as keyof typeof icons];

              return (
                <li
                  key={name}
                  className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-card p-3 text-center"
                >
                  <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
                  <span>{label}</span>
                  <code className="break-all text-xs text-muted-foreground">
                    {name}
                  </code>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  ),
};
