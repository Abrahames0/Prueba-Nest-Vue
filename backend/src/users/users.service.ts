import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogService } from 'src/log/log.service';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
              private logService: LogService,
              private mailService: MailService
  ) {}

  // Obtener todos los usuarios
  async getUsers() {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new Error('Error al obtener los usuarios: ' + error.message);
    }
  }

  // Crear un usuario
  async createUser(userDto: CreateUserDto) {
    const { password, confirmPassword, ...userData } = userDto;

    if (password !== confirmPassword) {
      console.warn('Intento de creación de usuario fallido: las contraseñas no coinciden');
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      // Registrar en el log de base de datos
      await this.logService.createLog(
        'create',
        'User',
        `Usuario creado: ${newUser.email}`,
      );

      console.log(`Usuario creado exitosamente: ${newUser.email}`);

      // Enviar correo al usuario
      await this.mailService.sendMail(
        newUser.email,
        'Bienvenido a la prueba',
        `Hola ${newUser.name}, ¡bienvenido a la prueba! Tu cuenta se ha creado con éxito.`,
        `<p>Hola <strong>${newUser.name}</strong>,</p><p>¡Bienvenido a la prueba! Tu cuenta se ha creado con éxito.</p>`,
      );

      return {
        message: 'Usuario creado exitosamente.',
        user: newUser,
      };
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        console.warn(`Intento de crear un usuario fallido: correo duplicado (${userDto.email})`);

        await this.logService.createLog(
          'error',
          'User',
          `Intento fallido de crear usuario con correo duplicado: ${userDto.email}`,
        );

        // Enviar correo al usuario
        await this.mailService.sendMail(
          userDto.email,
          'Problema al Registrar tu Cuenta',
          `Hola ${userDto.name || 'usuario'}, no pudimos completar tu registro porque el correo electrónico ${userDto.email} ya está registrado. Por favor, usa otro correo o contacta soporte.`,
          `<p>Hola <strong>${userDto.name || 'usuario'}</strong>,</p>
           <p>No pudimos completar tu registro porque el correo electrónico <strong>${userDto.email}</strong> ya está registrado.</p>
           <p>Por favor, usa otro correo o contacta soporte si tienes dudas.</p>`,
        );

        throw new BadRequestException(
          `El correo ${userDto.email} ya está registrado. Por favor, usa otro.`,
        );
      }

      console.error('Error al crear el usuario:', error.message);

      // Registrar cualquier otro error
      await this.logService.createLog(
        'error',
        'User',
        `Error desconocido al crear usuario: ${error.message}`,
      );

      await this.mailService.sendMail(
        userDto.email,
        'Error Inesperado en el Registro',
        `Hola ${userDto.name || 'usuario'}, ocurrió un error inesperado al intentar registrar tu cuenta. Por favor, intenta de nuevo más tarde.`,
        `<p>Hola <strong>${userDto.name || 'usuario'}</strong>,</p>
         <p>Ocurrió un error inesperado al intentar registrar tu cuenta. Por favor, intenta de nuevo más tarde.</p>
         <p>Si el problema persiste, contacta soporte.</p>`,
      );

      throw new Error('Error al crear el usuario: ' + error.message);
    }
  }

  // Actualizar un usuario
  async updateUser(id: string, user: UpdateUserDto) {
    try {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
  
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: user,
      });

      await this.logService.createLog(
        'update',
        'User',
        `Usuario actualizado: ${updatedUser.email}`,
      );

      console.log(`Usuario actualizado exitosamente: ${updatedUser.email}`)
  
      return {
        message: 'Usuario actualizado exitosamente.',
        user: updatedUser,
      };
    } catch (error) {
      throw new Error('Error al actualizar el usuario: ' + error.message);
    }
  }
  

  //Actualizacion parcial
  async updatePartialUser(id: string, user: UpdateUserDto) {
    try {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
  
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: user,
      });

      await this.logService.createLog(
        'update',
        'User',
        `Usuario actualizado: ${updatedUser.email}`,
      );

      console.log(`Usuario actualizado exitosamente: ${updatedUser.email}`)
  
      return {
        message: 'Usuario actualizado parcialmente exitosamente.',
        user: updatedUser,
      };
    } catch (error) {
      throw new Error('Error al actualizar parcialmente el usuario: ' + error.message);
    }
  }  

  // Eliminar un usuario
  async deleteUser(id: string) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });

      await this.logService.createLog(
        'delete',
        'User',
        `Usuario eliminado: ${deletedUser.email}`,
      );

      console.log(`Usuario eliminado exitosamente: ${deletedUser.email}`);

      return {
        message: 'Usuario eliminado exitosamente.',
      };
    } catch (error) {
      throw new Error('Error al eliminar el usuario: ' + error.message);
    }
  }
}
