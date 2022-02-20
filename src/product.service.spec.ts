import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { AddProductRequest } from './model/request/AddProductRequest';
import { ProductDTO } from './model/dto/ProductDTO';
import { Product } from './entity/Product';
import { UpdateProductRequest } from './model/request/UpdateProductRequest';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [ProductService, ProductRepository],
    }).compile();

    service = app.get<ProductService>(ProductService);
    repository = app.get<ProductRepository>(ProductRepository);
  });

  it('should get product with id', () => {
    const productId = '1-2';
    const persistedProduct = {
      id: '1-2',
      name: 'test',
      price: 1.2,
      quantity: 1,
    } as Product;

    repository.get = jest
      .fn()
      .call(productId)
      .mockResolvedValue(Promise.resolve(persistedProduct));

    return service.get(productId).then((response: ProductDTO) => {
      expect(repository.get).toHaveBeenCalledWith(productId);

      expect(response.id).toBe(persistedProduct.id);
      expect(response.name).toBe(persistedProduct.name);
      expect(response.price).toBe(persistedProduct.price);
      expect(response.quantity).toBe(persistedProduct.quantity);
    });
  });

  it('should create product', () => {
    const request = new AddProductRequest('testing', 1.2, 2);
    const createdProduct = { ...request } as Product;

    const persistedProduct = { id: '1', ...request } as Product;
    repository.save = jest
      .fn()
      .call(createdProduct)
      .mockResolvedValue(Promise.resolve(persistedProduct));

    return service.create(request).then((response: ProductDTO) => {
      expect(repository.save).toHaveBeenCalledWith(createdProduct);
      expect(response).toBe(persistedProduct);
    });
  });

  it('should update product', () => {
    const productId = '1';
    const request = new UpdateProductRequest('testing', 1.3, 2);

    const existProduct = {
      id: '1',
      name: 'test',
      price: 1.2,
      quantity: 1,
    } as Product;
    const savedProduct = {
      id: '1',
      name: 'testing',
      price: 1.3,
      quantity: 2,
    } as Product;

    repository.get = jest
      .fn()
      .call(productId)
      .mockResolvedValue(Promise.resolve(existProduct));
    repository.save = jest
      .fn()
      .call(savedProduct)
      .mockResolvedValue(Promise.resolve(savedProduct));

    return service.update(productId, request).then((response: ProductDTO) => {
      expect(repository.get(productId)).toBe(existProduct);
      expect(repository.save).toHaveBeenCalledWith(savedProduct);
      expect(response).toBe(savedProduct);
    });
  });

  it('should delete product', () => {
    const productId = 'test';

    return service.delete(productId).then((response: void) => {
      expect(repository.delete).toHaveBeenCalledWith(productId);
    });
  });
});
