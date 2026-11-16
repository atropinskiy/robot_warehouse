import { and, assertEvent, assign, setup } from 'xstate';
import { assignRoute, clearRoute, reachWaypoint } from './robot.actions';
import {
  hasWaypoint,
  isOwnCommand,
  routeCompletes,
  routeContinues,
} from './robot.guards';
import type { RobotContext, RobotEvent, RobotInput } from './robot.types';

export const robotMachine = setup({
  types: {
    context: {} as RobotContext,
    input: {} as RobotInput,
    events: {} as RobotEvent,
  },
  guards: {
    'command.own': isOwnCommand,
    // TODO: Реализовать проверку маршрута с учётом планировки и покрыть интеграционным тестом без подмены guard.
    'route.isValid': () => false,
    'route.hasWaypoint': hasWaypoint,
    'route.continues': routeContinues,
    'route.completes': routeCompletes,
  },
  actions: {
    assignRoute: assign(({ context, event }) => {
      assertEvent(event, 'robot.route.assign');
      return assignRoute({ context, event });
    }),
    reachWaypoint: assign(reachWaypoint),
    notifyMoveCompleted: () => undefined,
    clearRoute: assign(clearRoute),
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
