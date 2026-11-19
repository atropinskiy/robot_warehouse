import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RobotDto } from './dto-for-swagger-example/robots-example.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Пример
  // --------------
  @Get('robots')
  getRobots() {
    return this.appService.getRobots()
  }

  @Post('robots')
  createRobot(@Body() createRobotDto: RobotDto) {
    return this.appService.createRobot(createRobotDto)
  }
  // --------------
}
