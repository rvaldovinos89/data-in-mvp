import { 
  IsEmail, 
  IsNotEmpty, 
  MinLength,
  IsNumber,
  } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  password: string;
  
  @IsNumber()
  empresaId: number;
}