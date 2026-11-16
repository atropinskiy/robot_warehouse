import type { ActorRefFrom } from 'xstate';
import type { robotMachine } from '../../domain/robot/robot.machine';
import type { Position, RobotEvent } from '../../domain/robot/robot.types';
import { renderRobotSnapshot } from './render-robot-snapshot';

type PlayRouteOptions = {
  actor: ActorRefFrom<typeof robotMachine>;
  route: Position[];
  cellDurationMs: number;
  writeFrame: (frame: string) => void;
  waitForMove: (durationMs: number) => Promise<void>;
};

type PlayRoute = (options: PlayRouteOptions) => Promise<void>;

export const playRoute: PlayRoute = async ({
  actor,
  route,
  cellDurationMs,
  writeFrame,
  waitForMove,
}) => {
  if (
    !Number.isSafeInteger(cellDurationMs) ||
    cellDurationMs <= 0 ||
    cellDurationMs > 2_147_483_647
  ) {
    throw new RangeError(
      'cellDurationMs must be an integer from 1 to 2147483647',
    );
  }

  const assignRoute: RobotEvent = {
    type: 'robot.route.assign',
    robotId: actor.getSnapshot().context.id,
    route,
  };
  const scheduled: { event: RobotEvent | null } = { event: assignRoute };
  let hasAssignedRoute = false;
  const subscription = actor.subscribe((snapshot) => {
    if (hasAssignedRoute) {
      if (snapshot.matches('atWaypoint') && snapshot.context.route.length > 0) {
        scheduled.event = { type: 'robot.move.start' };
      } else if (snapshot.matches('moving')) {
        scheduled.event = { type: 'robot.waypoint.reached' };
      } else {
        scheduled.event = null;
      }
    }

    const nextDelayMs =
      scheduled.event === null
        ? null
        : scheduled.event.type === 'robot.waypoint.reached'
          ? cellDurationMs
          : 0;
    writeFrame(
      [
        renderRobotSnapshot(snapshot),
        `timing=${JSON.stringify({ cellDurationMs, nextDelayMs })}`,
        `context=${JSON.stringify(snapshot.context)}`,
        `next=${JSON.stringify(scheduled.event)}`,
      ].join('\n'),
    );
  });

  try {
    actor.start();
    hasAssignedRoute = true;
    actor.send(assignRoute);

    if (!actor.getSnapshot().matches('atWaypoint') || route.length === 0) {
      throw new Error('Route was not accepted');
    }

    while (scheduled.event !== null) {
      const event = scheduled.event;
      if (event.type === 'robot.waypoint.reached') {
        await waitForMove(cellDurationMs);
      }

      actor.send(event);
      if (
        event.type === 'robot.move.start' &&
        !actor.getSnapshot().matches('moving')
      ) {
        throw new Error('Move could not start');
      }
    }
  } finally {
    subscription.unsubscribe();
    actor.stop();
  }
};
