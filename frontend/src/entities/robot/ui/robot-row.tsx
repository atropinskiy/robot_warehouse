import Image from "next/image";
import { getRobotSpriteSrc } from "@/shared/config";
import { HStack, Text } from "@/shared/ui";
import type { Robot } from "../model/types";
import { RobotStatusBadge } from "./robot-status-badge";

export function RobotRow({ robot }: { robot: Robot }) {
  const { name, model, direction, position, status, note } = robot;

  return (
    <HStack align="center" gap="md" className="py-2">
      <Image
        src={getRobotSpriteSrc(model, direction)}
        alt=""
        width={40}
        height={40}
        unoptimized
        className="size-10 shrink-0 rounded-lg bg-muted"
      />
      <div className="min-w-0">
        <Text className="font-semibold">
          {name}
          <Text as="span" variant="mono" tone="muted" className="ml-1.5">
            ({position.x}, {position.y})
          </Text>
        </Text>
        <Text variant="caption" tone="muted" className="truncate">
          {note}
        </Text>
      </div>
      <div className="ml-auto shrink-0">
        <RobotStatusBadge status={status} />
      </div>
    </HStack>
  );
}
