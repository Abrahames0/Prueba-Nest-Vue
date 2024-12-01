import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthMiddleware } from './auth/auth.middleware';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { LogService } from 'src/log/log.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, LogService, MailService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(
      { path: '/users', method: RequestMethod.GET },
      { path: '/users', method: RequestMethod.DELETE },
      { path: '/users', method: RequestMethod.PATCH },
      { path: '/users', method: RequestMethod.PUT },
    );
    consumer.apply(AuthMiddleware).forRoutes('users');
  }
}
