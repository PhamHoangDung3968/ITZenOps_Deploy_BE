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
        secure: process.env.NODE_ENV === 'production', // ✅ bật khi deploy
        sameSite: 'lax', // ✅ phù hợp với Google login
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }),
  );

  app.enableCors({
    origin: 'https://itzenops.vercel.app', // ✅ không có dấu /
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();