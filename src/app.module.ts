import { INestApplication, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoriesModule } from './categories/categories.module';
import { CartsModule } from './carts/carts.module';
import { PassportModule } from '@nestjs/passport';
import { ReviewsModule } from './reviews/review.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerMiddleware } from './auth/logger';
@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }),
  DatabaseModule.forRoot(), 
  UsersModule, 
  ProductsModule, 
  OrdersModule, 
  AuthModule, 
  CloudinaryModule, 
  CategoriesModule, 
  CartsModule,
  ReviewsModule,
  SwaggerModule.forRoot({
    // specify the Swagger UI route
    // this will expose Swagger UI at http://localhost:3000/api/docs/
    routePrefix: 'api/docs',
    // specify the Swagger document options
    // these will be used to generate the Swagger UI page
    // you can customize these options to fit your needs
    swaggerOptions: {
      title: 'My API',
      description: 'API documentation',
      version: '1.0',
    },
  }),],
  controllers: [AppController],
  providers: [AppService],
  
  
})
export class AppModule implements NestModule {
  constructor(private readonly app: INestApplication) {} // inject INestApplication instance

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  async onModuleInit() {
    const options = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(this.app, options);
    SwaggerModule.setup('api/docs', this.app, document); // use 'this.app' to access the INestApplication instance
  }
}
