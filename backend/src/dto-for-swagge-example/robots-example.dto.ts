// ЭТОТ файл только для примера его можно смело удалять

import { ApiProperty } from "@nestjs/swagger";

export class RobotDto {
    // nfr vj;yj lj,fdbnm j
    // @ApiProperty({
    //     description: "Имя робота",
    //     maximum: 20,
    //     minimum: 1
    // })
    // обязательные параметры `!` нужен что бы избежать TS ошибок
    name!: string;

    // @ApiProperty({enum: ['lifter', 'runner']})
    role!: 'lifter' | 'runner'

    // необязательные параметры `?`
    // @ApiProperty({
    //     description: 'заряд батареи',
    //     default: 99
    // })
    batery?: number = 99;
}