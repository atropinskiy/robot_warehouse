import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Image from "next/image";
import { Card, CardContent, CardHeader, Heading, Text } from "@/shared/ui";

const robots = [
  {
    id: "mule",
    name: "Мул",
    description:
      "Низкий робот с подъёмной платформой. Перевозит грузы между станциями.",
  },
  {
    id: "lifter",
    name: "Штабелёр",
    description: "Погрузчик с мачтой и вилами для тяжёлых паллет.",
  },
  {
    id: "picker",
    name: "Сборщик",
    description: "Робот с манипуляторами и экраном для штучного отбора.",
  },
] as const;

const directions = [
  { id: "up", label: "Вверх" },
  { id: "right", label: "Вправо" },
  { id: "down", label: "Вниз" },
  { id: "left", label: "Влево" },
] as const;

const meta = { title: "UI Kit/Спрайты роботов" } satisfies Meta;
export default meta;

export const Catalog: StoryObj<typeof meta> = {
  name: "Каталог",
  render: () => (
    <main className="mx-auto max-w-5xl space-y-5">
      <header className="space-y-2">
        <Heading as="h1" variant="page">
          Спрайты роботов
        </Heading>
        <Text tone="muted">
          Три модели, четыре направления. Область рисования SVG 64 × 64
          соответствует одной клетке карты.
        </Text>
      </header>

      {robots.map(({ id, name, description }) => (
        <Card key={id}>
          <CardHeader>
            <Heading as="h2" variant="section">
              {id.toUpperCase()} — «{name}»
            </Heading>
            <Text tone="muted">{description}</Text>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {directions.map((direction) => {
                const spriteName = `${id}_${direction.id}`;

                return (
                  <li key={direction.id} className="rounded-lg bg-muted p-3">
                    <figure className="flex flex-col items-center gap-1 text-center">
                      <Image
                        src={`./robots/${id}/${spriteName}.svg`}
                        width={128}
                        height={128}
                        className="size-24 sm:size-32"
                        alt=""
                        unoptimized
                      />
                      <figcaption>
                        <Text as="span" variant="caption" className="block">
                          {direction.label}
                        </Text>
                        <code className="text-xs text-muted-foreground">
                          {spriteName}
                        </code>
                      </figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ))}
    </main>
  ),
};
