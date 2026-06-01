import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@Controller('compras')
export class CompraController {

  constructor(private readonly compraService: CompraService) {}

  @Post()
  crear(@Body() dto: CreateCompraDto) {
    return this.compraService.crearCompra(dto);
  }

  @Get('proyecto/:id')
  obtenerPorProyecto(@Param('id') id: string) {
    return this.compraService.obtenerComprasPorProyecto(Number(id));
  }
  
  @Get('proyecto/:id/costo-total')
  otenerCostoTotal(@Param('id') id: string) {
   return this.compraService.obtenerCostoTotal(Number(id));
  }

}

