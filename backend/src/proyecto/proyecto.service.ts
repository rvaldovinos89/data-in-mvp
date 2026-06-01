import { 
Injectable,
HttpException,
HttpStatus,
NotFoundException,
ConflictException, 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ProyectoService {

  constructor(private prisma: PrismaService) {}

   private async buscarProyectoPorId(id: number) {
    const proyecto = await this.prisma.proyecto.findUnique({
      where: { id },
    });

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return proyecto;
  }
  
  private async calcularCostoTotal(proyectoId: number): Promise<number> {
    const resultado = await this.prisma.compra.aggregate({
      where: { proyectoId },
      _sum: {
        monto: true,
      },
    });

    return resultado._sum.monto || 0;
  }

  async crearProyecto(data: {
    nombre: string;
    empresaId: number;
	presupuesto?: number;
	precioVenta?: number;
  }) {

    try {

      const proyecto = await this.prisma.proyecto.create({
        data:{
			nombre: data.nombre,
			empresaId: data.empresaId,
			presupuesto: data.presupuesto,
			precioVenta: data.precioVenta,
		},
      });

      return proyecto;

    } catch (error) {

      throw new HttpException(
        'Error al crear el proyecto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    }

  }

  async listarProyectos() {

    try {

      return await this.prisma.proyecto.findMany();

    } catch (error) {

      throw new HttpException(
        'Error al obtener proyectos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    }

  }
  
   async actualizarProyecto(
    proyectoId: number,
    data: {
      nombre?: string;
      presupuesto?: number;
      precioVenta?: number;
    },
  ) {
    try {
      const proyecto = await this.buscarProyectoPorId(proyectoId);

      if (proyecto.estado?.toLowerCase() === 'cerrado') {
        throw new ConflictException(
          'El proyecto está cerrado y no permite edición',
        );
      }

      return await this.prisma.proyecto.update({
        where: { id: proyectoId },
        data: {
          nombre: data.nombre,
          presupuesto: data.presupuesto,
          precioVenta: data.precioVenta,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new HttpException(
        'Error al actualizar el proyecto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async obtenerMargen(proyectoId: number) {
    try {
      const proyecto = await this.buscarProyectoPorId(proyectoId);
      const costoTotal = await this.calcularCostoTotal(proyectoId);
      const precioVenta = proyecto.precioVenta || 0;

      return {
        proyectoId,
        costoTotal,
        precioVenta,
        margen: precioVenta - costoTotal,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error al calcular margen',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



   
   
   async obtenerResumenProyecto(proyectoId: number) {
    try {
      const proyecto = await this.buscarProyectoPorId(proyectoId);

      const costoTotal = await this.calcularCostoTotal(proyectoId);
      const presupuesto = proyecto.presupuesto ?? 0;
      const precioVenta = proyecto.precioVenta ?? null;

      const saldoDisponible = presupuesto - costoTotal;

      const porcentajeConsumidoRaw =
        presupuesto > 0 ? (costoTotal / presupuesto) * 100 : null;

      const margen =
        precioVenta && precioVenta > 0 ? precioVenta - costoTotal : null;

      const margenPorcentajeRaw =
        precioVenta && precioVenta > 0
          ? ((precioVenta - costoTotal) / precioVenta) * 100
          : null;
		  
	  const porcentajeConsumido =
      porcentajeConsumidoRaw !== null
        ? Number(porcentajeConsumidoRaw.toFixed(2))
        : null;
		
	  const margenPorcentaje =
      margenPorcentajeRaw !== null
        ? Number(margenPorcentajeRaw.toFixed(2))
        : null;
		
	  const tieneSobreconsumo = costoTotal > presupuesto;
      const tieneMargenNegativo = margen !== null ? margen < 0 : false;
	  
	  let estadoFinanciero = 'SALUDABLE';
	  
	  if (!precioVenta || precioVenta <= 0) {
      estadoFinanciero = 'SIN_PRECIO_VENTA';
      } else if (tieneSobreconsumo) {
      estadoFinanciero = 'SOBRECONSUMO';
      } else if (
      porcentajeConsumido !== null &&
      porcentajeConsumido >= 80 &&
      porcentajeConsumido <= 100
      ) {
      estadoFinanciero = 'EN_RIESGO';
      }
		
      return {
      proyectoId: proyecto.id,
      finanzas: {
        presupuesto,
        precioVenta,
        costoTotal,
        saldoDisponible,
      },
      rendimiento: {
        porcentajeConsumido,
        margen,
        margenPorcentaje,
      },
      estado: {
        estadoFinanciero,
        tieneSobreconsumo,
        tieneMargenNegativo,
      },
    };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error al obtener resumen del proyecto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}