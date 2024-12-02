import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );

    return this.authService.login({ id: user.id, email: user.email });
  }

  @Post('verify-code')
  async verifyCode(@Body() body: { email: string; code: string }) {
    const { email, code } = body;
    const accessToken = await this.authService.verifyCode(email, code);

    return {
      message: 'Verificación exitosa.',
      accessToken,
    };
  }
}
