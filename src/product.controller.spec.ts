import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AddProductRequest } from './model/request/AddProductRequest';
import { UpdateProductRequest } from './model/request/UpdateProductRequest';
import { ProductDTO } from './model/dto/ProductDTO';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    productController = app.get<ProductController>(ProductController);
    productService = app.get<ProductService>(ProductService);
  });

  describe('ProductController', () => {
    it('should create new product ', () => {
      const request = new AddProductRequest('testing', 1.2, 2);

      productController.addProduct(request);

      expect(productService.create).toHaveBeenCalledWith(request);
    });

    it('should update product ', () => {
      const productId = '1-2';
      const request = new UpdateProductRequest('testing', 1.2, 2);

      productController.updateProduct(productId, request);

      expect(productService.update).toHaveBeenCalledWith(productId, request);
    });

    it('should delete product ', () => {
      const productId = '1-2';

      productController.deleteProduct(productId);

      expect(productService.delete).toHaveBeenCalledWith(productId);
    });

    it('should return product with id ', () => {
      const productId = '1-2';
      const existProduct = {
        id: '1-2',
        name: 'test',
        price: 1.2,
        quantity: 1,
      } as ProductDTO;

      productService.get = jest
        .fn()
        .call(productId)
        .mockResolvedValue(Promise.resolve(existProduct));

      productController.getProduct(productId).then((response: ProductDTO) => {
        expect(productService.get).toHaveBeenCalledWith(productId);

        expect(response.name).toBe('test');
        expect(response.price).toBe(1.2);
        expect(response.quantity).toBe(1);
      });
    });
  });
});
