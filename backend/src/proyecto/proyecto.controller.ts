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
  
  @Get()
  async listarProyectos() {
    return this.proyectoService.listarProyectos();
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async actualizarProyecto(
    @Param('id') id: string,
    @Body() body: UpdateProyectoDto,
  ) {
    return this.proyectoService.actualizarProyecto(Number(id), body);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':id/resumen')
  obtenerResumen(@Param('id') id: string) {
    return this.proyectoService.obtenerResumenProyecto(Number(id));
  }
  
  @Get(':id/margen')
  obtenerMargen(@Param('id') id: string) {
    return this.proyectoService.obtenerMargen(Number(id));
  }

}