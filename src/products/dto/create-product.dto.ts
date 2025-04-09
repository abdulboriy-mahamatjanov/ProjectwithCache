import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Chevrolet Tracker' })
  name: string;

  @ApiProperty({
    example:
      'Chevrolet Tracker - zamonaviy va shinam. Yo’ldagi ishonchlilik va sport uyg’unligi. Bu ixcham krossover sizning yo’ldagi sarguzashtlaringiz uchun qulayliklar va katta imkoniyatlar taqdim etadi.',
  })
  description: string;

  @ApiProperty({ type: Number, example: 22000000 })
  price: number;

  @ApiProperty({ example: 'black' })
  color: string;

  @ApiProperty({ example: '' })
  categoryId: string;

  @ApiProperty({
    example:
      '',
  })
  image: string;
}
