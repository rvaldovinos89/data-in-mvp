import { Controller, Post, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
export class UsuarioController {

  constructor(private usuarioService: UsuarioService) {}

  @Post()
	create(@Body() body: any) {
		return this.usuarioService.create(body);
  }

}

