import { createRobotActor } from './create-robot-actor';
import { makePosition } from './position';
import type { RobotId, RobotInput } from './robot.types';

describe('createRobotActor', () => {
  const input: RobotInput = {
    id: 'robot-1' as RobotId,
    position: makePosition(1, 1),
  };

  let actor: ReturnType<typeof createRobotActor>;

  beforeEach(() => {
    actor = createRobotActor(input);
  });

  afterEach(() => {
    actor.stop();
  });

  it('returns an actor that starts only when explicitly requested', () => {
    const observer = jest.fn();
    actor.subscribe(observer);

    expect(observer).not.toHaveBeenCalled();

    actor.start();

    expect(observer).toHaveBeenCalledTimes(1);
  });

  it('starts in idle and remains active', () => {
    actor.start();

    expect(actor.getSnapshot().value).toBe('idle');
    expect(actor.getSnapshot().status).toBe('active');
  });

  it('initializes the robot ID, position and an empty route from input', () => {
    actor.start();

    expect(actor.id).toBe(input.id);
    expect(actor.getSnapshot().context).toEqual({
      id: input.id,
      position: { x: 1, y: 1 },
      route: [],
    });
  });

  it('creates independent actors with their own initial contexts', () => {
    const otherInput: RobotInput = {
      id: 'robot-2' as RobotId,
      position: makePosition(2, 3),
    };
    const otherActor = createRobotActor(otherInput);

    try {
      actor.start();
      otherActor.start();

      expect(otherActor).not.toBe(actor);
      expect(otherActor.id).toBe(otherInput.id);
      expect(otherActor.getSnapshot().context).toEqual({
        id: otherInput.id,
        position: { x: 2, y: 3 },
        route: [],
      });
      expect(actor.getSnapshot().context).toEqual({
        id: input.id,
        position: { x: 1, y: 1 },
        route: [],
      });
      expect(otherActor.getSnapshot().context.route).not.toBe(
        actor.getSnapshot().context.route,
      );
    } finally {
      otherActor.stop();
    }
  });
});
