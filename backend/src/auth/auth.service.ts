import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private verificationCodes = new Map<string, { code: string; expiresAt: number }>();

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    return user;
  }

  async login(user: { id: string; email: string }) {
    await this.sendVerificationCode(user.email);
    return {
      message: 'Código de verificación enviado al correo electrónico.',
    };
  }

  async sendVerificationCode(email: string): Promise<void> {
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    this.verificationCodes.set(email, { code, expiresAt });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de Verificación en Dos Pasos',
      text: `Tu código de verificación es: ${code}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo de verificación enviado a:', email);
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new BadRequestException('No se pudo enviar el correo de verificación.');
    }
  }

  async verifyCode(email: string, code: string): Promise<string> {
    const verificationData = this.verificationCodes.get(email);

    if (!verificationData) {
      throw new BadRequestException('Código de verificación inválido.');
    }

    const { code: savedCode, expiresAt } = verificationData;

    if (code !== savedCode) {
      throw new UnauthorizedException('Código de verificación incorrecto.');
    }

    if (Date.now() > expiresAt) {
      this.verificationCodes.delete(email);
      throw new BadRequestException('El código de verificación ha expirado.');
    }

    this.verificationCodes.delete(email);

    const payload = { email };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
