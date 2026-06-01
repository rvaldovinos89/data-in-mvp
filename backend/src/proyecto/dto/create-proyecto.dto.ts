import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateProyectoDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  presupuesto?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioVenta?: number;

}