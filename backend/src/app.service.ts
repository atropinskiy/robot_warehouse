import { Injectable } from '@nestjs/common';
// Пример -------------------
// см robots-example.dto.ts
import { RobotDto } from './dto-for-swagge-example/robots-example.dto';
// --------------------------------------

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // Пример -------------------
  // см robots-example.dto.ts
  private robots: RobotDto[] = [
    { name: 'Mule', batery: 89, role: 'lifter' },
    { name: 'Lifter', batery: 9, role: 'runner' }
  ]
  getRobots(): RobotDto[] {
    return this.robots
  }

  createRobot(data: RobotDto): RobotDto {
    this.robots.push(data)
    return data
  }
  // -----------------------
}
