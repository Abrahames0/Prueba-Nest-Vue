import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LogService } from './log.service';

@Module({
  providers: [PrismaService, LogService],
  exports: [LogService], 
})
export class AppModule {}
