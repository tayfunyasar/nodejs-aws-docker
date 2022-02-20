import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { HomeController } from './home.controller';
import { ProductReceiver } from './product.receiver';
import { ExternalProductService } from './product.external.service';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [HttpModule, TerminusModule],
  controllers: [ProductController, HomeController, HealthController],
  providers: [
    ProductService,
    ProductRepository,
    ProductReceiver,
    ExternalProductService,
  ],
})
export class AppModule { }
