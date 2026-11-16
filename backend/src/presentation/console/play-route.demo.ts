import { setTimeout } from 'node:timers/promises';
import { createActor } from 'xstate';
import { makePosition } from '../../domain/robot/position';
import { robotMachine } from '../../domain/robot/robot.machine';
import type { RobotId } from '../../domain/robot/robot.types';
import { playRoute } from './play-route';

const route = [
  makePosition(2, 1),
  makePosition(2, 2),
  makePosition(1, 2),
  makePosition(1, 1),
];
const cellDurationMs = Number(process.argv[2] ?? 500);

const actor = createActor(
  robotMachine.provide({ guards: { 'route.isValid': () => true } }),
  {
    input: {
      id: 'robot-1' as RobotId,
      position: makePosition(1, 1),
    },
  },
);

process.stdout.write(
  'Console demo: route validation is temporarily bypassed. Empty 10x10 field.\n\n',
);

void playRoute({
  actor,
  route,
  cellDurationMs,
  writeFrame: (frame) => {
    process.stdout.write(`${frame}\n\n`);
  },
  waitForMove: (durationMs) => setTimeout(durationMs),
}).catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
