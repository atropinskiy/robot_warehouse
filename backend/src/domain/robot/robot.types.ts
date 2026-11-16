declare const brand: unique symbol;

type Brand<Value, Name extends string> = Value & {
  readonly [brand]: Name;
};

export type RobotId = Brand<string, 'RobotId'>;
export type CoordinateX = Brand<number, 'CoordinateX'>;
export type CoordinateY = Brand<number, 'CoordinateY'>;

export type Position = {
  x: CoordinateX;
  y: CoordinateY;
};

export type RobotInput = {
  id: RobotId;
  position: Position;
};

export type RobotContext = RobotInput & {
  route: Position[];
};

export type RobotCommand =
  | { type: 'robot.route.assign'; robotId: RobotId; route: Position[] }
  | { type: 'robot.pause'; robotId: RobotId }
  | { type: 'robot.resume'; robotId: RobotId }
  | { type: 'robot.stop'; robotId: RobotId }
  | { type: 'robot.reset'; robotId: RobotId };

export type RobotInternalEvent =
  { type: 'robot.move.start' } | { type: 'robot.waypoint.reached' };

export type RobotEvent = RobotCommand | RobotInternalEvent;
