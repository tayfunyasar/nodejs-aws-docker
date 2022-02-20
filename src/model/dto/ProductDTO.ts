import { ApiProperty } from '@nestjs/swagger';

export class ProductDTO {
  @ApiProperty({ example: '111-222-333-444' })
  id: string;

  @ApiProperty({ example: 'Watermelon' })
  name: string;

  @ApiProperty({ example: '10.2' })
  price: number;

  @ApiProperty({ example: '1023' })
  quantity: number;

  constructor(id: string, name: string, price: number, quantity: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}
