import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heading, Text, VStack } from "@/shared/ui";

const meta = { title: "UI Kit/Typography" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const HeadingVariants: Story = {
  render: () => (
    <VStack gap="lg">
      <Heading as="h1" variant="display">
        Robot Warehouse
      </Heading>
      <Heading as="h2" variant="page">
        Диспетчерская
      </Heading>
      <Heading as="h3" variant="section">
        Мои склады
      </Heading>
      <Heading as="h4" variant="card">
        Центральный склад
      </Heading>
      <Heading as="h5" variant="subsection">
        Параметры карты
      </Heading>
      <Heading as="h6" variant="compact">
        Размер сетки
      </Heading>
    </VStack>
  ),
};

export const TextVariants: Story = {
  render: () => (
    <VStack>
      <Text>Склад готов к запуску симуляции.</Text>
      <Text variant="caption" tone="muted">
        Последнее обновление сегодня
      </Text>
      <Text variant="mono">#T-318 · (12, 3) · 14:02:41</Text>
      <Text variant="caption" tone="danger">
        Симуляция остановлена из-за ошибки.
      </Text>
    </VStack>
  ),
};
