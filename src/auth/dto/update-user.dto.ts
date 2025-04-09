import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAuthDto, UserRole } from './create-user.dto';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateAuthDto) {
  @IsString({ message: 'FullName must be a string ❗' })
  @ApiProperty({ example: 'Alisher Sharipov' })
  fullName: string;

  @IsEmail()
  @ApiProperty({ example: 'alishersharipov670@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'coder2o2' })
  password: string;

  @IsPhoneNumber()
  @ApiProperty({ example: '+998507525051' })
  phone: string;

  @IsString({ message: "Region's ID must be a string ❗" })
  @ApiProperty({ example: '15e4713c-06cd-4a82-a78d-b6eb180dfedd' })
  regionId: string;

  @IsString({ message: "Avatar's URL must be a string ❗" })
  @ApiProperty({
    example:
      'http://res.cloudinary.com/dnle8xg73/image/upload/v1743929444/ysdk5yllutfbzdkfhrd1.jpg',
  })
  avatar: string;
}