import { 
  ConflictException, 
  Injectable,  
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(private prisma: PrismaService) {}

  async obtenerEmpresas() {
    return this.prisma.empresa.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async crearEmpresa(data: CreateEmpresaDto) {
    const empresaExistente = await this.prisma.empresa.findUnique({
      where: {
        rut: data.rut,
      },
    });

    if (empresaExistente) {
      throw new ConflictException('Ya existe una empresa con este RUT');
    }

    return this.prisma.empresa.create({
      data: {
        nombre: data.nombre,
        rut: data.rut,
      },
    });
  }
  
  async obtenerMiEmpresa(empresaId: number) {
  const empresa = await this.prisma.empresa.findUnique({
    where: {
      id: empresaId,
    },
  });

  if (!empresa) {
    throw new NotFoundException('Empresa no encontrada');
  }

  return empresa;
  }
}