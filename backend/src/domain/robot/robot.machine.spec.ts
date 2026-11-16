import { createActor } from 'xstate';
import type { ActorRefFrom } from 'xstate';
import { makePosition } from './position';
import { robotMachine } from './robot.machine';
import type { Position, RobotId, RobotInput } from './robot.types';

describe('robotMachine', () => {
  const input: RobotInput = {
    id: 'robot-1' as RobotId,
    position: makePosition(1, 1),
  };
  const route = [
    makePosition(2, 1),
    makePosition(2, 2),
    makePosition(1, 2),
    makePosition(1, 1),
  ];
  const machine = robotMachine.provide({
    guards: { 'route.isValid': () => true },
  });
  let actor: ActorRefFrom<typeof robotMachine>;

  beforeEach(() => {
    actor = createActor(machine, { input });
    actor.start();
  });

  afterEach(() => {
    actor.stop();
  });

  it('completes one circular route and remains idle at the starting position', () => {
    expect(actor.getSnapshot().value).toBe('idle');
    expect(actor.getSnapshot().context).toEqual({ ...input, route: [] });

    actor.send({
      type: 'robot.route.assign',
      robotId: 'robot-2' as RobotId,
      route,
    });
    expect(actor.getSnapshot().value).toBe('idle');
    expect(actor.getSnapshot().context.route).toEqual([]);

    actor.send({ type: 'robot.route.assign', robotId: input.id, route });
    expect(actor.getSnapshot().value).toBe('atWaypoint');
    expect(actor.getSnapshot().context).toEqual({ ...input, route });

    const reachedPositions: Position[] = [];
    let previousPosition = input.position;

    for (const [index, waypoint] of route.entries()) {
      actor.send({ type: 'robot.move.start' });
      expect(actor.getSnapshot().value).toBe('moving');
      expect(actor.getSnapshot().context.position).toEqual(previousPosition);
      expect(actor.getSnapshot().context.route).toEqual(route.slice(index));

      actor.send({ type: 'robot.waypoint.reached' });
      const snapshot = actor.getSnapshot();
      expect(snapshot.value).toBe(
        index === route.length - 1 ? 'idle' : 'atWaypoint',
      );
      expect(snapshot.context.position).toEqual(waypoint);
      expect(snapshot.context.route).toEqual(route.slice(index + 1));
      expect(snapshot.context.id).toBe(input.id);
      reachedPositions.push(snapshot.context.position);
      previousPosition = waypoint;
    }

    expect(reachedPositions).toEqual([
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
    ]);
    expect(actor.getSnapshot().status).toBe('active');

    actor.send({ type: 'robot.move.start' });
    actor.send({ type: 'robot.waypoint.reached' });
    expect(actor.getSnapshot().value).toBe('idle');
    expect(actor.getSnapshot().context).toEqual({ ...input, route: [] });
  });

  it('preserves the route during pause and resumes from the same position', () => {
    actor.send({ type: 'robot.route.assign', robotId: input.id, route });
    actor.send({ type: 'robot.pause', robotId: input.id });

    expect(actor.getSnapshot().value).toBe('paused');
    expect(actor.getSnapshot().context).toEqual({ ...input, route });

    actor.send({ type: 'robot.move.start' });
    expect(actor.getSnapshot().value).toBe('paused');
    expect(actor.getSnapshot().context).toEqual({ ...input, route });

    actor.send({ type: 'robot.resume', robotId: input.id });
    expect(actor.getSnapshot().value).toBe('atWaypoint');

    actor.send({ type: 'robot.move.start' });
    actor.send({ type: 'robot.waypoint.reached' });
    expect(actor.getSnapshot().value).toBe('atWaypoint');
    expect(actor.getSnapshot().context).toEqual({
      id: input.id,
      position: makePosition(2, 1),
      route: [makePosition(2, 2), makePosition(1, 2), makePosition(1, 1)],
    });
  });

  it('clears the route on stop and resets to idle without changing position', () => {
    actor.send({ type: 'robot.route.assign', robotId: input.id, route });
    actor.send({ type: 'robot.move.start' });
    actor.send({ type: 'robot.waypoint.reached' });
    actor.send({ type: 'robot.stop', robotId: input.id });

    const stoppedContext = {
      id: input.id,
      position: makePosition(2, 1),
      route: [],
    };
    expect(actor.getSnapshot().value).toBe('stopped');
    expect(actor.getSnapshot().context).toEqual(stoppedContext);

    actor.send({ type: 'robot.resume', robotId: input.id });
    actor.send({ type: 'robot.route.assign', robotId: input.id, route });
    expect(actor.getSnapshot().value).toBe('stopped');
    expect(actor.getSnapshot().context).toEqual(stoppedContext);

    actor.send({ type: 'robot.reset', robotId: input.id });
    expect(actor.getSnapshot().value).toBe('idle');
    expect(actor.getSnapshot().context).toEqual(stoppedContext);
  });
});
