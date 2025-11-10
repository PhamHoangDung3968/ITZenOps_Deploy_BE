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
import session from 'express-session';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // true nếu dùng HTTPS
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      },
    }),
  );

  app.enableCors({
    origin: 'https://itzenops.vercel.app/',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();