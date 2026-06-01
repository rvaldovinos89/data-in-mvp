import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}
  
  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
  try {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        password: hashedPassword,
		empresaId: 1,
      },
    });

    const { password, ...result } = usuario;
    return result;

  } catch (error) {
    if (error.code === 'P2002') {
      throw new ConflictException('El correo ya está registrado');
    }
    throw error;
  }
}
}