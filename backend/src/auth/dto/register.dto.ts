import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя обязательно' })
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Str0ng!Pass1',
    description:
      'Пароль: минимум 8 символов, цифра, заглавная и строчная буквы, спецсимвол (@$!%*?&)',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/, {
    message:
      'Пароль должен содержать минимум одну цифру, одну заглавную букву, одну строчную букву и один специальный символ (@$!%*?&)',
  })
  @MaxLength(72)
  password: string;
}
