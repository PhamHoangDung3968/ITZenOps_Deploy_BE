// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors();
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Bật CORS với cấu hình chi tiết
  app.enableCors({
    origin: [
      'http://localhost:3000',        // cho dev
      'http://localhost:3001',        // nếu FE chạy cổng khác
      'https://itzenops.vercel.app', // domain FE khi deploy
    ],
    credentials: true, // cho phép gửi cookie, Authorization header
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();