import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LogService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(action: string, entity: string, description: string) {
    return await this.prisma.log.create({
      data: { action, entity, description,
      },
    });
  }

  async getLogs() {
    return await this.prisma.log.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
