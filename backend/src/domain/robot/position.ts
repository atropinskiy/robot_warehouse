import type { CoordinateX, CoordinateY, Position } from './robot.types';

type PositionFactory = (x: number, y: number) => Position;

export const makePosition: PositionFactory = (x, y) => {
  if (!Number.isSafeInteger(x) || x < 0) {
    throw new RangeError('x must be a non-negative safe integer');
  }

  if (!Number.isSafeInteger(y) || y < 0) {
    throw new RangeError('y must be a non-negative safe integer');
  }

  return { x: x as CoordinateX, y: y as CoordinateY };
};
