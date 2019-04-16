import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './cotrollers/product/product.controller';
import { ProductSchema } from './models/product.schema';
import { ProductService } from './services/product/product.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/pachoShop', { useNewUrlParser: true }),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, ProductService],
})
export class AppModule {}
