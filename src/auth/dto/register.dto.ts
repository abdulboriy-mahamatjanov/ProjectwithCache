import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { UserRole } from 'generated/prisma';

export class RegisterDto {
  @IsString({ message: "User's FullName must be a string ❗" })
  @IsNotEmpty({ message: "User's FullName is required ❗" })
  @ApiProperty({ example: 'Alisher Sharipov' })
  fullName: string;

  @IsEmail()
  @IsNotEmpty({ message: "User's Email is required ❗" })
  @ApiProperty({ example: 'alishersharipov670@gmail.com' })
  email: string;

  @ApiProperty({ example: '+998507525354' })
  @IsNotEmpty({ message: "User's PhoneNumber is required ❗" })
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty({ message: "User's Password is required ❗" })
  @IsString({ message: "User's Password must be a string ❗" })
  @ApiProperty({ example: 'coder2o2' })
  password: string;

  @IsNotEmpty({ message: "User's Role is required ❗" })
  @IsString({ message: "User's role must be a string ❗" })
  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @IsNotEmpty({ message: "User's avatar is required ❗" })
  @IsString({ message: "User's avatar must be a string ❗" })
  @ApiProperty({ example: '' })
  avatar: string;
}
