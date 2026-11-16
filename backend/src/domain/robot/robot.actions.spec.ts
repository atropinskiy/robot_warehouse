import { makePosition } from './position';
import { assignRoute, clearRoute, reachWaypoint } from './robot.actions';
import type {
  Position,
  RobotCommand,
  RobotContext,
  RobotId,
} from './robot.types';

const robotId = 'robot-1' as RobotId;

const createContext = (route: Position[] = []): RobotContext => ({
  id: robotId,
  position: makePosition(1, 1),
  route,
});

const freezeContext = (context: RobotContext) => {
  context.route.forEach(Object.freeze);
  Object.freeze(context.route);
  Object.freeze(context.position);
  Object.freeze(context);
};

describe('assignRoute', () => {
  it('returns a new context with the assigned route, preserving ID and position', () => {
    const context = createContext();
    const event: Extract<RobotCommand, { type: 'robot.route.assign' }> = {
      type: 'robot.route.assign',
      robotId,
      route: [makePosition(2, 1), makePosition(1, 1)],
    };
    const originalContext = structuredClone(context);
    const originalEvent = structuredClone(event);
    freezeContext(context);
    event.route.forEach(Object.freeze);
    Object.freeze(event.route);
    Object.freeze(event);

    const result = assignRoute({ context, event });

    expect(result).toEqual({
      id: robotId,
      position: makePosition(1, 1),
      route: [makePosition(2, 1), makePosition(1, 1)],
    });
    expect(result).not.toBe(context);
    expect(assignRoute({ context, event })).toEqual(result);
    expect(context).toEqual(originalContext);
    expect(event).toEqual(originalEvent);
  });
});

describe('reachWaypoint', () => {
  it.each([
    {
      name: 'an intermediate waypoint',
      route: [makePosition(2, 1), makePosition(2, 2), makePosition(1, 1)],
      expectedPosition: makePosition(2, 1),
      expectedRoute: [makePosition(2, 2), makePosition(1, 1)],
    },
    {
      name: 'the last waypoint',
      route: [makePosition(2, 1)],
      expectedPosition: makePosition(2, 1),
      expectedRoute: [],
    },
  ])(
    'reaches $name without mutating the original context',
    ({ route, expectedPosition, expectedRoute }) => {
      const context = createContext(route);
      const originalContext = structuredClone(context);
      freezeContext(context);

      const result = reachWaypoint({ context });

      expect(result).toEqual({
        id: robotId,
        position: expectedPosition,
        route: expectedRoute,
      });
      expect(result).not.toBe(context);
      expect(reachWaypoint({ context })).toEqual(result);
      expect(context).toEqual(originalContext);
    },
  );
});

describe('clearRoute', () => {
  it.each([
    {
      name: 'a remaining route',
      route: [makePosition(2, 1), makePosition(1, 1)],
    },
    { name: 'an already empty route', route: [] },
  ])('clears $name while preserving ID and position', ({ route }) => {
    const context = createContext(route);
    const originalContext = structuredClone(context);
    freezeContext(context);

    const result = clearRoute({ context });

    expect(result).toEqual({
      id: robotId,
      position: makePosition(1, 1),
      route: [],
    });
    expect(result).not.toBe(context);
    expect(clearRoute({ context })).toEqual(result);
    expect(context).toEqual(originalContext);
  });
});
