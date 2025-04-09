import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Cars' })
  name: string;

  @ApiProperty({
    example: '',
  })
  image: string;
}
