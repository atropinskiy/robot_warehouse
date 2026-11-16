import { and, setup } from 'xstate';
import type { RobotContext, RobotEvent, RobotInput } from './robot.types';

export const robotMachine = setup({
  types: {
    context: {} as RobotContext,
    input: {} as RobotInput,
    events: {} as RobotEvent,
  },
  guards: {
    'command.own': () => false,
    'route.isValid': () => false,
    'route.hasWaypoint': () => false,
    'route.continues': () => false,
    'route.completes': () => false,
  },
  actions: {
    assignRoute: () => undefined,
    reachWaypoint: () => undefined,
    notifyMoveCompleted: () => undefined,
    clearRoute: () => undefined,
  },
}).createMachine({
  id: 'robot',
  initial: 'idle',
  context: ({ input }) => ({
    id: input.id,
    position: input.position,
    route: [],
  }),
  states: {
    idle: {
      on: {
        'robot.route.assign': {
          guard: and(['command.own', 'route.isValid']),
          target: 'atWaypoint',
          actions: 'assignRoute',
        },
      },
    },
    atWaypoint: {
      on: {
        'robot.move.start': {
          guard: 'route.hasWaypoint',
          target: 'moving',
        },
        'robot.pause': {
          guard: 'command.own',
          target: 'paused',
        },
        'robot.stop': {
          guard: 'command.own',
          target: 'stopped',
          actions: 'clearRoute',
        },
      },
    },
    moving: {
      on: {
        'robot.waypoint.reached': [
          {
            guard: 'route.continues',
            target: 'atWaypoint',
            actions: ['reachWaypoint', 'notifyMoveCompleted'],
          },
          {
            guard: 'route.completes',
            target: 'idle',
            actions: ['reachWaypoint', 'notifyMoveCompleted'],
          },
        ],
      },
    },
    paused: {
      on: {
        'robot.resume': {
          guard: and(['command.own', 'route.hasWaypoint']),
          target: 'atWaypoint',
        },
        'robot.pause': {
          guard: 'command.own',
        },
        'robot.stop': {
          guard: 'command.own',
          target: 'stopped',
          actions: 'clearRoute',
        },
      },
    },
    stopped: {
      on: {
        'robot.reset': {
          guard: 'command.own',
          target: 'idle',
        },
        'robot.stop': {
          guard: 'command.own',
        },
      },
    },
  },
});
