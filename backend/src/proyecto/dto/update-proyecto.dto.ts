import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProyectoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  presupuesto?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  precioVenta?: number;
}