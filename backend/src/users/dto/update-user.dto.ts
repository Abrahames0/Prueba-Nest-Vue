import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo no es válido.' })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'El contacto debe tener exactamente 10 dígitos.' })
  contact?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
