import { IsNotEmpty, IsNumber, IsString , IsOptional, IsDateString} from 'class-validator';

export class CreateCompraDto {
  @IsNotEmpty({ message: 'Debes ingresar un nombre' })
  @IsString({ message: 'El nombre debe ser texto' })
  nombre: string;

  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  monto: number;

  @IsNotEmpty({ message: 'Debes ingresar un proveedor' })
  @IsString({ message: 'El proveedor debe ser texto' })
  proveedor: string;

  @IsNotEmpty({ message: 'Debes ingresar una categoría' })
  @IsString({ message: 'La categoría debe ser texto' })
  categoria: string;
  
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de compra debe ser una fecha válida' })
  fechaCompra?: string;

  @IsNumber({}, { message: 'Debes seleccionar un proyecto válido' })
  proyectoId: number;
}