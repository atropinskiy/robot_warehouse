import { makePosition } from './position';
import {
  hasWaypoint,
  isOwnCommand,
  routeCompletes,
  routeContinues,
} from './robot.guards';
import type {
  Position,
  RobotCommand,
  RobotContext,
  RobotId,
  RobotInternalEvent,
} from './robot.types';

const robotId = 'robot-1' as RobotId;

const createContext = (route: Position[] = []): RobotContext => ({
  id: robotId,
  position: makePosition(1, 1),
  route,
});

describe('isOwnCommand', () => {
  const commands: RobotCommand[] = [
    {
      type: 'robot.route.assign',
      robotId,
      route: [makePosition(2, 1), makePosition(1, 1)],
    },
    { type: 'robot.pause', robotId },
    { type: 'robot.resume', robotId },
    { type: 'robot.stop', robotId },
    { type: 'robot.reset', robotId },
  ];

  it.each(commands)('accepts $type addressed to this robot', (event) => {
    expect(isOwnCommand({ context: createContext(), event })).toBe(true);
  });

  it.each(commands)('rejects $type addressed to another robot', (event) => {
    expect(
      isOwnCommand({
        context: createContext(),
        event: { ...event, robotId: 'robot-2' as RobotId },
      }),
    ).toBe(false);
  });

  it.each<RobotInternalEvent>([
    { type: 'robot.move.start' },
    { type: 'robot.waypoint.reached' },
  ])('rejects internal event $type without a robot ID', (event) => {
    expect(isOwnCommand({ context: createContext(), event })).toBe(false);
  });

  it('does not mutate context or command and returns the same result on repeated calls', () => {
    const context = createContext();
    const event: RobotCommand = {
      type: 'robot.route.assign',
      robotId,
      route: [makePosition(2, 1), makePosition(1, 1)],
    };
    const originalContext = structuredClone(context);
    const originalEvent = structuredClone(event);

    Object.freeze(context.position);
    Object.freeze(context.route);
    Object.freeze(context);
    event.route.forEach(Object.freeze);
    Object.freeze(event.route);
    Object.freeze(event);

    expect(isOwnCommand({ context, event })).toBe(true);
    expect(isOwnCommand({ context, event })).toBe(true);
    expect(context).toEqual(originalContext);
    expect(event).toEqual(originalEvent);
  });
});

const routeCases = [
  {
    length: 0,
    route: [],
    hasWaypoint: false,
    continues: false,
    completes: false,
  },
  {
    length: 1,
    route: [makePosition(1, 1)],
    hasWaypoint: true,
    continues: false,
    completes: true,
  },
  {
    length: 2,
    route: [makePosition(2, 1), makePosition(1, 1)],
    hasWaypoint: true,
    continues: true,
    completes: false,
  },
  {
    length: 3,
    route: [makePosition(2, 2), makePosition(1, 2), makePosition(1, 1)],
    hasWaypoint: true,
    continues: true,
    completes: false,
  },
];

describe('hasWaypoint', () => {
  it.each(routeCases)(
    'returns $hasWaypoint for $length remaining waypoints',
    ({ route, hasWaypoint: expected }) => {
      expect(hasWaypoint({ context: createContext(route) })).toBe(expected);
    },
  );
});

describe('routeContinues', () => {
  it.each(routeCases)(
    'returns $continues for $length remaining waypoints before arrival',
    ({ route, continues: expected }) => {
      expect(routeContinues({ context: createContext(route) })).toBe(expected);
    },
  );
});

describe('routeCompletes', () => {
  it.each(routeCases)(
    'returns $completes for $length remaining waypoints before arrival',
    ({ route, completes: expected }) => {
      expect(routeCompletes({ context: createContext(route) })).toBe(expected);
    },
  );
});

describe.each([
  { name: 'hasWaypoint', guard: hasWaypoint, expected: true },
  { name: 'routeContinues', guard: routeContinues, expected: true },
  { name: 'routeCompletes', guard: routeCompletes, expected: false },
])('$name purity', ({ guard, expected }) => {
  it('does not mutate context and returns the same result on repeated calls', () => {
    const context = createContext([makePosition(2, 1), makePosition(1, 1)]);
    const originalContext = structuredClone(context);

    context.route.forEach(Object.freeze);
    Object.freeze(context.route);
    Object.freeze(context.position);
    Object.freeze(context);

    expect(guard({ context })).toBe(expected);
    expect(guard({ context })).toBe(expected);
    expect(context).toEqual(originalContext);
  });
});
