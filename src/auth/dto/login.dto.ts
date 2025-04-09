import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto extends PartialType(RegisterDto) {
  @ApiProperty({ example: 'alishersharipov670@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'coder2o2' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
