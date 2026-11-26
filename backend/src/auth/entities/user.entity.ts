import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ example: 1, description: 'Идентификатор пользователя' })
  id: number;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({ enum: ['VIEWER', 'OWNER'], description: 'Роль пользователя' })
  role: 'VIEWER' | 'OWNER';

  @ApiProperty({ example: true, description: 'Активен ли аккаунт' })
  isActive: boolean;

  @ApiProperty({
    example: 0,
    description: 'Версия токенов (для отзыва refresh)',
  })
  tokenVersion: number;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата последнего обновления' })
  updatedAt: Date;
}
