import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductDTO } from './model/dto/ProductDTO';
import { AddProductRequest } from './model/request/AddProductRequest';
import { Product } from './entity/Product';
import { UpdateProductRequest } from './model/request/UpdateProductRequest';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) { }

  public async create(request: AddProductRequest): Promise<ProductDTO> {
    const product = {
      name: request.name,
      price: request.price,
      quantity: request.quantity,
    } as Product;

    const productEntity = await this.productRepository.save(product);
    console.log(`created product: ${productEntity.id}`);
    return new ProductDTO(
      productEntity.id,
      productEntity.name,
      productEntity.price,
      productEntity.quantity,
    );
  }

  public async update(
    productId: string,
    request: UpdateProductRequest,
  ): Promise<ProductDTO> {
    const productEntity = await this.productRepository.get(productId);

    if (productEntity == null) {
      throw new Error(`product.not.found.by.id: ${productId}`);
    }

    productEntity.name = request.name;
    productEntity.price = request.price;
    productEntity.quantity = request.quantity;

    await this.productRepository.update(productEntity);
    console.log(`updated product: ${productEntity.id}`);

    return new ProductDTO(
      productEntity.id,
      productEntity.name,
      productEntity.price,
      productEntity.quantity,
    );
  }

  public async delete(productId: string) {
    await this.productRepository.delete(productId);
    console.log(`deleted productId: ${productId}`);
  }

  public async get(productId: string): Promise<ProductDTO> {
    const productEntity = await this.productRepository.get(productId);

    if (productEntity == null) {
      return Promise.resolve(null);
    }

    return new ProductDTO(
      productEntity.id,
      productEntity.name,
      productEntity.price,
      productEntity.quantity,
    );
  }
}
