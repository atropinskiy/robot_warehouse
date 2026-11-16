import type { RobotCommand, RobotContext } from './robot.types';

type AssignRoute = (args: {
  context: RobotContext;
  event: Extract<RobotCommand, { type: 'robot.route.assign' }>;
}) => RobotContext;

export const assignRoute: AssignRoute = ({ context, event }) => ({
  ...context,
  route: [...event.route],
});

type ReachWaypoint = (args: { context: RobotContext }) => RobotContext;

export const reachWaypoint: ReachWaypoint = ({ context }) => ({
  ...context,
  position: context.route[0],
  route: context.route.slice(1),
});

type ClearRoute = (args: { context: RobotContext }) => RobotContext;

export const clearRoute: ClearRoute = ({ context }) => ({
  ...context,
  route: [],
});
