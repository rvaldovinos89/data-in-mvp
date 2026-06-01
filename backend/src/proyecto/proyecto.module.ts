import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';

@Module({
  providers: [ProyectoService],
  controllers: [ProyectoController]
})
export class ProyectoModule {}
