import { useId, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { AddIcon } from "@/shared/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Heading,
  HStack,
  Input,
  Label,
  Text,
  VStack,
} from "@/shared/ui";

const warehouses = [
  {
    id: "central",
    name: "Центральный склад",
    status: "Симуляция идёт",
    tone: "success",
    robots: 4,
  },
  {
    id: "north",
    name: "Склад «Север»",
    status: "Пауза",
    tone: "warning",
    robots: 3,
  },
] as const;

function WarehousesPreview({ onCreate }: { onCreate: () => void }) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("ru");
  const visibleWarehouses = warehouses.filter(({ name }) =>
    name.toLocaleLowerCase("ru").includes(normalizedQuery),
  );

  return (
    <VStack className="mx-auto max-w-4xl" gap="lg">
      <HStack align="center" justify="between" className="flex-wrap">
        <Heading as="h1" variant="page">
          Мои склады
        </Heading>
        <Button type="button" onClick={onCreate}>
          <AddIcon aria-hidden="true" />
          Новый склад
        </Button>
      </HStack>
      <VStack gap="sm" className="max-w-sm">
        <Label htmlFor={searchId}>Поиск по названию</Label>
        <Input
          id={searchId}
          type="search"
          placeholder="Например, Север"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </VStack>
      <div className="grid gap-4 sm:grid-cols-2" aria-live="polite">
        {visibleWarehouses.map(({ id, name, status, tone, robots }) => (
          <Card key={id}>
            <CardHeader>
              <HStack align="start" justify="between" className="flex-wrap">
                <Heading as="h2" variant="card">
                  {name}
                </Heading>
                <Badge variant={tone}>{status}</Badge>
              </HStack>
            </CardHeader>
            <CardContent>
              <HStack gap="lg" className="flex-wrap">
                <Text tone="muted">
                  Роботы{" "}
                  <Text as="span" variant="mono">
                    {robots}
                  </Text>
                </Text>
                <Text tone="muted">
                  Карта{" "}
                  <Text as="span" variant="mono">
                    20 × 20
                  </Text>
                </Text>
              </HStack>
            </CardContent>
          </Card>
        ))}
        {visibleWarehouses.length === 0 && (
          <Text tone="muted">Склады не найдены.</Text>
        )}
      </div>
    </VStack>
  );
}

const meta = {
  title: "Examples/Warehouses",
  component: WarehousesPreview,
  args: { onCreate: fn() },
} satisfies Meta<typeof WarehousesPreview>;
export default meta;

export const Default: StoryObj<typeof meta> = {};
