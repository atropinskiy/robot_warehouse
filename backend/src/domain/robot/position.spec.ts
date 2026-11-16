import { makePosition } from './position';
import type { Position } from './robot.types';

describe('makePosition', () => {
  it.each([
    { x: 0, y: 0 },
    { x: 1, y: 2 },
    { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER },
  ])('creates Position from valid coordinates ($x, $y)', ({ x, y }) => {
    const result: Position = makePosition(x, y);

    expect(result).toEqual({ x, y });
  });

  const invalidCoordinates = [
    -1,
    1.5,
    NaN,
    Infinity,
    -Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ];

  it.each(invalidCoordinates)('rejects invalid x: %s', (x) => {
    expect(() => makePosition(x, 0)).toThrow(RangeError);
  });

  it.each(invalidCoordinates)('rejects invalid y: %s', (y) => {
    expect(() => makePosition(0, y)).toThrow(RangeError);
  });
});
