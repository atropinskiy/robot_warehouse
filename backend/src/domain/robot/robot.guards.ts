import type { RobotContext, RobotEvent } from './robot.types';

type CommandGuard = (args: {
  context: RobotContext;
  event: RobotEvent;
}) => boolean;

type RouteGuard = (args: { context: RobotContext }) => boolean;

export const isOwnCommand: CommandGuard = ({ context, event }) =>
  'robotId' in event && event.robotId === context.id;

export const hasWaypoint: RouteGuard = ({ context }) =>
  context.route.length > 0;

export const routeContinues: RouteGuard = ({ context }) =>
  context.route.length > 1;

export const routeCompletes: RouteGuard = ({ context }) =>
  context.route.length === 1;
