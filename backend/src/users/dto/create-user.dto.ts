import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  name: string;

  @IsEmail({}, { message: 'El correo no es válido.' })
  @IsNotEmpty({ message: 'El correo es obligatorio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El contacto es obligatorio.' })
  @Matches(/^\d{10}$/, { message: 'El contacto debe tener exactamente 10 dígitos.' })
  contact: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  password: string;

  @IsString()
  @MinLength(8, { message: 'La confirmación de la contraseña debe tener al menos 8 caracteres.' })
  @IsNotEmpty({ message: 'La confirmación de la contraseña es obligatoria.' })
  confirmPassword: string;
}
