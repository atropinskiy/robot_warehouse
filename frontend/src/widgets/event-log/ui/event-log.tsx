import { Card, CardContent, CardHeader, Heading, Text } from "@/shared/ui";
import {
  mockEvents,
  type EventTone,
  type SimulationEvent,
} from "../model/mocks";

const toneStyles: Record<EventTone, string> = {
  default: "",
  success: "text-success",
  error: "text-destructive",
};

export function EventLog({
  events = mockEvents,
}: {
  events?: SimulationEvent[];
}) {
  return (
    <Card className="rounded-[14px]">
      <CardHeader>
        <Heading as="h3" variant="section" className="text-[15px]">
          Журнал событий
        </Heading>
      </CardHeader>
      <CardContent>
        <ul className="text-[13px]">
          {events.map(({ id, time, tone, message }) => (
            <li key={id} className="grid grid-cols-[62px_1fr] gap-2 py-1.5">
              <Text as="span" variant="mono" tone="muted" className="pt-px">
                <time>{time}</time>
              </Text>
              <span className={toneStyles[tone]}>
                {message.map((part, index) =>
                  typeof part === "string" ? (
                    part
                  ) : (
                    <b key={index} className="font-semibold">
                      {part.strong}
                    </b>
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
