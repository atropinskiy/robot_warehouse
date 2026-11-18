import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddIcon } from "@/shared/icons";
import { Badge, Button, HStack, Input, Label, Text, VStack } from "@/shared/ui";

const meta = { title: "UI Kit/Controls" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
  render: () => (
    <HStack align="center" className="flex-wrap">
      <Button type="button">Сохранить</Button>
      <Button type="button" variant="secondary">
        Пауза
      </Button>
      <Button type="button" variant="outline">
        Отмена
      </Button>
      <Button type="button" variant="destructive">
        Удалить
      </Button>
      <Button type="button" disabled>
        Недоступно
      </Button>
      <Button type="button" size="icon" aria-label="Добавить склад">
        <AddIcon aria-hidden="true" />
      </Button>
    </HStack>
  ),
};

export const Fields: Story = {
  render: () => (
    <VStack className="max-w-sm" gap="lg">
      <VStack gap="sm">
        <Label htmlFor="warehouse-name">Название склада</Label>
        <Input id="warehouse-name" placeholder="Введите название" />
      </VStack>
      <VStack gap="sm">
        <Label htmlFor="warehouse-code">Код склада</Label>
        <Input
          id="warehouse-code"
          aria-invalid
          aria-describedby="warehouse-code-error"
        />
        <Text id="warehouse-code-error" variant="caption" tone="danger">
          Укажите код склада.
        </Text>
      </VStack>
      <VStack gap="sm">
        <Label htmlFor="warehouse-id">Идентификатор</Label>
        <Input id="warehouse-id" defaultValue="WH-001" disabled />
      </VStack>
    </VStack>
  ),
};

export const Badges: Story = {
  render: () => (
    <HStack align="center" className="flex-wrap">
      <Badge variant="success">Свободен</Badge>
      <Badge variant="info">Выполняет задание</Badge>
      <Badge variant="warning">Ожидает</Badge>
      <Badge variant="destructive">Неисправен</Badge>
      <Badge variant="outline">Наблюдатель</Badge>
    </HStack>
  ),
};
