import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './docs/swagger';
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app); // Call the setupSwagger function
  await app.listen(3000);
}
bootstrap();