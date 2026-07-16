import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
  Patch,
} from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';

@Controller('proyectos')
export class ProyectoController {

  constructor(private readonly proyectoService: ProyectoService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  async crearProyecto(
    @Body() body: CreateProyectoDto,
    @Request() req,
  ) {
    const empresaId = req.user.empresaId;

    return this.proyectoService.crearProyecto({
      ...body,
      empresaId,
    });
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async listarProyectos(@Request() req) {
    const empresaId = req.user.empresaId;

    return this.proyectoService.listarProyectos(empresaId);
}

@UseGuards(JwtAuthGuard)
@Patch(':id')
async actualizarProyecto(
  @Param('id') id: string,
  @Body() body: UpdateProyectoDto,
  @Request() req,
) {
  const empresaId = req.user.empresaId;

  return this.proyectoService.actualizarProyecto(
    Number(id),
    empresaId,
    body,
  );
}

@UseGuards(JwtAuthGuard)
@Get(':id/resumen')
obtenerResumen(
  @Param('id') id: string,
  @Request() req,
) {
  const empresaId = req.user.empresaId;

  return this.proyectoService.obtenerResumenProyecto(
    Number(id),
    empresaId,
  );
}

@UseGuards(JwtAuthGuard)
@Get(':id/margen')
obtenerMargen(
  @Param('id') id: string,
  @Request() req,
) {
  const empresaId = req.user.empresaId;

  return this.proyectoService.obtenerMargen(
    Number(id),
    empresaId,
  );
}

}