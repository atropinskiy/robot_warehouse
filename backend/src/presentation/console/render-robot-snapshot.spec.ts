import { makePosition } from '../../domain/robot/position';
import type { RobotId } from '../../domain/robot/robot.types';
import { renderRobotSnapshot } from './render-robot-snapshot';
import type { RobotSnapshot } from './render-robot-snapshot';

const createSnapshot = (): RobotSnapshot => ({
  value: 'idle',
  context: {
    id: 'robot-1' as RobotId,
    position: makePosition(1, 1),
    route: [],
  },
});

describe('renderRobotSnapshot', () => {
  it('shows robot details and a 10 by 10 field with the robot at its actual position', () => {
    expect(renderRobotSnapshot(createSnapshot()).split('\n')).toEqual([
      'robot=robot-1 state=idle position=(1,1) remaining=0',
      '  0123456789',
      '0|          |',
      '1| L        |',
      '2|          |',
      '3|          |',
      '4|          |',
      '5|          |',
      '6|          |',
      '7|          |',
      '8|          |',
      '9|          |',
    ]);
  });

  it.each<{ state: RobotSnapshot['value']; symbol: string }>([
    { state: 'idle', symbol: 'L' },
    { state: 'atWaypoint', symbol: 'O' },
    { state: 'moving', symbol: 'O' },
    { state: 'paused', symbol: 'P' },
    { state: 'stopped', symbol: 'S' },
  ])('uses $symbol to display the actual $state state', ({ state, symbol }) => {
    const snapshot = createSnapshot();
    snapshot.value = state;
    if (state !== 'idle' && state !== 'stopped') {
      snapshot.context.route = [makePosition(2, 1), makePosition(1, 1)];
    }

    const frame = renderRobotSnapshot(snapshot);

    expect(frame.split('\n')[0]).toBe(
      `robot=robot-1 state=${state} position=(1,1) remaining=${snapshot.context.route.length}`,
    );
    expect(frame.split('\n')[3]?.[3]).toBe(symbol);
  });

  it('shows only remaining waypoints and keeps a moving robot at its last reached position', () => {
    const snapshot = createSnapshot();
    snapshot.value = 'moving';
    snapshot.context.position = makePosition(2, 1);
    snapshot.context.route = [
      makePosition(2, 2),
      makePosition(1, 2),
      makePosition(1, 1),
    ];

    expect(renderRobotSnapshot(snapshot).split('\n')).toEqual([
      'robot=robot-1 state=moving position=(2,1) remaining=3',
      '  0123456789',
      '0|          |',
      '1| .O       |',
      '2| ..       |',
      '3|          |',
      '4|          |',
      '5|          |',
      '6|          |',
      '7|          |',
      '8|          |',
      '9|          |',
    ]);
  });

  it('renders a frozen snapshot consistently without changing it', () => {
    const snapshot = createSnapshot();
    const original = structuredClone(snapshot);
    Object.freeze(snapshot.context.position);
    Object.freeze(snapshot.context.route);
    Object.freeze(snapshot.context);
    Object.freeze(snapshot);

    const firstFrame = renderRobotSnapshot(snapshot);

    expect(renderRobotSnapshot(snapshot)).toBe(firstFrame);
    expect(snapshot).toEqual(original);
  });
});
