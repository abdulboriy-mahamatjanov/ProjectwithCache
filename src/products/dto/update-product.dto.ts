import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 'Chevrolet Captiva' })
  name: string;

  @ApiProperty({
    example:
      "Uning aerodinamik dizayni, 3 qatorli o'rindiqli keng ichki qismi, turbodvigateli va ajoyib ko'p qirraliligi sizning va oilangizning barcha ehtiyojlariga moslashadi",
  })
  description: string;

  @ApiProperty({ example: '15 000 000' })
  price: number;

  @ApiProperty({ example: 'red' })
  color: string;

  @ApiProperty({ example: '506cd43d-bb49-4075-a675-06f6ccfac066' })
  categoryId: string;

  @ApiProperty({
    example:
      'http://res.cloudinary.com/dnle8xg73/image/upload/v1743976297/ccsjlhxdngxcasficoi6.webp',
  })
  image: string;
}
