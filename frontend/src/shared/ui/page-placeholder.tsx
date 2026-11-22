import Link from "next/link";
import { routes } from "@/shared/config";
import { ArrowLeftIcon } from "@/shared/icons";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Heading } from "./heading";
import { Text } from "./text";

type PagePlaceholderProps = {
  title: string;
  description: string;
};

/** Заглушка для разделов, которые ещё не реализованы. */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <>
      <Heading as="h1" variant="page" className="mb-1.5">
        {title}
      </Heading>
      <Text tone="muted" className="mb-6 text-[15px]">
        {description}
      </Text>

      <Card className="max-w-xl rounded-[14px] border-dashed">
        <CardContent className="flex flex-col items-start gap-4">
          <div>
            <Heading as="h2" variant="card">
              Раздел в разработке
            </Heading>
            <Text tone="muted">
              Здесь скоро появится функциональность. Пока можно вернуться на
              главную.
            </Text>
          </div>
          <Button asChild variant="outline">
            <Link href={routes.dashboard}>
              <ArrowLeftIcon aria-hidden="true" />
              На главную
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
