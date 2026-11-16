import { createActor } from 'xstate';
import { makePosition } from '../../domain/robot/position';
import { robotMachine } from '../../domain/robot/robot.machine';
import type { RobotId } from '../../domain/robot/robot.types';
import { playRoute } from './play-route';

describe('playRoute', () => {
  const input = { id: 'robot-1' as RobotId, position: makePosition(1, 1) };
  const route = [
    makePosition(2, 1),
    makePosition(2, 2),
    makePosition(1, 2),
    makePosition(1, 1),
  ];

  it('prints the actual actor snapshots while playing one route on an empty field', async () => {
    const actor = createActor(
      robotMachine.provide({ guards: { 'route.isValid': () => true } }),
      { input },
    );
    const frames: string[] = [];
    const actualContexts: string[] = [];
    const send = jest.spyOn(actor, 'send');
    const waitForMove = jest.fn(() => {
      expect(actor.getSnapshot().value).toBe('moving');
      return Promise.resolve();
    });

    await playRoute({
      actor,
      route,
      cellDurationMs: 750,
      writeFrame: (frame) => {
        frames.push(frame);
        actualContexts.push(
          `context=${JSON.stringify(actor.getSnapshot().context)}`,
        );
      },
      waitForMove,
    });

    expect(frames.map((frame) => frame.split('\n')[0])).toEqual([
      'robot=robot-1 state=idle position=(1,1) remaining=0',
      'robot=robot-1 state=atWaypoint position=(1,1) remaining=4',
      'robot=robot-1 state=moving position=(1,1) remaining=4',
      'robot=robot-1 state=atWaypoint position=(2,1) remaining=3',
      'robot=robot-1 state=moving position=(2,1) remaining=3',
      'robot=robot-1 state=atWaypoint position=(2,2) remaining=2',
      'robot=robot-1 state=moving position=(2,2) remaining=2',
      'robot=robot-1 state=atWaypoint position=(1,2) remaining=1',
      'robot=robot-1 state=moving position=(1,2) remaining=1',
      'robot=robot-1 state=idle position=(1,1) remaining=0',
    ]);
    expect(frames.map((frame) => frame.split('\n').at(-2))).toEqual(
      actualContexts,
    );
    expect(frames.map((frame) => frame.split('\n').at(-1))).toEqual(
      [
        { type: 'robot.route.assign', robotId: input.id, route },
        { type: 'robot.move.start' },
        { type: 'robot.waypoint.reached' },
        { type: 'robot.move.start' },
        { type: 'robot.waypoint.reached' },
        { type: 'robot.move.start' },
        { type: 'robot.waypoint.reached' },
        { type: 'robot.move.start' },
        { type: 'robot.waypoint.reached' },
        null,
      ].map((event) => `next=${JSON.stringify(event)}`),
    );
    expect(
      frames.slice(0, -1).map((frame) => frame.split('\n').at(-1)),
    ).toEqual(
      send.mock.calls.map(([event]) => `next=${JSON.stringify(event)}`),
    );
    for (const frame of frames) {
      expect(frame.split('\n')).toHaveLength(15);
      expect(frame).not.toContain('#');
    }
    expect(waitForMove).toHaveBeenCalledTimes(4);
    for (let index = 1; index <= 4; index++) {
      expect(waitForMove).toHaveBeenNthCalledWith(index, 750);
    }
    expect(frames.map((frame) => frame.split('\n').at(-3))).toEqual(
      [0, 0, 750, 0, 750, 0, 750, 0, 750, null].map(
        (nextDelayMs) =>
          `timing=${JSON.stringify({ cellDurationMs: 750, nextDelayMs })}`,
      ),
    );
    expect(actor.getSnapshot().context).toEqual({ ...input, route: [] });
    expect(actor.getSnapshot().status).toBe('stopped');
  });

  it('keeps the last reached position until the move finishes', async () => {
    const actor = createActor(
      robotMachine.provide({ guards: { 'route.isValid': () => true } }),
      { input },
    );
    let finishMove!: () => void;
    const pendingMove = new Promise<void>((resolve) => {
      finishMove = resolve;
    });
    const waitForMove = jest
      .fn()
      .mockReturnValueOnce(pendingMove)
      .mockResolvedValue(undefined);
    const playing = playRoute({
      actor,
      route,
      cellDurationMs: 1000,
      writeFrame: jest.fn(),
      waitForMove,
    });

    expect(actor.getSnapshot().value).toBe('moving');
    expect(actor.getSnapshot().context.position).toEqual(makePosition(1, 1));

    finishMove();
    await playing;

    expect(actor.getSnapshot().value).toBe('idle');
    expect(actor.getSnapshot().context.route).toEqual([]);
  });

  it('reports a rejected route and stops the actor instead of silently finishing', async () => {
    const actor = createActor(robotMachine, { input });
    const frames: string[] = [];

    await expect(
      playRoute({
        actor,
        route,
        cellDurationMs: 1000,
        writeFrame: (frame) => frames.push(frame),
        waitForMove: jest.fn(),
      }),
    ).rejects.toThrow('Route was not accepted');

    expect(actor.getSnapshot().context).toEqual({ ...input, route: [] });
    expect(actor.getSnapshot().status).toBe('stopped');
    expect(frames.at(-1)?.split('\n').at(-1)).toBe('next=null');
  });

  it.each([
    0,
    -1,
    1.5,
    NaN,
    Infinity,
    2_147_483_648,
    Number.MAX_SAFE_INTEGER + 1,
  ])(
    'rejects invalid cell duration %s before starting the actor',
    async (cellDurationMs) => {
      const actor = createActor(robotMachine, { input });
      const start = jest.spyOn(actor, 'start');
      const writeFrame = jest.fn();
      const waitForMove = jest.fn();

      await expect(
        playRoute({ actor, route, cellDurationMs, writeFrame, waitForMove }),
      ).rejects.toThrow(RangeError);

      expect(start).not.toHaveBeenCalled();
      expect(writeFrame).not.toHaveBeenCalled();
      expect(waitForMove).not.toHaveBeenCalled();
    },
  );

  it('reaches the next cell only after the configured duration has elapsed', async () => {
    jest.useFakeTimers();
    try {
      const actor = createActor(
        robotMachine.provide({ guards: { 'route.isValid': () => true } }),
        { input },
      );
      const playing = playRoute({
        actor,
        route,
        cellDurationMs: 2000,
        writeFrame: jest.fn(),
        waitForMove: (durationMs) =>
          new Promise<void>((resolve) => setTimeout(resolve, durationMs)),
      });

      await jest.advanceTimersByTimeAsync(1999);
      expect(actor.getSnapshot().value).toBe('moving');
      expect(actor.getSnapshot().context.position).toEqual(makePosition(1, 1));

      await jest.advanceTimersByTimeAsync(1);
      expect(actor.getSnapshot().context.position).toEqual(makePosition(2, 1));

      await jest.runAllTimersAsync();
      await playing;
      expect(actor.getSnapshot().value).toBe('idle');
      expect(actor.getSnapshot().context.route).toEqual([]);
    } finally {
      jest.useRealTimers();
    }
  });
});
