import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardContent, HStack, Text, VStack } from "@/shared/ui";

const meta = { title: "UI Kit/Layout" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Stacks: Story = {
  render: () => (
    <VStack gap="lg" align="start">
      <HStack gap="sm">
        <Card size="sm">
          <CardContent>Склад</CardContent>
        </Card>
        <Card size="sm">
          <CardContent>Роботы</CardContent>
        </Card>
      </HStack>
      <Card>
        <CardContent>
          <VStack gap="sm">
            <Text>Очередь заданий</Text>
            <Text variant="mono" tone="muted">
              14
            </Text>
          </VStack>
        </CardContent>
      </Card>
    </VStack>
  ),
};
