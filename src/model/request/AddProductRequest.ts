import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class AddProductRequest {
  @ApiProperty({ example: 'Watermelon' })
  @IsNotEmpty({ message: 'NotEmpty' })
  name: string;

  @ApiProperty({ example: '10.2' })
  @IsPositive({ message: 'Bigger than 0' })
  price: number;

  @ApiProperty({ example: '1023' })
  @IsPositive({ message: 'Bigger than 0' })
  quantity: number;

  constructor(name: string, price: number, quantity: number) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}
