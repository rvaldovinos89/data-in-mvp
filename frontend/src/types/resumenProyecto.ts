export type ResumenProyecto = {
  proyectoId: number;
  finanzas: {
    presupuesto: number;
    precioVenta: number | null;
    costoTotal: number;
    saldoDisponible: number;
  };
  rendimiento: {
    porcentajeConsumido: number | null;
    margen: number | null;
    margenPorcentaje: number | null;
  };
  estado: {
    estadoFinanciero: string;
    tieneSobreconsumo: boolean;
    tieneMargenNegativo: boolean;
  };
};