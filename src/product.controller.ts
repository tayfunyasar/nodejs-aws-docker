import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductDTO } from './model/dto/ProductDTO';
import { AddProductRequest } from './model/request/AddProductRequest';
import { UpdateProductRequest } from './model/request/UpdateProductRequest';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: ProductDTO })
  public async addProduct(
    @Body() request: AddProductRequest,
  ): Promise<ProductDTO> {
    return this.productService.create(request);
  }

  @Put(':productId')
  @ApiResponse({ status: HttpStatus.ACCEPTED, type: ProductDTO })
  public async updateProduct(
    @Param('productId') productId: string,
    @Body() request: UpdateProductRequest,
  ): Promise<ProductDTO> {
    return this.productService.update(productId, request);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteProduct(@Param('productId') productId: string) {
    await this.productService.delete(productId);
  }

  @Get(':productId')
  @ApiResponse({ status: HttpStatus.OK, type: ProductDTO })
  public async getProduct(
    @Param('productId') productId: string,
  ): Promise<ProductDTO> {
    return this.productService.get(productId);
  }
}
