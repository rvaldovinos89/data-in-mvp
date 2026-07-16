import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(email: string, password: string) {
    const usuario = await this.usuarioService.findByEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role,
      empresaId: usuario.empresaId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
		nombre: string, 
		email: string, 
		password: string, 
		empresaId: number,
		){
			
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException(
        'El usuario ya existe',
        HttpStatus.BAD_REQUEST,
      );
    }
	
	const empresa = await this.prisma.empresa.findUnique({
		where: { id: empresaId },
	});

	if (!empresa) {
	  throw new HttpException(
		'La empresa seleccionada no existe',
         HttpStatus.NOT_FOUND,
	 );
	}

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        empresaId,
      },
    });

    return {
      message: 'Usuario creado correctamente',
      userId: user.id,
    };
  }
}