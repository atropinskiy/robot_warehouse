import { getRobotSpriteSrc } from "@/shared/config";
import type { WarehousePreviewRobot } from "../model/types";

const COLUMNS = 20;
const ASPECT_RATIO = 1.6;
const ROWS = COLUMNS / ASPECT_RATIO;
const VISIBLE_ROWS = Math.ceil(ROWS);

/** Детерминированный генератор, чтобы сервер и клиент рисовали одно и то же. */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

type WarehouseMapPreviewProps = {
  seed: number;
  robots: WarehousePreviewRobot[];
};

/**
 * Схематичная мини-карта склада: стеллажи, станции и роботы.
 * Временная заглушка, пока превью не строится по настоящему layout.
 */
export function WarehouseMapPreview({
  seed,
  robots,
}: WarehouseMapPreviewProps) {
  const random = createRandom(seed);

  const shelves = [];
  for (let x = 3; x < COLUMNS - 2; x += 4) {
    const y = 2 + Math.floor(random() * 2);
    const length = 4 + Math.floor(random() * (VISIBLE_ROWS - 7));
    shelves.push({ x, y, length });
  }

  const randomRow = () => 1 + Math.floor(random() * (VISIBLE_ROWS - 3));
  const stations = [
    { x: 0, y: randomRow(), color: "var(--ai)" },
    { x: COLUMNS - 1, y: randomRow(), color: "var(--primary)" },
    { x: 0, y: VISIBLE_ROWS - 2, color: "var(--ai)" },
  ];

  const placedRobots = robots.map((robot, index) => ({
    ...robot,
    x: 1 + 4 * (index % 4) + (index % 2),
    y: 1 + Math.floor(random() * (VISIBLE_ROWS - 2)),
  }));

  return (
    <svg
      viewBox={`0 0 ${COLUMNS} ${ROWS}`}
      preserveAspectRatio="xMidYMid slice"
      className="block size-full bg-[#121920]"
      aria-hidden="true"
    >
      <g stroke="var(--muted)" strokeWidth={0.05}>
        {Array.from({ length: COLUMNS + 1 }, (_, i) => (
          <line key={`v${i}`} x1={i} y1={0} x2={i} y2={ROWS} />
        ))}
        {Array.from({ length: VISIBLE_ROWS + 1 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i} x2={COLUMNS} y2={i} />
        ))}
      </g>
      {shelves.map(({ x, y, length }) => (
        <rect
          key={`shelf-${x}`}
          x={x + 0.05}
          y={y + 0.05}
          width={1.9}
          height={length - 0.1}
          fill="#2F3B4A"
        />
      ))}
      {stations.map(({ x, y, color }) => (
        <g key={`station-${x}-${y}`}>
          <rect x={x} y={y} width={1} height={1} fill={color} opacity={0.3} />
          <rect
            x={x + 0.08}
            y={y + 0.08}
            width={0.84}
            height={0.84}
            fill="none"
            stroke={color}
            strokeWidth={0.06}
          />
        </g>
      ))}
      {placedRobots.map(({ model, direction, x, y }, index) => (
        <image
          key={`robot-${index}`}
          href={getRobotSpriteSrc(model, direction)}
          x={x - 0.25}
          y={y - 0.25}
          width={1.5}
          height={1.5}
        />
      ))}
    </svg>
  );
}
