import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Request, 
  UseGuards,
  } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get()
  obtenerEmpresas() {
    return this.empresaService.obtenerEmpresas();
  }

  @Post()
  crearEmpresa(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresaService.crearEmpresa(createEmpresaDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('mi-empresa')
  obtenerMiEmpresa(@Request() req) {
  const empresaId = req.user.empresaId;

  return this.empresaService.obtenerMiEmpresa(empresaId);
  }
}