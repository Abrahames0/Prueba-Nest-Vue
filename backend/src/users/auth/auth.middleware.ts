import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
  
    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado');
    }
  
    const token = authHeader.split(' ')[1];
  
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }
  
    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }    
}
