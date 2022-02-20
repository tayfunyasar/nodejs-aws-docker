/* eslint-disable prettier/prettier */
import { ProductRepository } from './product.repository';
import { EventType } from './model/event/EventType';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AddExternalProductRequest } from './model/external/AddExternalProductRequest';

@Injectable()
export class ExternalProductService {
  constructor(private readonly productRepository: ProductRepository,
    private readonly httpService: HttpService) {
  }

  public async execute(productId: string, type: EventType) {
    switch (type) {
      case EventType.SAVE:
        await this.saveProduct(productId);
        break;
      case EventType.UPDATE:
        await this.updateProduct(productId);
        break;
      case EventType.DELETE:
        await this.deleteProduct(productId);
        break;
      default:
        throw new Error('external.service.operation.not.found');
    }
  }

  private async deleteProduct(productId: string) {
    console.log('deleting product from external system', productId);

    const url = `${process.env.EXTERNAL_SERVICE_URL}/supply-chain/${productId}`;

    try {
      await this.httpService.delete(url).pipe()
        .forEach(response => {
          console.log('external response data :', response.status);
        });
    } catch (exception) {

      if (exception.response.status == HttpStatus.NOT_FOUND) {
        console.log('product already deleted', productId);
        return;
      }

      throw exception;
    }
  }

  private async updateProduct(productId: string) {
    console.log('updating product from external system', productId);

    const product = await this.productRepository.get(productId);

    // there is no update Product endpoint
  }

  private async saveProduct(productId: string) {
    console.log('saving product from external system', productId);

    const product = await this.productRepository.get(productId);

    const url = `${process.env.EXTERNAL_SERVICE_URL}/supply-chain`;
    const payload = new AddExternalProductRequest(product.id, product.name, product.price, product.quantity);

    await this.httpService.post(url, payload).pipe()
      .forEach(response => {
        console.log('external response data :', response.data);
      });
  }
}