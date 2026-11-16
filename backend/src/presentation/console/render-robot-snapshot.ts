import type { SnapshotFrom } from 'xstate';
import type { robotMachine } from '../../domain/robot/robot.machine';

export type RobotSnapshot = Pick<
  SnapshotFrom<typeof robotMachine>,
  'value' | 'context'
>;

type RenderRobotSnapshot = (snapshot: RobotSnapshot) => string;

const ROBOT_SYMBOLS: Record<RobotSnapshot['value'], string> = {
  idle: 'L',
  atWaypoint: 'O',
  moving: 'O',
  paused: 'P',
  stopped: 'S',
};

export const renderRobotSnapshot: RenderRobotSnapshot = ({
  value,
  context,
}) => {
  const { id, position, route } = context;
  const rows = Array.from({ length: 10 }, (_, y) => {
    const cells = Array.from({ length: 10 }, (_, x) => {
      if (position.x === x && position.y === y) {
        return ROBOT_SYMBOLS[value];
      }

      return route.some((waypoint) => waypoint.x === x && waypoint.y === y)
        ? '.'
        : ' ';
    });

    return `${y}|${cells.join('')}|`;
  });

  return [
    `robot=${id} state=${value} position=(${position.x},${position.y}) remaining=${route.length}`,
    '  0123456789',
    ...rows,
  ].join('\n');
};
