import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  async sendTestEmail() {
    return await this.mailService.sendMail(
      'abrahamesgocios@gmail.com',
      'Prueba de correo',
      'Este es un correo de prueba enviado desde NestJS usando Gmail.',
      '<p>Este es un <strong>correo de prueba</strong> enviado desde NestJS usando Gmail.</p>',
    );
  }
}
