import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  async getLogs() {
    return await this.logService.getLogs();
  }
}
