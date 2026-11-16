import { createActor } from 'xstate';
import { robotMachine } from './robot.machine';
import type { RobotInput } from './robot.types';

export const createRobotActor = (input: RobotInput) =>
  createActor(robotMachine, { id: input.id, input });
