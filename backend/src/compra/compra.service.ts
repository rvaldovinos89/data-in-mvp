import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompraService {
  constructor(private prisma: PrismaService) {}

  async crearCompra(data: {
    nombre: string;
    monto: number;
    proveedor: string;
    categoria: string;
	fechaCompra?: string;
    proyectoId: number;
  }) {
    try {
      // Validar que el proyecto exista
      const proyecto = await this.prisma.proyecto.findUnique({
        where: { id: data.proyectoId },
      });

      if (!proyecto) {
        throw new HttpException(
          'Proyecto no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      // Regla: proyecto cerrado
      if (proyecto.estado?.toLowerCase() === 'cerrado') {
        throw new HttpException(
          'No se pueden registrar compras en un proyecto cerrado',
          HttpStatus.CONFLICT,
        );
      }

      // Regla: proveedor obligatorio
      if (!data.proveedor || data.proveedor.trim() === '') {
        throw new HttpException(
          'Debes ingresar un proveedor',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Regla: categoría obligatoria
      if (!data.categoria || data.categoria.trim() === '') {
        throw new HttpException(
          'Debes ingresar una categoría',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Regla: normalizar monto y validar que sea mayor a 0
      const montoNormalizado = Math.abs(data.monto);

      if (!data.monto || montoNormalizado === 0) {
        throw new HttpException(
          'El monto debe ser mayor a 0',
          HttpStatus.BAD_REQUEST,
        );
      }
	  
	  const fechaCompra = data.fechaCompra
         ? new Date(data.fechaCompra)
         : new Date();

      return await this.prisma.compra.create({
        data: {
          ...data,
          proveedor: data.proveedor.trim(),
          categoria: data.categoria.trim(),
          monto: montoNormalizado,
		  fechaCompra,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error al crear la compra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async obtenerComprasPorProyecto(proyectoId: number) {
    try {
      return await this.prisma.compra.findMany({
        where: { proyectoId },
      });
    } catch (error) {
      throw new HttpException(
        'Error al obtener compras',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async obtenerCostoTotal(proyectoId: number) {
    try {
      const resultado = await this.prisma.compra.aggregate({
        where: { proyectoId },
        _sum: {
          monto: true,
        },
      });

      return {
        proyectoId,
        costoTotal: resultado._sum.monto || 0,
      };
    } catch (error) {
      throw new HttpException(
        'Error al calcular costo total',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}