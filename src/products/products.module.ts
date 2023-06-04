import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
@Module({
  imports: [CloudinaryModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
